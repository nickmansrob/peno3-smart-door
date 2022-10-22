import express, { Express, Response, Request } from 'express'
import { getDatabase, validate } from './Database.js'
import { AuthRecord, Data, IncomingFace, IncomingOtp, OutgoingAccess, User } from './types.js'
import { Low } from 'lowdb'
import { DateTime } from 'luxon'
import { handleNewUser } from './UserCreation.js'
import { createOtp, validateToken } from './OtpHelper.js'
import { euclidDistance } from './Face.js'

export async function start(): Promise<void> {
  const app: Express = express()
  app.use(express.json())
  
  app.get('/', handleRoot)
  app.get('/users', handleUserView)
  app.post('/users', handleNewUser)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOTP)

  app.listen(3000)

  console.log('Server listening on port 3000')
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleUserView(req: Request, res: Response): Promise<void> {
  const db = getDB()
  res.send(JSON.stringify(db))
}

async function handleOTP(req: Request, res: Response): Promise<void>{
  if (req.body) {
    const stream = req.body as IncomingOtp

    const db = await getDB()
    const user = db.data.users.filter(user => user.id === stream.id)[0] // TODO: Fix non null assertion

    const otpHelper = createOtp(user.tfaToken)

    if (validateToken(otpHelper, stream.otp, stream.timestamp)){
      res.status(200).send(evaluateAccess('GRANTED', user.firstName))
    }
    else {
      res.status(401).send()
    }
  }
  else {
    res.status(400).send()
  }
}

async function handleFace(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const faceToCompare = req.body as IncomingFace

    const db = await getDB()
    const userTable = db.data.users
    
    const distances = userTable.map(user => {
      return [euclidDistance(faceToCompare.faceDescriptor, user.faceDescriptor), user]
    })

    if (distances.length == 0) { // When there are no faces in the database nobody can enter :(

      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))

    } else {

      // In case of an array with only 1 element this element is returned by reduce (and normally no error will be thrown).
      const matchedUser = distances.reduce((previous: [number, User], current: [number, User]) => previous[0] < current[0] ? previous : current)
  
      const THRESHOLD = 0.6 // As used on http://dlib.net/face_recognition.py.html

      if (matchedUser[0] <= THRESHOLD) {
        res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', (matchedUser[1] as User).firstName)))
      } else {
        res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
      }
    }
    
  } else {
    res.status(400).send()
  }
  
}

function evaluateAccess(access: 'GRANTED' | 'DENIED', firstName: string): OutgoingAccess{
  const date = DateTime.now().setZone('Europe/Brussels')
  return {firstName, timestamp: date, access}
}

async function getDB(): Promise<Low<Data>> {
  return await getDatabase()
}

export async function addEntity(table: 'users' | 'records', value: User | AuthRecord) {
  const db = await getDB()
  db.data[table].push(await validate(table, value) as any)
  await db.write()
}

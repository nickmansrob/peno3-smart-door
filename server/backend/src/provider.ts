import express, { Express, Response, Request } from 'express'
import { getDatabase, validate } from './database.js'
import { AuthRecord, Data, FaceToken, OutgoingAccess, User } from './types.js'
import { Low } from 'lowdb'
import { OutgoingMessage } from 'http'

export async function start(): Promise<void> {
  const app: Express = express()
  app.use(express.json())

  app.get('/', handleRoot)
  app.get('/users', handleUserView)
  app.post('/users', handlePostUser)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOTP)

  app.listen(3000)
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleUserView(req: Request, res: Response): Promise<void> {
  const db = getDB()
  res.send(JSON.stringify(db))
}

function handlePostUser(req: Request, res: Response): void {
  if (JSON.parse(req.body)) {
    const stream = req.body as User
    addEntity('users', stream)
    res.status(200).send()
  } else {
    res.status(400).send(req.body)
  }
}

function handleOTP(req: Request, res: Response): void {
  if (JSON.parse(req.body)) {
    const stream = req.body
    res.status(200).send()
  } else {
    res.status(400).send(req.body)
  }
}

async function handleFace(req: Request, res: Response): void {
  if (JSON.parse(req.body)) {
    const request = req.body as FaceToken
    const db = await getDB()
    const userTable = db.data['users']
    console.log(userTable)

    const tokens = userTable.map(user => {return user.faceToken.vertices})

    const distances = tokens.map(token => {return euclidDistance(request.vertices, token)})
    const minimum = Math.min(...distances)
    const minimum_idx = distances.indexOf(minimum)

    const threshold = 0.7 // TODO: change to actual value

    if(minimum <= threshold) {

      // send user of index to dashboard

      res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', userTable[minimum_idx].firstName)))
    }

    else{
      res.status(400).send()
    }
  } 
  
  else {
    res.status(400).send()
  }
  
  
}


function evaluateAccess(access: 'GRANTED' | 'DENIED', user: string): OutgoingAccess{
  const name = user
  const now = new Date()
  const date = now.toLocaleString()
  let outgoing: OutgoingAccess
  if(access === 'GRANTED'){
    outgoing = {firstName : user, timestamp: date, access : 'GRANTED'}
    return outgoing}
  if(access === 'DENIED'){
    outgoing= {firstName : user, timestamp: date, access : 'DENIED'}
    return outgoing
  }
}
  






async function getDB(): Promise<Low<Data>> {
  return await getDatabase()
}

async function addEntity(table: 'users' | 'records', value: User | AuthRecord) {
  const db = await getDB()
  db.data[table].push(await validate(table, value) as any)
  await db.write()
}

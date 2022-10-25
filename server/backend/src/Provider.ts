import express, { Express, Response, Request } from 'express'
import { getDatabase } from './Database.js'
import { AuthRecord, OutgoingAccess, Restriction, User } from './types.js'
import { DateTime } from 'luxon'
import { handleNewUser } from './UserCreation.js'
import { handleFace, handleOTP } from './Access.js'
import { handleUserRecords, handleUserRestriction } from './UserInfo.js'

export async function start(): Promise<void> {
  const app: Express = express()
  app.use(express.json())
  
  app.get('/', handleRoot)
  app.get('/users', handleUserView)
  app.post('/users', handleNewUser)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOTP)

  app.post('/userresctriction', handleUserRestriction)
  app.post('/userrecods', handleUserRecords)


  app.listen(3000)

  console.log('Server listening on port 3000')
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleUserView(req: Request, res: Response): Promise<void> {
  const db = getDatabase()
  res.send(JSON.stringify(db))
}

export function evaluateAccess(access: 'GRANTED' | 'DENIED', firstName: string): OutgoingAccess{
  const date = DateTime.now().setZone('Europe/Brussels')
  return {firstName, timestamp: date, access}
}

export async function addEntity(table: 'users' | 'records' | 'restrictions', value: User | AuthRecord | Restriction) {
  const db = await getDatabase()

  if (table === 'users') {
    db.data['users'].push(value as User)
  } else if (table === 'records') {
    db.data['records'].push(value as AuthRecord) 
  } else if (table === 'restrictions') {
    db.data['restrictions'].push(value as Restriction) 
  } else {
    throw new Error('Table not defined in database')
  }

  await db.write()
}
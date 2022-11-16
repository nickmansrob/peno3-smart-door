import express, { Express, Response, Request } from 'express'
import { getDatabase } from './old/Database.js'
import { Day, GroupRestriction, OutgoingAccess, RestrictionKind, User, UserRecord, UserRestriction } from './old/types.js'
import { DateTime } from 'luxon'
import { handleDeleteUser, handleNewUser } from './old/User.js'
import { handleFace, handleOTP } from './old/Access.js'
import { handleUserRestriction } from './old/User.js'
import { validateAuthRecord, validateRestriction, validateUser } from './old/Validate.js'

export async function start(): Promise<void> {
  const server: Express = express()
  const app = express.Router()

  server.use('/api/', app)

  app.use(express.json())

  app.get('/', handleRoot)

  app.post('/test', (_req: Request, res: Response) => res.status(200).send())

  app.get('/users', handleUserView)
  app.post('/users', handleNewUser)
  app.delete('/users', handleDeleteUser)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOTP)

  app.post('/user_restriction', handleUserRestriction)

  app.get('/user_records', handleRecordsView)
  // app.post('/user_records', handleUserRecords)

  server.listen(3000, () => console.log('Backend running!'))
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleUserView(_req: Request, res: Response): Promise<void> {
  const db = await getDatabase()
  res.send(JSON.stringify(db.chain.get('users').value()))
}

async function handleRecordsView(_req: Request, res: Response): Promise<void> {
  const db = await getDatabase()
  res.send(JSON.stringify(db.chain.get('records').value()))
}

export function evaluateAccess(access: 'GRANTED' | 'DENIED', firstName: string): OutgoingAccess {
  const date = DateTime.now().setZone('Europe/Brussels').toString()
  return { firstName, timestamp: date, access }
}

export async function addEntity(table: 'users' | 'records', param: User | UserRecord): Promise<void> {
  const db = await getDatabase()

  if (table === 'users') {
    const value = param as User

    console.log('Executing table change')

    db.data['users'].push(validateUser(value))

    console.log(`User ${(value as User).firstName} written to cache`)
  } else if (table === 'records') {
    const value = param as UserRecord

    db.chain['records'][param.id].push(validateAuthRecord(value))
  } else {
    throw new Error('Table not defined in database')
  }
  await db.write()
  console.log('Succesfully written to database')
}

export async function addRestriction(
  day: Day,
  restriction: UserRestriction | GroupRestriction,
  kind: RestrictionKind,
): Promise<void> {
  const db = await getDatabase()

  if (kind === 'USER') {
    db.chain.restrictions[day].users.push(validateRestriction(restriction, 'USER') as UserRestriction)
  } else if (kind === 'GROUP') {
    db.chain.restrictions[day].groups.push(validateRestriction(restriction, 'GROUP') as GroupRestriction)
  } else {
    throw new Error('Unknown restriction kind')
  }
  await db.write()
}

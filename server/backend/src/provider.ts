import express, { Express, Response, Request } from 'express'
import { handleFace, handleOtp } from './access.js'
import { getEntries } from './queries.js'
import { handleEditRecord, handleNewRecord, handleRecordView } from './record.js'
import {
  handleDeleteRoleRestriction,
  handleDeleteUserRestriction,
  handleEditRoleRestriction,
  handleEditUserRestriction,
  handleNewRoleRestriction,
  handleNewUserRestriction,
  handleRoleRestrictionView,
  handleUserRestrictionView,
} from './restriction.js'
import { handleDeleteUser, handleEditUser, handleNewUser, handleUserView } from './user.js'

export async function start(): Promise<void> {
  const server: Express = express()
  const app = express.Router()

  server.use('/api/', app)

  app.use(express.json())

  app.get('/', handleRoot)

  app.post('/test', (_req: Request, res: Response) => res.status(200).send())

  app.get('/users', handleUserView)
  app.post('/users', handleNewUser)
  app.put('/users', handleEditUser)
  app.delete('/users', handleDeleteUser)

  app.get('/records', handleRecordView)

  app.get('/user_restrictions', handleUserRestrictionView)
  app.post('/user_restrictions', handleNewUserRestriction)
  app.put('/user_restrictions', handleEditUserRestriction)
  app.delete('/user_restrictions', handleDeleteUserRestriction)

  app.get('/role_restrictions', handleRoleRestrictionView)
  app.post('/role_restrictions', handleNewRoleRestriction)
  app.put('/role_restrictions', handleEditRoleRestriction)
  app.delete('/role_restrictions', handleDeleteRoleRestriction)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOtp)

  app.get('/entries', handleGetEntries)
  app.get('/latest_entries', handleLatestEntries)
  app.get('/range_entries', handleRangeEntries)

  server.listen(3000, () => console.log('Backend running!'))
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleGetEntries(_req: Request, res: Response) {
  res.status(200).json(await getEntries())
}

async function handleLatestEntries(_req: Request, res: Response) {
  res.status(200).json(await getLatestEntries())
}

async function handleRangeEntries(_req: Request, res: Response) {
  res.status(200).json(await getEntries())
}

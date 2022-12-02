import express, { Express, Response, Request } from 'express'
import cors from 'cors'
import { DateTime } from 'luxon'
import { handleFace, handleOtp } from './access.js'
import { getEntries, getLatestEntries, getRangeEntries } from './queries.js'
import { handleRecordView } from './record.js'
import {
  getLatestEnabledUserRecords,
  handleAddFace,
  handleDeleteUser,
  handleEditUser,
  handleNewUser,
  handleRolesView,
  handleUserView,
} from './user.js'
import { validateEndBiggerThanStart } from './validation.js'
import { handleRolePermissionView, handleNewRolePermission, handleEditRolePermission, handleDeleteRolePermission } from './role_permission.js'
import { handleUserPermissionView, handleNewUserPermission, handleEditUserPermission, handleDeleteUserPermission } from './user_permission.js'

export async function start(): Promise<void> {
  const server: Express = express()
  const app = express.Router()

  server.use('/api/', app)

  app.use(express.json())
  app.use(
    cors({
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )

  app.get('/', handleRoot)

  app.post('/test', (_req: Request, res: Response) => res.status(200).send())

  app.get('/roles', handleRolesView)

  app.get('/users', handleUserView)
  app.post('/users', handleNewUser)
  app.put('/users', handleEditUser)
  app.delete('/users', handleDeleteUser)

  app.get('/records', handleRecordView)

  app.get('/user_permissions', handleUserPermissionView)
  app.post('/user_permissions', handleNewUserPermission)
  app.put('/user_permissions', handleEditUserPermission)
  app.delete('/user_permissions', handleDeleteUserPermission)

  app.get('/role_permissions', handleRolePermissionView)
  app.post('/role_permissions', handleNewRolePermission)
  app.put('/role_permissions', handleEditRolePermission)
  app.delete('/role_permissions', handleDeleteRolePermission)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOtp)
  app.post('/add_face', handleAddFace)
  app.post('/access_admin', handleAdminAccess)
  app.post('/get_name', handleGetName)

  app.get('/entries', handleGetEntries)
  app.get('/latest_entries', handleLatestEntries)
  app.get('/range_entries', handleRangeEntries)
  app.get('/latest_status', handleLatestStatus)

  server.listen(3000, () => console.info('Backend running!'))
}

function handleRoot(_req: Request, res: Response): void {
  res.send('Running backend')
}

async function handleGetEntries(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await getEntries())
}

async function handleLatestEntries(req: Request, res: Response): Promise<void> {
  const amount = parseInt(req.query.amount as string)

  if (amount) {
    // validation input
    res.status(200).json(await getLatestEntries(amount))
  } else {
    res.status(400).send('Input invalid')
  }
}

async function handleRangeEntries(req: Request, res: Response): Promise<void> {
  const s = DateTime.fromISO(req.query.s as string)
  const e = DateTime.fromISO(req.query.e as string)

  if (s.isValid && e.isValid && validateEndBiggerThanStart(s, e)) {
    // validation input
    res.status(200).json(await getRangeEntries(s, e))
  } else {
    res.status(400).send('Input invalid')
  }
}

async function handleLatestStatus(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await getLatestEnabledUserRecords())
}

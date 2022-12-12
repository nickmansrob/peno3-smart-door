import express, { Express, Response, Request } from 'express'
import cors from 'cors'
import { DateTime } from 'luxon'
import { handleAdminAccess, handleFace, handleGetName, handleOtp } from './access.js'
import { getEntries, getLatestEntries, getRangeEntries } from './queries.js'
import { handleRecordView } from './record.js'
import {
  getLatestEnabledUserRecord,
  handleAddFace,
  handleDeleteUser,
  handleEditUser,
  handleNewUser,
  handleRolesView,
  handleUserView,
} from './user.js'
import { validateEndBiggerThanStart, validateJWT } from './validation.js'
import {
  handleRolePermissionView,
  handleNewRolePermission,
  handleEditRolePermission,
  handleDeleteRolePermission,
} from './role_permission.js'
import {
  handleUserPermissionView,
  handleNewUserPermission,
  handleEditUserPermission,
  handleDeleteUserPermission,
} from './user_permission.js'

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

  app.get('/roles', (req, res) => validateJWT(req, res, handleRolesView, 'frontend'))

  app.get('/users', (req, res) => validateJWT(req, res, handleUserView, 'frontend'))
  app.post('/users', (req, res) => validateJWT(req, res, handleNewUser, 'frontend'))
  app.put('/users', (req, res) => validateJWT(req, res, handleEditUser, 'frontend'))
  app.delete('/users', (req, res) => validateJWT(req, res, handleDeleteUser, 'frontend'))

  app.get('/records', (req, res) => validateJWT(req, res, handleRecordView, 'frontend'))

  app.get('/user_permissions', (req, res) => validateJWT(req, res, handleUserPermissionView, 'frontend'))
  app.post('/user_permissions', (req, res) => validateJWT(req, res, handleNewUserPermission, 'frontend'))
  app.put('/user_permissions', (req, res) => validateJWT(req, res, handleEditUserPermission, 'frontend'))
  app.delete('/user_permissions', (req, res) => validateJWT(req, res, handleDeleteUserPermission, 'frontend'))

  app.get('/role_permissions', (req, res) => validateJWT(req, res, handleRolePermissionView, 'frontend'))
  app.post('/role_permissions', (req, res) => validateJWT(req, res, handleNewRolePermission, 'frontend'))
  app.put('/role_permissions', (req, res) => validateJWT(req, res, handleEditRolePermission, 'frontend'))
  app.delete('/role_permissions', (req, res) => validateJWT(req, res, handleDeleteRolePermission, 'frontend'))

  app.post('/access_face', (req, res) => validateJWT(req, res, handleFace, 'python'))
  app.post('/access_otp', (req, res) => validateJWT(req, res, handleOtp, 'python'))
  app.post('/add_face', (req, res) => validateJWT(req, res, handleAddFace, 'python'))
  app.post('/access_admin', (req, res) => validateJWT(req, res, handleAdminAccess, 'python'))
  app.post('/get_name', (req, res) => validateJWT(req, res, handleGetName, 'python'))

  app.get('/entries', (req, res) => validateJWT(req, res, handleGetEntries, 'frontend'))
  app.get('/latest_entries', (req, res) => validateJWT(req, res, handleLatestEntries, 'frontend'))
  app.get('/range_entries', (req, res) => validateJWT(req, res, handleRangeEntries, 'frontend'))
  app.get('/latest_status', (req, res) => validateJWT(req, res, handleLatestStatus, 'frontend'))

  server.listen(3000, () => console.info('Backend running!'))
}

function handleRoot(_req: Request, res: Response): void {
  res.json('Running backend')
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
    res.status(400).json('Input invalid')
  }
}

async function handleRangeEntries(req: Request, res: Response): Promise<void> {
  const s = DateTime.fromISO(req.query.s as string)
  const e = DateTime.fromISO(req.query.e as string)

  if (s.isValid && e.isValid && validateEndBiggerThanStart(s, e)) {
    // validation input
    res.status(200).json(await getRangeEntries(s, e))
  } else {
    res.status(400).json('Input invalid')
  }
}

async function handleLatestStatus(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await getLatestEnabledUserRecord())
}

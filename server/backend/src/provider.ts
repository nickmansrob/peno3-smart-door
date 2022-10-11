import express, { Express, Response, Request } from 'express'
import { getDatabase, initializeDatabase, validate } from './database.js'
import { AuthRecord, Data, User } from './types.js'
import { Low } from 'lowdb'

export async function start(): Promise<void> {
  initializeDatabase()
  const app: Express = express()
  app.use(express.json())

  app.get('/', handleRoot)
  app.get('/users', handleUserView)
  app.post('/users', handlePostUser)

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
  console.log(req.body)
  const stream = req.body as User
  addEntity('users', stream)
  res.status(200).send()
}

async function getDB(): Promise<Low<Data>> {
  return await getDatabase()
}

async function addEntity(table: 'users' | 'records', value: User | AuthRecord) {
  const db = await getDB()
  db.data[table].push(await validate(table, value) as any)
  await db.write()
}

import express, { Express, Response, Request } from 'express'
import { getDatabaseInfo, initializeDatabase } from './user.js'

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

function handleUserView(req: Request, res: Response): void {
  const db = getDatabaseInfo()
  res.send(JSON.stringify(db))
}

function handlePostUser(req: Request, res: Response): void {
  const stream = req.body
  console.log(JSON.stringify(stream))
  res.status(200).send()
}

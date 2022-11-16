import { Response, Request } from 'express'
import { prisma } from './database.js'

export async function handleUserView(_req: Request, res: Response): Promise<void> {
  const result = prisma.users.findMany()
  res.json(result)
}
import { Response, Request } from 'express'
import { prisma } from './database.js'

export async function handleRecordView(req: Request, res: Response): Promise<void> {
  res.json(await getRecords(req))
}

async function getRecords(req: Request) {
  const id = parseInt(req.query.id as string)
  if (id) {
    return (await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        records: true,
      },
    }))?.records
  } else {
    return await prisma.userRecord.findMany()
  }
}

export async function handleNewRecord(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleEditRecord(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

import { Response, Request } from 'express'
import { prisma } from './database.js'

export async function handleRecordView(_req: Request, res: Response): Promise<void> {
  res.json(getRecords())
}

async function getRecords(id?: number) {
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

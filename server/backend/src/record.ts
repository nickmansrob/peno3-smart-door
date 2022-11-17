import { Response, Request } from 'express'
import { prisma } from './database.js'

export async function handleRecordView(req: Request, res: Response): Promise<void> {
  res.json(await getRecords(parseInt(req.query.id as string)))
}

async function getRecords(id?: number) {
  if (id) {
    return (
      await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          records: true,
        },
      })
    )?.records
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

/**
 *
 * @param userId The id of the user
 * @param method The way the user got in
 * @returns The success state of the creation
 */
export function createRecord(userId: number, method: string): boolean {
  // TODO: implement
  return true
}

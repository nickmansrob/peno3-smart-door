import { Response, Request } from 'express'
import { prisma } from './database.js'
import { UserRecord } from './types.js'

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

/**
 *
 * @param userId The id of the user
 * @param method The way the user got in
 * @returns The success state of the creation
 */
export async function createRecord(userId: number, method: 'TFA'| 'FACE'): Promise<boolean> {
  // TODO: implement
  const latestUserRecords = getLatestUserRecords() as UserRecord[]
  if (latestUserRecords){
    const lastState = latestUserRecords.filter(record => record.id === userId)[0].state
    try{
      await prisma.record.create({
        data:{
          userId: userId,
          method: method,
          state: lastState
        }
      })
    }
    catch(e) {
      console.error(e)
      return false
    } 
    return true
  }
  else {
    const laststate = 'ENTER'
    try{
      await prisma.record.create({
        data:{
          userId: userId,
          method: method,
          state: laststate
        }
      })
    }
    catch(e) {
      console.error(e)
      return false
    } 
    return true
  }

}


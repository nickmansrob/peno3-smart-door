import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { UserRecord } from './types.js'
import { getLatestEnabledUserEntries } from './user.js'
import { findNextState } from './util.js'

export async function handleRecordView(req: Request, res: Response): Promise<void> {
  // no validation needed
  res.json(await getRecords(parseInt(req.query.id as string)))
}

export async function getRecords(id?: number) {
  // no validation needed
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
export async function createRecord(userId: number, method: 'TFA' | 'FACE'): Promise<boolean> {
  // no validation needed
  const latestUserRecords = (await getLatestEnabledUserEntries()) as UserRecord[]
  if (latestUserRecords) {
    const nextState = await findNextState(userId)
    try {
      await prisma.userRecord.create({
        data: {
          userId: userId,
          method: method,
          state: nextState,
        },
      })
    } catch (e) {
      console.error(e)
      return false
    }
    return true
  } else {
    const nextState = 'ENTER'
    try {
      await prisma.userRecord.create({
        data: {
          userId: userId,
          method: method,
          state: nextState,
        },
      })
    } catch (e) {
      console.error(e)
      return false
    }
    return true
  }
}

export async function getRangeRecords(s: DateTime, e: DateTime) {
  return (
    await prisma.user.findMany({
      select: {
        records: {
          where: {
            timestamp: {
              lte: e.toString(),
              gte: s.toString(),
            },
            state: 'ENTER',
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    })
  ).filter(record => record.records.length !== 0)
}

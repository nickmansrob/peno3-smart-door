import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { CustomInterval, OutgoingAccess, UserRecord } from './types.js'
import { getLatestEnabledUserRecords } from './user.js'

export function euclidDistance(point1: number[], point2: number[]): number {
  const sum = point1
    .map((point, index) => {
      return Math.pow(point - point2[index], 2)
    })
    .reduce((previous, current) => previous + current, 0)
  return Math.sqrt(sum)
}

export function serializeFaceDescriptor(arr: string): number[] {
  return Array.from(JSON.parse(arr))
}

export function evaluateAccess(
  access: 'GRANTED' | 'DENIED' | 'ERROR' | 'RESTRICTED',
  firstName: string,
): OutgoingAccess {
  const date = DateTime.now().setZone('Europe/Brussels').toString()
  return { firstName, timestamp: date, access }
}

/**
 *
 * @param userId the id of the user
 * @returns the next state of the user
 */
export async function findNextState(userId: number): Promise<string> {
  const latestUserRecords = (await getLatestEnabledUserRecords()) as UserRecord[]

  const lastUserState = latestUserRecords.filter(record => record.id === userId)
  if (lastUserState.length > 0) {
    const lastState = lastUserState[0].state
    if (lastState === 'ENTER') {
      return 'LEAVE'
    } else {
      return 'ENTER'
    }
  } else {
    return 'ENTER'
  }
}

export async function getAssociatedUser(record: UserRecord) {
  const user = (
    await prisma.userRecord.findUnique({
      where: {
        id: record.id,
      },
      select: {
        user: true,
      },
    })
  )?.user

  return user
}

/**
 *
 * @param currentTime the current time
 * @param permissionsInterval the interval to be checked
 * @returns true if currentTime is in interval
 */
export function inInterval(currentTime: number, permissionsInterval: CustomInterval): boolean {
  // no validation needed
  const minimumEntry: number = permissionsInterval.s
  const maxEntry: number = permissionsInterval.e
  if (currentTime >= minimumEntry && currentTime <= maxEntry) {
    return true
  } else {
    return false
  }
}

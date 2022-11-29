import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { IncomingFace, IncomingOtp, IncomingRestriction, OutgoingAccess, User, UserRecord } from './types.js'
import { getLatestUserRecords } from './user.js'

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


// Custom type constraints validation
export function validateFaceDescriptor(arr: string | number[]): boolean {
  if (typeof arr === 'string') {
    const array = serializeFaceDescriptor(arr)
    return array.length === 128
  } else {
    return arr.length === 128
  }
}

/**
 *
 * @param restriction the restriction that needs to be validated
 * @returns true if the restriction is of the type IncomingRestriction, otherwise false
 */
export function validateRestriction(restriction: IncomingRestriction): boolean {
  // checking if the restriction from frontend is valid format
  if (
    restriction.e &&
    restriction.s &&
    restriction.id &&
    restriction.weekday &&
    (restriction.weekday === 'MON' || 'TUE' || 'WED' || 'THU' || 'FRI' || 'SAT' || 'SUN') &&
    typeof restriction.e === 'number' &&
    typeof restriction.s === 'number' &&
    typeof restriction.id === 'number'
  ) {
    return true
  } else {
    return false
  }
}

export function validateUser(user: User): boolean {
  if (
    user.dateCreated &&
    user.enabled &&
    user.faceDescriptor &&
    user.firstName &&
    user.id &&
    user.lastName &&
    user.role &&
    user.tfaToken &&
    typeof user.enabled === 'boolean' &&
    validateFaceDescriptor(user.faceDescriptor) &&
    typeof user.firstName === 'string' &&
    typeof user.id === 'number' &&
    typeof user.lastName === 'string' &&
    typeof user.tfaToken === 'string'
  ) {
    return true
  } else {
    return false
  }
}

export function validateNewUser(user: User): boolean {
  if (
    user.firstName &&
    user.lastName &&
    user.role &&
    user.tfaToken &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.tfaToken === 'string'
  ) {
    return true
  } else {
    return false
  }
}

// TODO: everywhere checking what the type of the facedescriptor is and when it will be transfered to a differend type (normally ok now, but be cautious and check)

export function validateIncomingFace(incomingFace: IncomingFace): boolean {
  if (validateFaceDescriptor(incomingFace.faceDescriptor)) {
    // TODO
    return true
  } else {
    return false
  }
}

export function validateIncomingOtp(Otp: IncomingOtp): boolean {
  if (typeof Otp.id === 'number' && typeof Otp.otp === 'string') {
    return true
  } else {
    return false
  }
}

export function validateEndBiggerThanStart(s: DateTime, e: DateTime): boolean {
  const start = s.toUnixInteger()
  const end = e.toUnixInteger()
  return start <= end
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
  const latestUserRecords = (await getLatestUserRecords()) as UserRecord[]

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

export async function getAssociatedUserId(record: UserRecord) {
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

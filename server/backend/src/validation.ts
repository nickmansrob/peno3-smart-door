import { DateTime } from 'luxon'
import { IncomingFace, IncomingOtp, IncomingRestriction, IncomingUserEdit, User } from './types.js'
import { serializeFaceDescriptor } from './util.js'

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

export function validateIncomingUserEdit(userEdit: IncomingUserEdit): boolean {
  if (
    userEdit.firstName &&
    userEdit.id &&
    userEdit.lastName &&
    userEdit.role &&
    typeof userEdit.id === 'number' &&
    typeof userEdit.firstName === 'string' &&
    typeof userEdit.lastName === 'string' &&
    typeof userEdit.role === 'string'
  ) {
    return true
  } else {
    return false
  }
}

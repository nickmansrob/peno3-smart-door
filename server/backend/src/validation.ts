import { DateTime } from 'luxon'
import { IncomingFace, IncomingOtp, IncomingPermission, IncomingUserEdit, User } from './types.js'
import { serializeFaceDescriptor } from './util.js'
import { Request, Response } from 'express'
import { verifyToken } from './auth.js'

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
 * @param permissions the permissions that needs to be validated
 * @returns true if the permissions is of the type IncomingPermission, otherwise false
 */
export function validatePermission(permissions: IncomingPermission): boolean {
  // checking if the permissions from frontend is valid format
  if (
    permissions.e &&
    permissions.s &&
    permissions.id &&
    permissions.weekday &&
    (permissions.weekday === 'MON' || 'TUE' || 'WED' || 'THU' || 'FRI' || 'SAT' || 'SUN') &&
    typeof permissions.e === 'number' &&
    typeof permissions.s === 'number' &&
    typeof permissions.id === 'number' &&
    permissions.s < permissions.e
  ) {
    return true
  } else {
    return false
  }
}

export function validateDeletePermission(permissions: { id: number; weekday: string }): boolean {
  // checking if the permissions from frontend is valid format
  if (
    permissions.id &&
    permissions.weekday &&
    (permissions.weekday === 'MON' || 'TUE' || 'WED' || 'THU' || 'FRI' || 'SAT' || 'SUN') &&
    typeof permissions.id === 'number'
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
    typeof userEdit.lastName === 'string'
  ) {
    return true
  } else {
    return false
  }
}

export async function validateJWT(
  req: Request,
  res: Response,
  handler: (req: Request, res: Response) => Promise<void>,
  env: 'frontend' | 'python',
): Promise<void> {
  const auth = req.headers.authorization

  if (auth && auth.startsWith('Bearer ')) {
    const jwt = auth.split(' ')[1]

    if (verifyToken(jwt, env)) {
      // Token is valid
      return handler(req, res)
    } else {
      // Invalid token
      res.status(401).json('Invalid JWT')
    }
  } else {
    res.status(401).json('Invalid Authorization header')
  }
}

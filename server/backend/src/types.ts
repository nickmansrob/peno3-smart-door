// User
export type User = Id & {
  firstName: string
  lastName: string

  faceDescriptor: string
  tfaToken: string

  role: Role

  dateCreated: Date

  enabled: boolean
}

export type Role = Id & {
  name: string
}

export type IncomingUserEdit = {
  id: number
  firstName: string
  lastName: string
  role: Role
}

// Records

export type UserRecord = Id & {
  timestamp: string
  method?: 'FACE' | 'TFA'
  state: 'ENTER' | 'LEAVE'
}
// Queries

export type LatestEntry = Id & {
  firstName: string
  lastName: string
  timestamp: string
  role: number
}

// Permissions

export type UserPermission = Id & {
  start: number
  end: number
  weekday: string
}

export type RolePermission = Id & {
  start: number
  end: number
  weekday: string
}

export type CustomInterval = {
  s: number // '1730'
  e: number
}

export type IncomingPermission = {
  s: number
  e: number
  id: number
  weekday: string
}

// Access

export type OutgoingAccess = {
  firstName: string
  timestamp: string
  access: 'GRANTED' | 'DENIED' | 'ERROR' | 'RESTRICTED'
}

export type OutgoingAdminAccess = {
  firstName: string
  access: 'GRANTED' | 'DENIED' | 'ERROR' | 'RESTRICTED'
  role: string
}

export type IncomingOtp = Id & {
  otp: string
}

export type IncomingFace = {
  faceDescriptor: number[]
}

export type IncomingNewFace = IncomingFace & Id

// Util

export type Id = {
  id: number
}

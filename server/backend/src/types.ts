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

// Restrictions

export type UserRestriction = Id & {
  start: number
  end: number
  weekday: string
}

export type RoleRestriction = Id & {
  start: number
  end: number
  weekday: string
}

export type CustomInterval = {
  s: number // '1730'
  e: number
}

export type IncomingRestriction = {
  s: number
  e: number
  id: number
  weekday: string
}

// Access

export type OutgoingAccess = {
  firstName: string
  timestamp: string
  access: 'GRANTED' | 'DENIED' | 'ERROR'
}

export type IncomingOtp = Id & {
  otp: string
  timestamp: string
}

export type IncomingFace = {
  faceDescriptor: number[]
}

// Util

export type Id = {
  id: number
}

type RequireAtLeastOne<T> = { [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>> }[keyof T]

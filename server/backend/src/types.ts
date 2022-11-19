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

// Records

export type UserRecord = Id & {
  timestamp: string
  method?: 'FACE' | 'TFA'
  state: 'ENTER' | 'LEAVE'
}

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
  timestamp: string
}

// Util

export type Id = {
  id: number
}

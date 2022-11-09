import { DateTime } from 'luxon'

// Models
export type Data = {
  users: User[]
  records: AuthRecord[]
  restrictions: DayInterval<Restriction>
}

export type User = Id & {
  firstName: string
  lastName: string

  faceDescriptor: number[]
  tfaToken: string

  roles: Role[]

  dateCreated: DateTime

  enabled: boolean
}

// Users

export type ComfirmNewUser = {
  status: 'ACCEPTED' | 'DENIED'
  timestamp: DateTime
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

// Access

export type OutgoingAccess = {
  firstName: string
  timestamp: DateTime
  access: 'GRANTED' | 'DENIED'
}

export type IncomingOtp = Id & {
  otp: string
  timestamp: DateTime
}

export type IncomingFace = {
  faceDescriptor: number[]
  timestamp: DateTime
}

// Records

export type AuthRecord = Id & {
  timestamp: DateTime
  method?: 'FACE' | 'TFA'
  state: 'ENTER' | 'LEAVE'
}

// Restrictions
export type Restriction = {
  users: UserRestriction[]
  groups: GroupRestriction[]
}

export type UserRestriction = {
  id: string
  interval: CustomInterval
}

export type GroupRestriction = {
  role: Role[]
  interval: CustomInterval
}

export type IncomingRestriction = {
  day: Day
  kind: RestrictionKind
  interval: CustomInterval
  restriction: UserRestriction | GroupRestriction
}

export type RestrictionKind = 'USER' | 'GROUP'

export type DayInterval<T> = Record<Day, T>

export type CustomInterval = {
  s: string // '17:30'
  e: string
}

export type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export type Id = {
  id: string
}

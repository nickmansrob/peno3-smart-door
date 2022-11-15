// Models
export type Data = {
  users: User[]
  records: AuthRecord
  restrictions: DayInterval<Restriction>
}

export type User = Id & {
  firstName: string
  lastName: string

  faceDescriptor: number[]
  tfaToken: string

  role: Role

  dateCreated: string

  enabled: boolean
}

// Users

export type ComfirmNewUser = {
  status: 'ACCEPTED' | 'DENIED'
  timestamp: string
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

// Access

export type OutgoingAccess = {
  firstName: string
  timestamp: string
  access: 'GRANTED' | 'DENIED'
}

export type IncomingOtp = Id & {
  otp: string
  timestamp: string
}

export type IncomingFace = {
  faceDescriptor: number[]
  timestamp: string
}

// Records

export type AuthRecord = Record<Id['id'], Record<'records', UserRecord[]>>

export type UserRecord = Id & {
  timestamp: string
  method?: 'FACE' | 'TFA'
  state: 'ENTER' | 'LEAVE'
}

// Restrictions
export type Restriction = {
  users: UserRestriction[]
  groups: GroupRestriction[]
}

export type UserRestriction = Id & {
  interval: CustomInterval
}

export type GroupRestriction = {
  role: Role
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
  s: number // '1730'
  e: number
}

export type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export type Id = {
  id: string
}

import { DateTime, Interval } from 'luxon'

// Models
export type Data = {
  users: User[],
  records: AuthRecord[],
  restrictions: Restriction[],
}

export type User = {
  id: string,
  firstName: string,
  lastName: string,

  faceDescriptor: number[],
  tfaToken: string,

  roles: Role[],

  dateCreated: DateTime,
}

// Users

export type ComfirmNewUser = {
  status: 'ACCEPTED' | 'DENIED',
  timestamp: DateTime,
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

// Access

export type OutgoingAccess = {
  firstName: string,
  timestamp: DateTime,
  access: 'GRANTED' | 'DENIED',
}

export type IncomingOtp = {
  id: string;
  otp: string,
  timestamp: DateTime,
}

export type IncomingFace = {
  faceDescriptor: number[],
  timestamp: DateTime,
}

// Records

export type AuthRecord = {
  id: string,
  timestamp: DateTime,
  method?: 'FACE' | 'TFA',
  state: 'ENTER' | 'LEAVE',
}

// Restrictions
export type Restriction = {
  id: string,
  interval: Interval[],
}

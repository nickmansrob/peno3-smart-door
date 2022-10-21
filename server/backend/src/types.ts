import { DateTime, Interval } from 'luxon'

// Database

export type Data = {
  users: User[],
  records: AuthRecord[],
  restrictions: Restriction[],
}

export type User = {
  id: string,
  firstName: string,
  lastName: string,

  faceToken: FaceToken,
  tfaToken: string,

  roles: Role[],

  dateCreated: DateTime,
}

export type Restriction = {
  id: string,
  interval: Interval[],
}

export type ComfirmNewUser = {
  status: 'ACCEPTED' | 'DENIED',
  timestamp: DateTime,
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

// Auth

export type FaceToken = {
  vertices: number[], // 64
}

// RPi

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

// Records

export type AuthRecord = {
  id: string,
  timestamp: DateTime,
  method: 'FACE' | 'TFA',
  state: 'ENTER' | 'LEAVE',
}


// Errors
export class ValidationError extends Error {
  constructor(m: string) {
    super(m)
  }
}

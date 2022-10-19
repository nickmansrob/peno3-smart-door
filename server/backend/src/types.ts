import { DateTime } from 'luxon'

// Database

export type Data = {
  users: User[],
  records: AuthRecord[],
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

export type ComfirmNewUser = {
  status: 'OK | NOT OK'
  timestamp: DateTime
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

// Auth

export type FaceToken = {
  vertices: number[] // 64
}

// RPi

export type OutgoingAccess = {
  firstName: string,
  timestamp: DateTime,
  access: 'GRANTED' | 'DENIED',
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

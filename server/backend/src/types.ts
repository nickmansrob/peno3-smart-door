import { DateTime } from 'luxon'

export type Data = {
  users: User[],
  records: AuthRecord[],
}

export type User = {
  id: string,
  firstName: string,
  lastName: string,

  faceId: string,
  tfaId: string,

  roles: Role[],

  dateCreated: DateTime,
}

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'VISITOR' | 'SERVICES'

export type FaceId = {
  id: string,
  timestamp: DateTime,
}

export type TfaId = {
  id: string,
  timestamp: DateTime,
}

export type Access = {
  userId: string,
  timestamp: DateTime,
  access: 'GRANTED' | 'DENIED',
}

export type AuthRecord = {
  id: string,
  timestamp: DateTime,
  method: 'FACE' | 'TFA',
  state: 'ENTER' | 'LEAVE',
}

export class ValidationError extends Error {
  constructor(m: string) {
    super(m)
  }
}

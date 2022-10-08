import { DateTime } from 'luxon'

export type Data = {
  user: User,
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
  userId: string,
  timestamp: string,
  method: 'FACE' | 'TFA',
  state: 'ENTER' | 'LEAVE',
}

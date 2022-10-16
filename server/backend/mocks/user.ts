import { AuthRecord, User } from '../src/types.js'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'

export const mockUser: User = {
  id: uuid(),
  firstName: 'Rob',
  lastName: 'Nickmans',

  faceId: uuid(),
  tfaId: uuid(),

  roles: ['ADMIN'],

  dateCreated: DateTime.fromISO('2022-10-08T20:36:11')
}

export const mockRecord: AuthRecord = {
  id: mockUser.id,
  timestamp: DateTime.fromISO('2022-10-08T20:36:11'),
  method: 'FACE',
  state: 'ENTER'
}

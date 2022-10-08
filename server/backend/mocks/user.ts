import { User } from '../src/types.js'
import { v4 as uuid } from 'uuid'
import { DateTime } from 'luxon'

export const mockUser: User = {
  id: uuid(),
  firstName: 'Rob',
  lastName: 'Nickmans',

  faceId: uuid(),
  tfaId: uuid(),

  roles: ['Admin'],

  dateCreated: DateTime.fromISO('2022-10-08T20:36:11')
}
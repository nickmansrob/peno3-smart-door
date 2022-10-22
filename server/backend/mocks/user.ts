import { AuthRecord, Restriction, User } from '../src/types.js'
import { v4 as uuid } from 'uuid'
import { DateTime, Interval } from 'luxon'

export const mockUser: User = {
  id: uuid(),
  firstName: 'Rob',
  lastName: 'Nickmans',

  faceDescriptor: [+uuid()],
  tfaToken: uuid(),

  roles: ['ADMIN'],

  dateCreated: DateTime.fromISO('2022-10-08T20:36:11')
}

export const mockRecord: AuthRecord = {
  id: mockUser.id,
  timestamp: DateTime.fromISO('2022-10-08T20:36:11'),
  method: 'FACE',
  state: 'ENTER'
}

export const mockRestriction: Restriction = {
  id: mockUser.id,
  interval: [Interval.fromDateTimes(DateTime.fromISO('2022-10-08T10:36:11'), DateTime.fromISO('2022-10-08T20:36:11'))]
}

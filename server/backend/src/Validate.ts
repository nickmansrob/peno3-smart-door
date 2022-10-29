import { AuthRecord, GroupRestriction, Restriction, RestrictionKind, User, UserRestriction } from './types.js'

export function validateUser(user: User): User {
  try {
    const _validateUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,

      faceDescriptor: user.faceDescriptor,
      tfaToken: user.tfaToken,

      roles: user.roles,

      dateCreated: user.dateCreated,
    }
  } catch (error) {
    throw new Error('User not following model')
  }
  return user
}

export function validateAuthRecord(record: AuthRecord): AuthRecord {
  try {
    const _validateRecord = {
      id: record.id,
      timestamp: record.timestamp,
      method: record.method,
      state: record.state,
    }
  } catch (error) {
    throw new Error('AuthRecord not following model')
  }
  return record
}

export function validateRestriction(kindRestriction: UserRestriction | GroupRestriction, kind: RestrictionKind): UserRestriction | GroupRestriction{
  if (kind === 'USER') {
    try {
      const restriction = kindRestriction as UserRestriction
      const _validateUserRestriction = {
        id: restriction.id,
        interval: restriction.interval,
      }
    } catch (error) {
      throw new Error('Restriction not following model')
    }
    return kindRestriction
  } else if (kind === 'GROUP') {
    try {
      const restriction = kindRestriction as GroupRestriction
      const _validateUserRestriction = {
        role: restriction.group,
        interval: restriction.interval,
      }
    } catch (error) {
      throw new Error('Restriction not following model')
    }
    return kindRestriction
  } else {
    throw new Error('Unknown restriction kind')
  }
}

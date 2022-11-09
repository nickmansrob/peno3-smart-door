import { GroupRestriction, RestrictionKind, User, UserRecord, UserRestriction } from './types.js'

export function validateUser(user: User): User {
  if (
    user.id &&
    user.firstName &&
    user.lastName &&
    user.faceDescriptor &&
    user.tfaToken &&
    user.role &&
    user.dateCreated
  ) {
    return user
  } else {
    console.error('User not following model')
  }
}

export function validateAuthRecord(record: UserRecord): UserRecord {
  if (record.id && record.timestamp && record.method && record.state) {
    return record
  } else {
    console.error('AuthRecord not following model')
  }
}

export function validateRestriction(
  kindRestriction: UserRestriction | GroupRestriction,
  kind: RestrictionKind,
): UserRestriction | GroupRestriction {
  if (kind === 'USER') {
    const restriction = kindRestriction as UserRestriction

    if (restriction.id && restriction.interval) {
      return kindRestriction
    } else {
      console.error('Restriction not following model')
    }
  } else if (kind === 'GROUP') {
    const restriction = kindRestriction as GroupRestriction

    if (restriction.role && restriction.interval) {
      return kindRestriction
    } else {
      console.error('Restriction not following model')
    }
  } else {
    console.error('Unknown restriction kind')
  }
}

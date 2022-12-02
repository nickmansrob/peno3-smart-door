import { UserPermission, RolePermission } from '@prisma/client'
import { DateTime } from 'luxon'
import { getRolePermissions } from './role_permission.js'
import { CustomInterval } from './types.js'
import { getUserPermissions } from './user_permission.js'
import { findNextState, inInterval } from './util.js'

/**
 *
 * @param userId the id of the user where the lastState needed to be found of
 * @returns the last state of the user that is seen in the records
 */

export async function isPermitted(userId: number, role: number): Promise<boolean> {
  // general used information
  const currentTime = DateTime.now().hour * 100 + DateTime.now().minute
  const currentDay = DateTime.now().weekdayShort.toUpperCase()

  // if user enters we need to check everything if the user leaves he is not permitted to leave, if there are not records, his state is entering
  const nextState = await findNextState(userId)

  if (nextState === 'ENTER') {
    // getting all the permissions in one array
    const userPermissions = ((await getUserPermissions(userId)) as UserPermission[])
      .filter(permissions => permissions.weekday === currentDay)
      .map(permissions => {
        return { s: permissions.start, e: permissions.end } as CustomInterval
      })
    const groupPermissions = ((await getRolePermissions(role)) as RolePermission[])
      .filter(permissions => permissions.weekday === currentDay)
      .map(permissions => {
        return { s: permissions.start, e: permissions.end } as CustomInterval
      })

    const allPermissions = [...userPermissions, ...groupPermissions]

    // if there are no permissions, the person is denied access
    if (allPermissions.length === 0) {
      return false
    } else {
      const booleanPermissions = allPermissions.map(permissions => inInterval(currentTime, permissions))
      if (booleanPermissions.includes(false)) {
        return false
      } else {
        return true
      }
    }
  } else {
    return true // User can always exit
  }
}

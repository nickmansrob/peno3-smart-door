import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { CustomInterval, IncomingPermission, RolePermission, UserPermission } from './types.js'
import { findNextState, inInterval } from './util.js'
import { validatePermission } from './validation.js'

export async function handleUserPermissionView(req: Request, res: Response): Promise<void> {
  // no validation needed
  res.json(await getUserPermissions(parseInt(req.query.id as string)))
}

export async function getUserPermissions(id?: number) {
  // no validation needed
  if (id) {
    return (
      await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          permissions: true,
        },
      })
    )?.permissions
  } else {
    return await prisma.userPermission.findMany()
  }
}

export async function handleNewUserPermission(req: Request, res: Response): Promise<void> {
  const restriction = req.body as IncomingPermission
  if (validatePermission(restriction)) {
    // validation input
    if ((await findUserPermission(restriction)).length === 0)
      try {
        const result = await prisma.userPermission.create({
          data: {
            userId: restriction.id,
            start: restriction.s,
            end: restriction.e,
            weekday: restriction.weekday,
          },
        })
        res.json(result)
      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'The permissions could not be created' })
      }
    else {
      res.status(400).send('There already is a restriction for this user')
    }
  } else {
    res.status(400).send('The restriction has the wrong format')
  }
}

async function findUserPermission(restriction: IncomingPermission) {
  const restricionIdArray = await prisma.userPermission.findMany({
    where: {
      userId: restriction.id,
      weekday: restriction.weekday,
    },
    select: {
      id: true,
    },
  })
  return restricionIdArray
}

export async function handleEditUserPermission(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const restriction = req.body as IncomingPermission

    if (validatePermission(restriction)) {
      // validation input
      const restrictionIdArray = await findUserPermission(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.userPermission.update({
            where: { id: restrictionId },
            data: {
              start: restriction.s,
              end: restriction.e,
            },
          })
          res.status(200).send('restriction edited')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'restriction could not be edited' })
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).send('Validation of found permissions failed')
      }
    }
    // validation input failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

export async function handleDeleteUserPermission(req: Request, res: Response): Promise<void> {
  // find id of restriction that needs to be deleted

  if (req.body) {
    const restriction = req.body as IncomingPermission

    if (validatePermission(restriction)) {
      // validation input
      const restrictionIdArray = await findUserPermission(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.userPermission.delete({
            where: { id: restrictionId },
          })
          res.status(200).send('restriction deleted')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'restriction could not be deleted' })
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).send('Validation of found permissions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

// Role permissions

export async function handleRolePermissionView(req: Request, res: Response): Promise<void> {
  // no validation needed
  res.json(getRolePermissions(parseInt(req.query.name as string)))
}

export async function getRolePermissions(id?: number) {
  if (id) {
    // 'validation' input
    return (
      await prisma.role.findUnique({
        where: {
          id: id,
        },
        select: {
          permissions: true,
        },
      })
    )?.permissions
  } else {
    return await prisma.rolePermission.findMany()
  }
}

export async function handleNewRolePermission(req: Request, res: Response): Promise<void> {
  const restriction = req.body as IncomingPermission
  if (validatePermission(restriction)) {
    // validation input
    if ((await findUserPermission(restriction)).length === 0) {
      // validation amount of
      try {
        const result = await prisma.rolePermission.create({
          data: {
            roleId: restriction.id,
            start: restriction.s,
            end: restriction.e,
            weekday: restriction.weekday,
          },
        })
        res.json(result)
      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'The permissions could not be created' })
      }
    } else {
      res.status(400).send('There already is a restriction for this role')
    }
  } else {
    res.status(400).send('The restriction has the wrong format')
  }
}

/**
 * @param req =  IncomingPermission
 * @param res = void of res.send
 * in database wisselen
 */

async function findRolePermission(restriction: IncomingPermission) {
  // no validation needed
  const restricionIdArray = await prisma.rolePermission.findMany({
    where: {
      roleId: restriction.id,
      weekday: restriction.weekday,
    },
    select: {
      id: true,
    },
  })
  return restricionIdArray
}

export async function handleEditRolePermission(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const restriction = req.body as IncomingPermission

    if (validatePermission(restriction)) {
      // validation input
      const restrictionIdArray = await findRolePermission(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.rolePermission.update({
            where: { id: restrictionId },
            data: {
              start: restriction.s,
              end: restriction.e,
            },
          })
          res.status(200).send('restriction edited')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'restriction could not be edited' })
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).send('Validation of found permissions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

/**
 * @param req =  IncomingPermission
 * @param res = res.send
 * @returns void
 * deleting role restriction in database
 */
export async function handleDeleteRolePermission(req: Request, res: Response): Promise<void> {
  // find id of restriction that needs to be deleted

  if (req.body) {
    const restriction = req.body as IncomingPermission

    if (validatePermission(restriction)) {
      // validation input
      const restrictionIdArray = await findRolePermission(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.rolePermission.delete({
            where: { id: restrictionId },
          })
          res.status(200).send('restriction deleted')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'restriction could not be deleted' })
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).send('Validation of found permissions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

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
      .filter(restriction => restriction.weekday === currentDay)
      .map(restriction => {
        return { s: restriction.start, e: restriction.end } as CustomInterval
      })
    const groupPermissions = ((await getRolePermissions(role)) as RolePermission[])
      .filter(restriction => restriction.weekday === currentDay)
      .map(restriction => {
        return { s: restriction.start, e: restriction.end } as CustomInterval
      })

    const allPermissions = [...userPermissions, ...groupPermissions]

    // if there are no permissions, the person is denied access
    if (allPermissions.length === 0) {
      return false
    } else {
      const booleanPermissions = allPermissions.map(restriction => inInterval(currentTime, restriction))
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

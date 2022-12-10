import { Response, Request } from 'express'
import { prisma } from './database.js'
import { IncomingPermission } from './types.js'
import { validatePermission } from './validation.js'

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
  if (req.body) {
    const permissions = req.body as IncomingPermission
    if (validatePermission(permissions)) {
      // validation input
      if ((await findRolePermission(permissions)).length === 0) {
        // validation amount of
        try {
          const result = await prisma.rolePermission.create({
            data: {
              roleId: permissions.id,
              start: permissions.s,
              end: permissions.e,
              weekday: permissions.weekday,
            },
          })
          res.json(result)
        } catch (e) {
          console.error(e)
          res.status(500).json('The permission could not be created')
        }
      } else {
        res.status(409).json(`There already is a permissions for this role with id: ${permissions.id}`)
      }
    } else {
      res.status(400).json(`IncomingPermission: ${JSON.stringify(req.body)} invalid`)
    }
  } else {
    res.status(400).json('Bad Request')
  }
}

/**
 * @param req =  IncomingPermission
 * @param res = void of res.send
 * in database wisselen
 */

async function findRolePermission(permissions: IncomingPermission) {
  // no validation needed
  const restricionIdArray = await prisma.rolePermission.findMany({
    where: {
      roleId: permissions.id,
      weekday: permissions.weekday,
    },
    select: {
      id: true,
    },
  })
  return restricionIdArray
}

export async function handleEditRolePermission(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const permissions = req.body as IncomingPermission

    if (validatePermission(permissions)) {
      // validation input
      const permissionsIdArray = await findRolePermission(permissions)

      // validation incoming permissions succeeded, now validating result findMany and if ok, then deleting the permissions
      if (permissionsIdArray.length === 1 && typeof permissionsIdArray[0].id === 'number') {
        const permissionsId = permissionsIdArray[0].id

        // validation result findMany succeeded, now the permissions will be deleted
        try {
          await prisma.rolePermission.update({
            where: { id: permissionsId },
            data: {
              start: permissions.s,
              end: permissions.e,
            },
          })
          res.status(200).json('permissions edited')
        } catch (e) {
          console.error(e)
          res.status(500).json('permissions could not be edited')
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).json(`Validation of found permissions: ${permissionsIdArray} failed`)
      }
    }
    // validation failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json(`IncomingPermission: ${JSON.stringify(req.body)} invalid`)
    }

    // if there is no req.body
  } else {
    res.status(400).json('Bad Request')
  }
}

/**
 * @param req =  IncomingPermission
 * @param res = res.send
 * @returns void
 * deleting role permissions in database
 */
export async function handleDeleteRolePermission(req: Request, res: Response): Promise<void> {
  // find id of permissions that needs to be deleted

  if (req.body) {
    const permissions = req.body as IncomingPermission

    if (validatePermission(permissions)) {
      // validation input
      const permissionsIdArray = await findRolePermission(permissions)

      // validation incoming permissions succeeded, now validating result findMany and if ok, then deleting the permissions
      if (permissionsIdArray.length === 1 && typeof permissionsIdArray[0].id === 'number') {
        const permissionsId = permissionsIdArray[0].id

        // validation result findMany succeeded, now the permissions will be deleted
        try {
          await prisma.rolePermission.delete({
            where: { id: permissionsId },
          })
          res.status(200).json('permissions deleted')
        } catch (e) {
          console.error(e)
          res.status(500).json('permissions could not be deleted')
        }
      }

      // validation of results findMany did not return true
      else {
        res.status(500).json(`Validation of found permissions: ${permissionsIdArray} failed`)
      }
    }
    // validation failed
    else {
      console.error('IncomingPermission invalid')
      res.status(400).json(`IncomingPermission: ${JSON.stringify(req.body)} invalid`)
    }

    // if there is no req.body
  } else {
    res.status(400).json('Bad Request')
  }
}

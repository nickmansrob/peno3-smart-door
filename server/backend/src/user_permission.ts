import { Response, Request } from 'express'
import { prisma } from './database.js'
import { IncomingPermission } from './types.js'
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
  const permissions = req.body as IncomingPermission
  if (validatePermission(permissions)) {
    // validation input
    if ((await findUserPermission(permissions)).length === 0)
      try {
        const result = await prisma.userPermission.create({
          data: {
            userId: permissions.id,
            start: permissions.s,
            end: permissions.e,
            weekday: permissions.weekday,
          },
        })
        res.json(result)
      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'The permissions could not be created' })
      }
    else {
      res.status(400).send('There already is a permissions for this user')
    }
  } else {
    res.status(400).send('The permissions has the wrong format')
  }
}

async function findUserPermission(permissions: IncomingPermission) {
  const restricionIdArray = await prisma.userPermission.findMany({
    where: {
      userId: permissions.id,
      weekday: permissions.weekday,
    },
    select: {
      id: true,
    },
  })
  return restricionIdArray
}

export async function handleEditUserPermission(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const permissions = req.body as IncomingPermission

    if (validatePermission(permissions)) {
      // validation input
      const permissionsIdArray = await findUserPermission(permissions)

      // validation incoming permissions succeeded, now validating result findMany and if ok, then deleting the permissions
      if (permissionsIdArray.length === 1 && typeof permissionsIdArray[0].id === 'number') {
        const permissionsId = permissionsIdArray[0].id

        // validation result findMany succeeded, now the permissions will be deleted
        try {
          await prisma.userPermission.update({
            where: { id: permissionsId },
            data: {
              start: permissions.s,
              end: permissions.e,
            },
          })
          res.status(200).send('permissions edited')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'permissions could not be edited' })
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
  // find id of permissions that needs to be deleted

  if (req.body) {
    const permissions = req.body as IncomingPermission

    if (validatePermission(permissions)) {
      // validation input
      const permissionsIdArray = await findUserPermission(permissions)

      // validation incoming permissions succeeded, now validating result findMany and if ok, then deleting the permissions
      if (permissionsIdArray.length === 1 && typeof permissionsIdArray[0].id === 'number') {
        const permissionsId = permissionsIdArray[0].id

        // validation result findMany succeeded, now the permissions will be deleted
        try {
          await prisma.userPermission.delete({
            where: { id: permissionsId },
          })
          res.status(200).send('permissions deleted')
        } catch (e) {
          console.error(e)
          res.status(500).json({ error: 'permissions could not be deleted' })
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

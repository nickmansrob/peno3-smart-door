import { Response, Request } from 'express'
import { prisma } from './database.js'
import { IncomingNewFace, IncomingUserEdit, User, UserRecord } from './types.js'
import { validateFaceDescriptor, validateIncomingUserEdit, validateNewUser } from './util.js'

export async function handleUserView(req: Request, res: Response): Promise<void> {
  res.json(await getUsers(parseInt(req.query.id as string))) // styx.rndevelopment.be/api/users?id=1
}

export async function handleAddFace(req: Request, res: Response): Promise<void> {
  const face = req.body as IncomingNewFace

  const user = (await getUsers(face.id)) as User

  if (user && user.faceDescriptor === '[]' && validateFaceDescriptor(face.faceDescriptor)) { // validation input
    try {
      const result = await prisma.user.update({
        where: {
          id: face.id,
        },
        data: {
          faceDescriptor: JSON.stringify(face.faceDescriptor),
          enabled: true,
        },
      })
      res.json(result)
    } catch (e) {
      console.error(e)
      res.status(500).json({
        error: 'User could not be updated.',
      })
    }
  } else {
    res.status(400).json({
      error: 'Invalid new employee',
    })
  }
}


export async function handleRolesView(_req: Request, res: Response): Promise<void> { // no validation needed 
  res.json(await prisma.role.findMany())
}

export async function getUsers(id?: number) { // no validation needed
  if (id) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        role: true,
      },
    })
  } else {
    return await prisma.user.findMany({
      where: {
        enabled: true,
      },
    })
  }
}

export async function handleNewUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const user = req.body as User
    if (validateNewUser(user)) {
      console.info(`Incoming user: ${JSON.stringify(user)}`)
    if (validateNewUser(user)) { // validation input
      console.log(`Incoming user: ${JSON.stringify(user)}`)
      try {
        console.info('Trying to write user')
        const result = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            faceDescriptor: '[]',
            tfaToken: user.tfaToken,
            enabled: false,
            role: {
              connectOrCreate: {
                where: {
                  name: user.role.name,
                },
                create: {
                  name: user.role.name,
                },
              },
            },
          },
        })
        console.info('Wrote user')
        res.json(result)
      } catch (e) {
        console.error(e)
        res.status(500).json({
          error: 'User could not be created.',
        })
      }
    } else {
      console.error('faceDescriptor invalid')
      res.status(400).json({
        error: 'faceDescriptor invalid',
      })
    }
  } else {
    res.status(400).send()
  }
}

/**
 * @param req = wat het wil verandern parameter, en naar wat het het wil verandern in array of in ...?
 * @param res = void of res.send
 * De dingen in de database veranderen
 * // const filtered = JSON.parse(JSON.stringify(stream))
 */
export async function handleEditUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const userEdit = req.body as IncomingUserEdit
    if (validateIncomingUserEdit(userEdit)) { // validation input

      // if the user is deleted than it can not be edited
      const enabledUser = await prisma.user.findUnique({
        where: {id: userEdit.id},
        select: {enabled: true}
      })
      if (enabledUser){
        try {
          const result = await prisma.user.update({
            where: { id: userEdit.id },
            data: {
              firstName: userEdit.firstName,
              lastName: userEdit.lastName,
              role: {
                connectOrCreate: {
                  where: {
                    name: userEdit.role.name,
                  },
                  create: {
                    name: userEdit.role.name,
                  },
                },
              },
            },
          })
          res.json(result)
        } catch (e) {
          console.error(e)
          res.status(500).json({
            error: 'User could not be edited.',
          })
        }
      }
      else{
        res.status(400).send('A deleted user can not be edited')
      }
    } else {
      console.error('IncomingUserEdit invalid')
      res.status(400).json({
        error: 'IncomingUserEdit invalid',
      })
    }
  } else {
    res.status(400).send()
  }
}



/**
 * @param req =  delete user met id = ... number  { id: 1, lastName: 'Robbe' }
 * @param res = void of res.send
 * alles blank : facedescriptor = [], strings => '', numbers => 0
 * id = blijft behouden
 * naam = 'Deleted User'
 * enabled = false
 */
export async function handleDeleteUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const userId = parseInt(req.query.id as string)
    if (typeof userId === 'number') { // validation input
      try {
        const result = await prisma.user.update({
          where: { id: userId },
          data: {
            firstName: `deletedUser${userId}`,
            lastName: `deletedUser${userId}`,
            faceDescriptor: '[]',
            enabled: false,
          },
        })
        res.json(result)
      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'User could not be deleted' })
      }
    } else {
      console.error('Id invalid')
      res.status(400).json({
        error: 'IncomingUserDelete invalid',
      })
    }
  } else {
    res.status(400).send()
  }
}

export async function getAllActiveUsers(): Promise<number> { // no validation needed
  const users = await getUsers()

  if (users) {
    const userArray = [users].flat()
    return userArray.filter(user => user.enabled).length
  } else {
    return 0
  }
}

export async function getLatestEnabledUserRecords(): Promise<UserRecord[] | undefined> {
  const records = (
    await prisma.user.findMany({
      select: {
        records: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
      where: {
        enabled: true,
      },
    })
  ).filter(record => record.records.length !== 0)

  if (records) {
    return records.map(object => {
      if (object.records.length > 1) {
        console.warn('Latest userRecord has multiple records! Taking the first one.')
      }

      const record = {
        id: object.records[0]?.userId,
        timestamp: object.records[0]?.timestamp.toISOString(),
        method: object.records[0]?.method,
        state: object.records[0]?.state,
      } as UserRecord

      return record
    })
  }
}

/**
 * @returns the latest record for each user or undefined if no records are present
 */

export async function getLatestUserRecords(): Promise<UserRecord[] | undefined> { // no validation needed
  const records = (
    await prisma.user.findMany({
      select: {
        records: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      }
    })
  ).filter(record => record.records.length !== 0)

  if (records) {
    return records.map(object => {
      if (object.records.length > 1) {
        console.warn('Latest userRecord has multiple records! Taking the first one.')
      }

      const record = {
        id: object.records[0]?.userId,
        timestamp: object.records[0]?.timestamp.toISOString(),
        method: object.records[0]?.method,
        state: object.records[0]?.state,
      } as UserRecord

      return record
    })
  }
}

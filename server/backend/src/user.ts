import { Response, Request } from 'express'
import { prisma } from './database.js'
import { User, UserRecord } from './types.js'
import { validateFaceDescriptor } from './util.js'

export async function handleUserView(req: Request, res: Response): Promise<void> {
  res.json(await getUsers(parseInt(req.query.id as string))) // styx.rndevelopment.be/api/users?id=1
}

export async function getUsers(id?: number) {
  if (id) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
  } else {
    return await prisma.user.findMany()
  }
}

export async function handleNewUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const user = req.body as User
    if (validateFaceDescriptor(user.faceDescriptor)) {
      try {
        const result = await prisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            faceDescriptor: user.faceDescriptor,
            tfaToken: user.tfaToken,
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

export async function handleEditUser(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteUser(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function getAllActiveUsers(): Promise<number> {
  const users = await getUsers()

  if (users) {
    const userArray = [users].flat()
    return userArray.filter(user => user.enabled).length
  } else {
    return 0
  }
}

/**
 * @returns the latest record for each user or undefined if no records are present
 */

export async function getLatestUserRecords(): Promise<UserRecord[] | undefined> {
  const records = await prisma.user.findMany({
    select: {
      records: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
  })

  if (records) {
    return records.map(object => {
      if (object.records.length != 1) {
        console.warn('Latest userRecord has multiple records! Taking the first one.')
      }

      const record = {
        id: object.records[0].userId,
        timestamp: object.records[0].timestamp.toISOString(),
        method: object.records[0].method,
        state: object.records[0].state,
      } as UserRecord

      return record
    })
  }
}

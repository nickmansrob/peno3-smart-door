import { Response, Request } from 'express'
import { prisma } from './database.js'
import { User } from './types.js'

export async function handleUserView(_req: Request, res: Response): Promise<void> {
  res.json(getUsers())
}

async function getUsers(id?: number) {
  if (id) {
    return await prisma.user.findUnique({
      where: {
        id: id
      }
    })
  } else {
    return await prisma.user.findMany()
  }
}

export async function handleNewUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const user = req.body as User
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
                name: user.role.name
              },
              create: {
                name: user.role.name
              }
            }
          }
        },
      })
      res.json(result)
    } catch (e) {
      res.status(409).json({
        error: 'User already exists!',
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

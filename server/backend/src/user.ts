import { Response, Request } from 'express'
import { prisma } from './database.js'
import { IncomingUserEdit, User, UserRecord } from './types.js'
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
      include: {
        role: true,
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
      console.log(`Incoming user: ${JSON.stringify(user)}`)
      try {
        console.log('Trying to write user')
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
        console.log('Wrote user')
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
    if (validateIncomingUserEdit(userEdit)) {
      try {
        const result = await prisma.user.update({
          where: { id: userEdit.id },
          data: userEdit
        }) 
        res.json(result) }
      catch (e) {
        console.error(e)
        res.status(500).json({
          error: 'User could not be edited.',
        })
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

function validateIncomingUserEdit(userEdit: IncomingUserEdit): boolean{
  if (
    (userEdit.firstName && userEdit.id && userEdit.lastName && userEdit.role &&
      typeof userEdit.id === 'number' &&
      typeof userEdit.firstName === 'string'&&
      typeof userEdit.lastName === 'string' &&
      typeof userEdit.role === 'string')
  ) {
    return true
  } else {
    return false
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
  if (req.body){
    const userId = req.body as number
    if (typeof userId === 'number'){
      try {
        const result = await prisma.user.update({
          where : { id: userId}, 
          data: {
            firstName : '', 
            lastName: '', 
            faceDescriptor: '[]', 
            role: '',  // juist zo want type Role is een beetje raar 
            enabled: false
          }
        })
        res.json(result)
      }
      catch(e) {
        console.error(e)
        res.status(500).json({error: 'User could not be deleted'})
      } 
    }
    else {
      console.error('Id invalid')
      res.status(400).json({
        error: 'IncomingUserEdit invalid'
      })
    }
  }
  else {
    res.status(400).send()
  }
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

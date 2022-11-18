import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { CustomInspectFunction, isDeepStrictEqual } from 'util'
import { prisma } from './database.js'
import { CustomInterval, IncomingRestriction, User, UserRestriction } from './types.js'

export async function handleUserRestrictionView(req: Request, res: Response): Promise<void> {
  res.json(await getUserRestrictions(parseInt(req.query.id as string)))
}

export async function getUserRestrictions(id?: number) {
  if (id) {
    return (
      await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          restrictions: true,
        },
      })
    )?.restrictions
  } else {
    return await prisma.userRestriction.findMany() // TODO: return all restrictions
  }
}

export async function handleNewUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleEditUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

// Role restrictions

export async function handleRoleRestrictionView(req: Request, res: Response): Promise<void> {
  res.json(getRoleRestrictions(parseInt(req.query.id as string)))
}

export async function getRoleRestrictions(id?: number) {
  if (id) {
    return (
      await prisma.role.findUnique({
        where: {
          id: id,
        },
        include: {
          restrictions: true,
        },
      })
    )?.restrictions
  } else {
    return await prisma.roleRestriction.findMany() // TODO: return all restrictions
  }
}

export async function handleNewRoleRestriction(req: Request, res: Response): Promise<void> {  
  // TODO: implement
  const restriction = req.body as IncomingRestriction
  if (validateRestriction(restriction)){
    try {
      const result = await prisma.record.create({
        data:{
          roleId: restriction.id,
          start: restriction.s,
          end: restriction.e,
          weekday: restriction.weekday
        }
      })
      res.json(result)
    }
    catch(e){
      console.error(e)
      res.status(500).json({error: 'The restrictions could not be created'})
    }
  }
  else {
    res.status(400).send('The restriction has the wrong format')
  }
}
export async function handleEditRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export function validateRestriction(restriction: IncomingRestriction): boolean{
  // TODO: checking if the restriction from frontend is valid format
  if(restriction.e && restriction.s && restriction.id && restriction.weekday &&  (restriction.weekday === 'MON' || 'TUE'|| 'WED' || 'THU' || 'FRI' || 'SAT' || 'SUN' ) 
  && typeof (restriction.e) === 'number', typeof (restriction.s) === 'number', typeof (restriction.id) === 'number') {
    return true }
  else{
    return false
  }
}

// Utils

export function inInterval(currentTime: number, restrictionInterval: CustomInterval): boolean {
  // const currentTimeNumber: string = currentTime.replace(':', '')
  const minimumEntry: number = restrictionInterval.s
  const maxEntry: number = restrictionInterval.e
  if (currentTime >= minimumEntry && currentTime <= maxEntry) {
    return true
  } else {
    return false
  }
}


export async function isRestricted(user: User): Promise<boolean> {
  // general used information
  const currentTime = DateTime.now().hour * 100 + DateTime.now().minute
  const currentDay = DateTime.now().weekdayShort.toUpperCase()

  // getting all the restrictions in one array
  const userRestrictions = ((await getUserRestrictions()) as UserRestriction[]).map(restriction => {
    return  {s: restriction.start, e: restriction.end} as CustomInterval
  })
  const groupRestrictions = ((await getUserRestrictions()) as UserRestriction[]).map(restriction => {
    return  {s: restriction.start, e: restriction.end} as CustomInterval
  })

  const allRestrictions = [...userRestrictions, ... groupRestrictions] 

  // if there are no restrictions, the person is granted
  if (allRestrictions.length === 0) {
    return true
  }
  const booleanRestrictions = allRestrictions.map(restriction => inInterval(currentTime, restriction))
  if (booleanRestrictions.includes(false)){
    return false}
  else{
    return true
  }
}

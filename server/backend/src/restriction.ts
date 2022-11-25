import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { CustomInterval, IncomingRestriction, RoleRestriction, UserRestriction } from './types.js'

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
    return await prisma.userRestriction.findMany()
  }
}

export async function handleNewUserRestriction(req: Request, res: Response): Promise<void> {
  const restriction = req.body as IncomingRestriction
  if (validateRestriction(restriction)) {
    try {
      const result = await prisma.userRestriction.create({
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
      res.status(500).json({ error: 'The restrictions could not be created' })
    }
  } else {
    res.status(400).send('The restriction has the wrong format')
  }
}

export async function handleEditUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

// Role restrictions

export async function handleRoleRestrictionView(req: Request, res: Response): Promise<void> {
  res.json(getRoleRestrictions(parseInt(req.query.name as string)))
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
    return await prisma.roleRestriction.findMany()
  }
}

export async function handleNewRoleRestriction(req: Request, res: Response): Promise<void> {
  const restriction = req.body as IncomingRestriction
  if (validateRestriction(restriction)) {
    try {
      const result = await prisma.roleRestriction.create({
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
      res.status(500).json({ error: 'The restrictions could not be created' })
    }
  } else {
    res.status(400).send('The restriction has the wrong format')
  }
}

/**
 * @param req =  [Role en weekday van de te veranderen restriction, welke parameter je wilt veranderen, naar wat je het wil veranderen]
 * @param res = void of res.send
 * in database wisselen
 */
export async function handleEditRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}


/**
 * @param req =  [Role en weekday van de te deleten restriction
 * @param res = void of res.send
 * in database deleten
 */
export async function handleDeleteRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export function validateRestriction(restriction: IncomingRestriction): boolean {
  // TODO: checking if the restriction from frontend is valid format
  if (
    (restriction.e &&
      restriction.s &&
      restriction.id &&
      restriction.weekday &&
      (restriction.weekday === 'MON' || 'TUE' || 'WED' || 'THU' || 'FRI' || 'SAT' || 'SUN') &&
      typeof restriction.e === 'number' &&
      typeof restriction.s === 'number'&&
      typeof restriction.id === 'number')
  ) {
    return true
  } else {
    return false
  }
}

// Utils

/**
 *
 * @param currentTime the current time
 * @param restrictionInterval the interval to be checked
 * @returns true if currentTime is in interval
 */
export function inInterval(currentTime: number, restrictionInterval: CustomInterval): boolean {
  const minimumEntry: number = restrictionInterval.s
  const maxEntry: number = restrictionInterval.e
  if (currentTime >= minimumEntry && currentTime <= maxEntry) {
    return true
  } else {
    return false
  }
}

/**
 *
 * @param userId the id of the user to be checked
 * @param role  the role of the user to be checked
 * @returns false if no restrictions are active
 */
export async function isRestricted(userId: number, role: number): Promise<boolean> {
  // general used information
  const currentTime = DateTime.now().hour * 100 + DateTime.now().minute
  const currentDay = DateTime.now().weekdayShort.toUpperCase()

  // getting all the restrictions in one array
  const userRestrictions = ((await getUserRestrictions(userId)) as UserRestriction[]).map(restriction => {
    return { s: restriction.start, e: restriction.end } as CustomInterval
  })
  const groupRestrictions = ((await getRoleRestrictions(role)) as RoleRestriction[]).map(restriction => {
    return { s: restriction.start, e: restriction.end } as CustomInterval
  })

  const allRestrictions = [...userRestrictions, ...groupRestrictions]

  // if there are no restrictions, the person is granted access
  if (allRestrictions.length === 0) {
    return true
  } else {
    const booleanRestrictions = allRestrictions.map(restriction => inInterval(currentTime, restriction))
    if (booleanRestrictions.includes(false)) {
      return false
    } else {
      return true
    }
  }
}

/**
 To-Do's

 - overal isrestricted / ... naar is allowed hernoemen eventueel

 - implementeren dat in 'isrestrictions' de state wordt meegegeven (via state user op te roepen in acces files) 
 en er dus voor zorgen dat niemand die naar buiten wilt terug gaat => if (state === enter) dan programma zoals normaal, else false

 - overal true and false checken of het gebasserd is op in het interval? dus true uit isRestricted/isAllowed dan is het ok en mag hij binnen

 - validations

 */
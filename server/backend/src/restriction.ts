import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { CustomInterval, IncomingRestriction, RoleRestriction, UserRestriction } from './types.js'
import { findNextState, validateRestriction } from './util.js'

export async function handleUserRestrictionView(req: Request, res: Response): Promise<void> {
  // no validation needed
  res.json(await getUserRestrictions(parseInt(req.query.id as string)))
}

export async function getUserRestrictions(id?: number) {   // no validation needed
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
  if (validateRestriction(restriction)) { // validation input
    if ((await findUserRestriction(restriction)).length === 0)
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
    else {
      res.status(400).send('There already is a restriction for this user')
    }
  } else {
    res.status(400).send('The restriction has the wrong format')
  }
}

async function findUserRestriction(restriction: IncomingRestriction) { 
  const restricionIdArray = await prisma.userRestriction.findMany({
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

export async function handleEditUserRestriction(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const restriction = req.body as IncomingRestriction

    if (validateRestriction(restriction)) { // validation input
      const restrictionIdArray = await findUserRestriction(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.userRestriction.update({
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
        res.status(500).send('Validation of found restrictions failed')
      }
    }
    // validation input failed
    else {
      console.error('IncomingRestriction invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

export async function handleDeleteUserRestriction(req: Request, res: Response): Promise<void> {
  // find id of restriction that needs to be deleted

  if (req.body) {
    const restriction = req.body as IncomingRestriction

    
    if (validateRestriction(restriction)) { // validation input
      const restrictionIdArray = await findUserRestriction(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.userRestriction.delete({
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
        res.status(500).send('Validation of found restrictions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingRestriction invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

// Role restrictions

export async function handleRoleRestrictionView(req: Request, res: Response): Promise<void> { // no validation needed
  res.json(getRoleRestrictions(parseInt(req.query.name as string)))
}

export async function getRoleRestrictions(id?: number) {  
  if (id) { // 'validation' input
    return (
      await prisma.role.findUnique({
        where: {
          id: id,
        },
        select: {
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
  if (validateRestriction(restriction)) { // validation input
    if ((await findUserRestriction(restriction)).length === 0) { // validation amount of 
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
      res.status(400).send('There already is a restriction for this role')
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

async function findRoleRestriction(restriction: IncomingRestriction) { // no validation needed
  const restricionIdArray = await prisma.roleRestriction.findMany({
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

export async function handleEditRoleRestriction(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const restriction = req.body as IncomingRestriction

    
    if (validateRestriction(restriction)) { // validation input
      const restrictionIdArray = await findRoleRestriction(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.roleRestriction.update({
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
        res.status(500).send('Validation of found restrictions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingRestriction invalid')
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
 * @param req =  IncomingRestriction
 * @param res = res.send
 * @returns void
 * deleting role restriction in database
 */
export async function handleDeleteRoleRestriction(req: Request, res: Response): Promise<void> {
  // find id of restriction that needs to be deleted

  if (req.body) {
    const restriction = req.body as IncomingRestriction

   
    if (validateRestriction(restriction)) { // validation input
      const restrictionIdArray = await findRoleRestriction(restriction)

      // validation incoming restriction succeeded, now validating result findMany and if ok, then deleting the restriction
      if (restrictionIdArray.length === 1 && typeof restrictionIdArray[0].id === 'number') {
        const restrictionId = restrictionIdArray[0].id

        // validation result findMany succeeded, now the restriction will be deleted
        try {
          await prisma.roleRestriction.delete({
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
        res.status(500).send('Validation of found restrictions failed')
      }
    }
    // validation failed
    else {
      console.error('IncomingRestriction invalid')
      res.status(400).json({
        error: 'IncomingRestricion invalid',
      })
    }

    // if there is no req.body
  } else {
    res.status(400).send()
  }
}

// Utils

/**
 *
 * @param currentTime the current time
 * @param restrictionInterval the interval to be checked
 * @returns true if currentTime is in interval
 */
export function inInterval(currentTime: number, restrictionInterval: CustomInterval): boolean { // no validation needed
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
 * @param userId the id of the user where the lastState needed to be found of
 * @returns the last state of the user that is seen in the records 
 */

export async function isRestricted(userId: number, role: number): Promise<boolean> {
  // general used information
  const currentTime = DateTime.now().hour * 100 + DateTime.now().minute
  const currentDay = DateTime.now().weekdayShort.toUpperCase()

  // if user enters we need to check everything if the user leaves he is not restricted to leave, if there are not records, his state is entering
  const nextState = await findNextState(userId)

  if (nextState === 'ENTER') {
    // getting all the restrictions in one array
    const userRestrictions = ((await getUserRestrictions(userId)) as UserRestriction[])
      .filter(restriction => restriction.weekday === currentDay)
      .map(restriction => {
        return { s: restriction.start, e: restriction.end } as CustomInterval
      })
    const groupRestrictions = ((await getRoleRestrictions(role)) as RoleRestriction[])
      .filter(restriction => restriction.weekday === currentDay)
      .map(restriction => {
        return { s: restriction.start, e: restriction.end } as CustomInterval
      })

    const allRestrictions = [...userRestrictions, ...groupRestrictions]

    // if there are no restrictions, the person is denied access
    if (allRestrictions.length === 0) {
      return false
    } else {
      const booleanRestrictions = allRestrictions.map(restriction => inInterval(currentTime, restriction))
      if (booleanRestrictions.includes(false)) {
        return false
      } else {
        return true
      }
    }
  } else {
    return true // User can always exit
  }
}

/**
 To-Do's

 - overal isrestricted / ... naar is allowed hernoemen eventueel OK

 - implementeren dat in 'isrestrictions' de state wordt meegegeven (via state user op te roepen in acces files) 
 en er dus voor zorgen dat niemand die naar buiten wilt terug gaat => if (state === enter) dan programma zoals normaal, else true direct (dan leaved hij) OK

 - overal true and false checken of het gebasserd is op in het interval? dus true uit isRestricted/isAllowed dan is het ok en mag hij binnen OK

 - validations

 - validation if a new restriction is added that there was not already one
  - redirecting it to edit or let the frontend do that    OK

 */

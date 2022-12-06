import { Response, Request } from 'express'
import { prisma } from './database.js'
import { createOtp, validateToken } from './otp.js'
import { createRecord } from './record.js'
import { isPermitted } from './permission.js'
import { IncomingFace, IncomingOtp, Role, Id } from './types.js'
import { euclidDistance, evaluateAccess, evaluateAdminAccess, getRole, serializeFaceDescriptor } from './util.js'
import { validateIncomingFace, validateIncomingOtp } from './validation.js'

export async function handleFace(req: Request, res: Response): Promise<void> {
  const THRESHOLD = 0.52 // False accept rate less than 1/1000

  if (req.body) {
    const faceToCompare = req.body as IncomingFace

    if (validateIncomingFace(faceToCompare)) {
      // validation input
      const userTable = await prisma.user.findMany({ where: { enabled: true } })
      const distances = await Promise.all(
        userTable.map(async user => {
          const distance = euclidDistance(serializeFaceDescriptor(user.faceDescriptor), faceToCompare.faceDescriptor)
          return { id: user.id, distance, firstName: user.firstName, roleId: user.roleId } // TODO: put this in a separate function
        }),
      )

      if (distances.length == 0) {
        // When there are no faces in the database nobody can enter :(
        res.status(401).json(evaluateAccess('DENIED', 'Unknown'))
      } else {
        // Find the closest user
        const matchedUser = distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr))

        if (matchedUser.distance <= THRESHOLD) {
          if (await isPermitted(matchedUser.id, matchedUser.roleId)) {
            // Can access
            createRecord(matchedUser.id, 'FACE')
            res.status(200).json(evaluateAccess('GRANTED', matchedUser.firstName))
          } else {
            // Permitted
            res.status(401).json(evaluateAccess('RESTRICTED', matchedUser.firstName))
          }
        } else {
          res.status(401).json(evaluateAccess('DENIED', 'Unknown'))
        }
      }
    } else {
      res.status(400).json(`IncomingFace ${JSON.stringify(req.body)} invalid`)
    }
  } else {
    res.status(400).json('Bad Request')
  }
}

export async function handleOtp(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp

    console.log(`Incoming OTP ${JSON.stringify(stream)}`)
    if (validateIncomingOtp(stream)) {
      // validation input
      const user = await prisma.user.findUnique({
        where: {
          id: stream.id,
        },
      })

      if (user) {
        const otpHelper = createOtp(user.tfaToken)

        console.log(validateToken(otpHelper, stream.otp))

        if (validateToken(otpHelper, stream.otp) != null) {
          if (await isPermitted(user.id, user.roleId)) {
            // User allowed
            const recordCheck = createRecord(user.id, 'TFA') // admin contacteer probleem
            if (await recordCheck) {
              res.status(200).json(evaluateAccess('GRANTED', user.firstName))
            } else {
              res.status(500).json(evaluateAccess('ERROR', user.firstName))
            }
          } else {
            res.status(401).json(evaluateAccess('RESTRICTED', user.firstName))
          }
        } else {
          res.status(401).json(evaluateAccess('DENIED', user.firstName))
        }
      } else {
        res.status(403).json(`User with id: ${stream.id} does not exist`)
      }
    } else {
      res.status(400).json(`OTP Validation of ${JSON.stringify(req.body)} failed`)
    }
  } else {
    res.status(400).json('Bad request')
  }
}

/**
 *
 * @param req id as number
 * @param res  firstName and lastName of person behind the id
 *
 */
export async function handleGetName(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as Id
    if (stream) {
      const user = await prisma.user.findFirst({
        where: {
          id: stream.id,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      })
      res.status(200).json(user)
      if (!user) {
        console.warn(`User with id ${stream.id} could not be found.`)
        res.status(403).json(`User with id ${stream.id} could not be found.`)
      }
    } else {
      res.status(400).json(`Recieved data (id) = ${JSON.stringify(req.body)} is invalid`)
    }
  } else {
    res.status(400).json('Bad Request')
  }
}

export async function handleAdminAccess(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    if (validateIncomingOtp(stream)) {
      // validation input
      const user = await prisma.user.findUnique({
        where: {
          id: stream.id,
        },
      })

      if (user) {
        const otpHelper = createOtp(user.tfaToken)

        if (validateToken(otpHelper, stream.otp) != null) {
          // User allowed
          res.status(200).json(evaluateAdminAccess('GRANTED', user.firstName, await getRole(user.roleId)))
        } else {
          res.status(401).json(evaluateAdminAccess('DENIED', user.firstName, await getRole(user.roleId)))
        }
      } else {
        res.status(403).json(`User with id: ${stream.id}  does not exist`)
      }
    } else {
      res.status(400).json(`OTP Validation of ${JSON.stringify(req.body)} failed`)
    }
  } else {
    res.status(400).json('Bad request')
  }
}

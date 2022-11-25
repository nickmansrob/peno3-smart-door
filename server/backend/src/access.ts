import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { prisma } from './database.js'
import { createOtp, validateToken } from './otp.js'
import { createRecord } from './record.js'
import { isRestricted } from './restriction.js'
import { IncomingFace, IncomingOtp, User } from './types.js'
import { euclidDistance, evaluateAccess, serializeFaceDescriptor } from './util.js'

export async function handleFace(req: Request, res: Response): Promise<void> {
  const THRESHOLD = 0.6 // As used on http://dlib.net/face_recognition.py.html

  if (req.body) {
    const faceToCompare = req.body as IncomingFace

    const userTable = await prisma.user.findMany()
    const distances = await Promise.all(
      userTable.map(async user => {
        const distance = euclidDistance(serializeFaceDescriptor(user.faceDescriptor), faceToCompare.faceDescriptor)
        return { id: user.id, distance, firstName: user.firstName, roleId: user.roleId } // TODO: put this in a separate function
      }),
    )

    if (distances.length == 0) {
      // When there are no faces in the database nobody can enter :(
      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
    } else {
      // Find the closest user
      const matchedUser = distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr))

      if (matchedUser.distance <= THRESHOLD && await isRestricted(matchedUser.id, matchedUser.roleId)) {
        createRecord(matchedUser.id, 'FACE')
        res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', matchedUser.firstName)))
      } else {
        res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
      }
    }
  } else {
    res.status(400).send()
  }
}

export async function handleOtp(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    const user = await prisma.user.findUnique({
      where: {
        id: stream.id,
      },
    })

    if (user) {
      const otpHelper = createOtp(user.tfaToken)
      if (
        validateToken(otpHelper, stream.otp, DateTime.fromISO(stream.timestamp)) &&
        (await isRestricted(user.id, user.roleId))
      ) {
        const recordCheck = createRecord(user.id, 'TFA') // admin contacteer probleem
        if (await recordCheck) {
          res.status(200).send(evaluateAccess('GRANTED', user.firstName))
        } else {
          res.status(500).send(evaluateAccess('ERROR', user.firstName))
        }
      } else {
        res.status(401).send()
      }
    }
  } else {
    res.status(400).send()
  }
}

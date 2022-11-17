import { Response, Request } from 'express'
import { prisma } from './database.js'
import { createRecord } from './record.js'
import { isRestricted } from './restriction.js'
import { IncomingFace } from './types.js'
import { getUsers } from './user.js'
import { euclidDistance, evaluateAccess, serializeFaceDescriptor } from './util.js'

export async function handleFace(req: Request, res: Response): Promise<void> {
  const THRESHOLD = 0.6 // As used on http://dlib.net/face_recognition.py.html

  if (req.body) {
    const faceToCompare = req.body as IncomingFace

    const userTable = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        faceDescriptor: true,
        role: true,
      },
    })

    const distances = await Promise.all(
      userTable.map(async ({ id, firstName, faceDescriptor, role }) => {
        const user = await prisma.user.findUnique({
          where: {
            id: id,
          },
        })
        const distance = euclidDistance(
          serializeFaceDescriptor(faceDescriptor),
          serializeFaceDescriptor(user?.faceDescriptor as string), // Valid typecast because user DOES exist in DB (mapped over userTable)
        )
        return { id, distance, firstName, role } // TODO: put this in a separate function
      }),
    )

    if (distances.length == 0) {
      // When there are no faces in the database nobody can enter :(
      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
    } else {
      // Find the closest user
      const matchedUser = distances.reduce((prev, curr) => (prev.id < curr.id ? prev : curr))

      if (matchedUser.distance <= THRESHOLD && !isRestricted(matchedUser.id)) {
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
  // TODO: implement
}

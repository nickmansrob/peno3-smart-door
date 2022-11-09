import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { getDatabase } from './Database.js'
import { createOtp, validateToken } from './OtpHelper.js'
import { addEntity, evaluateAccess } from './Provider.js'
import { stateUser } from './Queries.js'
import { AuthRecord, IncomingFace, IncomingOtp, User } from './types.js'
import { userRestrictions } from './Restriction.js'

export function euclidDistance(point1: number[], point2: number[]): number {
  const sum = point1
    .map((point, index) => {
      return Math.pow(point - point2[index], 2)
    })
    .reduce((previous, current) => previous + current, 0)
  return Math.sqrt(sum)
}

export async function handleFace(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const faceToCompare = req.body as IncomingFace

    const db = await getDatabase()
    const userTable = db.chain.get('users')

    const distances = userTable.map((user) => {
      return [euclidDistance(faceToCompare.faceDescriptor, user.faceDescriptor), user]
    })

    if (distances.length == 0) {
      // When there are no faces in the database nobody can enter :(

      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
    } else {
      // In case of an array with only 1 element this element is returned by reduce (and normally no error will be thrown).
      const matchedUser = distances.reduce((previous: [number, User], current: [number, User]) =>
        previous[0] < current[0] ? previous : current,
      )

      const THRESHOLD = 0.6 // As used on http://dlib.net/face_recognition.py.html

      if (matchedUser[0] <= THRESHOLD && (await userRestrictions(matchedUser[1] as User)).access === 'GRANTED') {
        res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', (matchedUser[1] as User).firstName)))
        const currentState = await stateUser((matchedUser[1] as User).id)

        if (currentState === 'ENTER' || currentState === 'LEAVE') {
          const record: AuthRecord = {
            id: (matchedUser[1] as User).id,
            timestamp: DateTime.now().setZone('Europe/Brussels'),
            method: 'FACE',
            state: currentState,
          }
          addEntity('records', record)
        } else {
          throw new Error('State is in the wrong format')
        }
      } else {
        res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
      }
    }
  } else {
    res.status(400).send()
  }
}

export async function handleOTP(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    const db = await getDatabase()
    const user = db.chain.get('users').find( {id: stream.id} ).value() as User

    const otpHelper = createOtp(user.tfaToken)

    if (validateToken(otpHelper, stream.otp, stream.timestamp) && (await userRestrictions(user)).access === 'GRANTED') {
      res.status(200).send(evaluateAccess('GRANTED', user.firstName))

      const currentState = await stateUser(user.id)

      if (currentState === 'ENTER' || currentState === 'LEAVE') {
        const record: AuthRecord = {
          id: user.id,
          timestamp: DateTime.now().setZone('Europe/Brussels'),
          method: 'TFA',
          state: currentState,
        }
        addEntity('records', record)
      } else {
        throw new Error('State is in the wrong format')
      }
    } else {
      res.status(401).send()
    }
  } else {
    res.status(400).send()
  }
}

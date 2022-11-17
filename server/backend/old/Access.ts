import { Response, Request } from 'express'
import { DateTime } from 'luxon'
import { getDatabase } from './Database.js'
import { createOtp, validateToken } from './OtpHelper.js'
import { addEntity, evaluateAccess } from '../provider.js'
import { stateUser } from './Queries.js'
import { IncomingFace, IncomingOtp, User, UserRecord } from './types.js'
import { userRestrictions } from './Restriction.js'


export async function handleOTP(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    const db = await getDatabase()
    const user = db.chain.get('users').find({ id: stream.id }).value() as User

    const otpHelper = createOtp(user.tfaToken)

    if (
      validateToken(otpHelper, stream.otp, DateTime.fromISO(stream.timestamp)) &&
      (await userRestrictions(user)).access === 'GRANTED'
    ) {
      res.status(200).send(evaluateAccess('GRANTED', user.firstName))

      const currentState = await stateUser(user.id)

      if (currentState === 'ENTER' || currentState === 'LEAVE') {
        const record: UserRecord = {
          id: user.id,
          timestamp: DateTime.now().setZone('Europe/Brussels').toString(),
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

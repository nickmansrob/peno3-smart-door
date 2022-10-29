import { IncomingRestriction } from './types.js'
import { Response, Request } from 'express'
import { addRestriction } from './Provider.js'

export function handleUserRestriction(req: Request, res: Response): void {
  if (req.body) {
    const incomingRestriction = req.body as IncomingRestriction

    addRestriction(incomingRestriction.day, incomingRestriction.restriction, incomingRestriction.kind)
    res.status(200).send()
  } else {
    res.status(400).send()
  }
}

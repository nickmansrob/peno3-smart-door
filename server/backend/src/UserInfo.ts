import { AuthRecord, Restriction } from './types.js'
import { Response, Request } from 'express'
import { addEntity } from './Provider.js'



export function handleUserRestriction(req: Request, res: Response): void {
  if (req.body) {
    const Restrictions = req.body as Restriction

    addEntity('restrictions', Restrictions)
    res.status(200).send()
  }
  else{
    res.status(400).send()
  }
}

export function handleUserRecords(req: Request, res: Response): void {
  if (req.body) {
    const Records = req.body as AuthRecord

    addEntity('records', Records)
    res.status(200).send()
  }
  else{
    res.status(400).send()
  }
}

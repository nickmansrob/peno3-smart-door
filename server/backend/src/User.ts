import { Response, Request } from 'express'
import { getDatabase } from './Database.js'
import { addEntity, addRestriction } from './Provider.js'
import { Id, IncomingRestriction, User } from './types.js'

export function handleNewUser(req: Request, res: Response): void {
  if (req.body) {
    const user = req.body as User

    addEntity('users', user)
    res.status(200).send()
  } else {
    res.status(400).send()
  }
}

export function handleUserRestriction(req: Request, res: Response): void {
  if (req.body) {
    const incomingRestriction = req.body as IncomingRestriction

    addRestriction(incomingRestriction.day, incomingRestriction.restriction, incomingRestriction.kind)
    res.status(200).send()
  } else {
    res.status(400).send()
  }
}

export async function handleDeleteUser(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const db = await getDatabase()
    const id = req.body as Id

    db.chain.get('users').find( {id: id} ).assign(generateStaleUser(id))

  }
}

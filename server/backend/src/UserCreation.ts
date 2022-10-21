import { Response, Request } from 'express'
import { addEntity } from './Provider.js'
import { User } from './types.js'

export function handleNewUser(req: Request, res: Response): void{
  if (JSON.parse(req.body)) {
    const stream = req.body
    const user = JSON.parse(stream) as User

    addEntity('users', user)
    res.status(200).send()
  }
  else{
    res.status(400).send()
  }
}
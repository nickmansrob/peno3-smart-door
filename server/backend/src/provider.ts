import express, { Express, Response, Request } from 'express'
import { getDatabase, validate } from './database.js'
import { AuthRecord, Data, FaceToken, OutgoingAccess, User } from './types.js'
import { Low } from 'lowdb'
import { OutgoingMessage, request } from 'http'
import { doesNotMatch } from 'assert'
import { allowedNodeEnvironmentFlags } from 'process'

export async function start(): Promise<void> {
  const app: Express = express()
  app.use(express.json())

  app.get('/', handleRoot)
  app.get('/users', handleUserView)
  app.post('/users', handlePostUser)

  app.post('/access_face', handleFace)
  app.post('/access_otp', handleOTP)

  app.listen(3000)
}

function handleRoot(_req: Request, res: Response) {
  res.send('Running backend')
}

async function handleUserView(req: Request, res: Response): Promise<void> {
  const db = getDB()
  res.send(JSON.stringify(db))
}

function handlePostUser(req: Request, res: Response): void {
  if (JSON.parse(req.body)) {
    const stream = req.body as User
    addEntity('users', stream)
    res.status(200).send()
  } else {
    res.status(400).send(req.body)
  }
}

/*
remarks handleOTP 
  very early draft
  a lot of parameters are not possible to add to the user to register in the database (still needs to be added in some way that the frontend can give this info when registering user or send this info to another function to do the rest of the process)
    facetoken (seperate function or registration process for this?), complexity with all the waiting for responses, in this or in other function?
  a way to stop the process when a person can't put in their pin because of some reason needs to be added? so that it can be stopped and won't run for eternity
  sending info to fronted as well?
    */

async function handleOTP(req: Request, res: Response): Promise<void> {
  if (JSON.parse(req.body)) {
    const stream = req.body
    res.status(200).send()

    const newcode = otp.totpURL // wrong, because ? 
    // post request
    await req.body
    const usercode = req.body
    if (usercode === newcode){
      const usertoken = otp.secret
      //add to database
      res.status(200).send('OK')
      // somthing to fronted too? 
    }
    else{
      while (usercode !== newcode) { // | onderbreking krijgen 
        res.status(200).send('NOT OK') }
      if (usercode === newcode){
        const usertoken = otp.secret
        //add to database
        const newUser = {id: usertoken, firstName: 'John', lastName: 'Doe', faceToken: 'facetoken', tfaToken: 'to do', roles: ['SUPERVISOR'], dateCreated: 'to do'}
        addEntity('users', newUser)
        res.status(200).send('OK')
        // somthing to fronted too? 

      // else programma just stops
      }
      else {
        res.status(400).send()
      }
        
    }
  } else {
    res.status(400).send(req.body)
  }
}



// remarks handleFAce
//  the treshold needs to be set right
//  info to the dashboard too?

async function handleFace(req: Request, res: Response): Promise<void> {
  if (JSON.parse(req.body)) {
    const request = req.body as FaceToken
    const db = await getDB()
    const userTable = db.data['users']
    console.log(userTable)

    const tokens = userTable.map(user => {return user.faceToken.vertices})

    const distances = tokens.map(token => {return euclidDistance(request.vertices, token)})
    const minimum = Math.min(...distances)
    const minimum_idx = distances.indexOf(minimum)

    const threshold = 0.7 // TODO: change to actual value

    if(minimum <= threshold) {

      // send user of index to dashboard ? 

      res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', userTable[minimum_idx].firstName)))
    }

    else{
      res.status(400).send()
    }
  } 
  
  else {
    res.status(400).send()
  }
  
}


// TO-DO evaluateAcces:
//  finding right type for date

function evaluateAccess(access: 'GRANTED' | 'DENIED', user: string): OutgoingAccess{
  const now = new Date()
  const date = now.toLocaleString()
  let outgoing: OutgoingAccess
  if(access === 'GRANTED'){
    outgoing = {firstName : user, timestamp: date, access : 'GRANTED'}
    return outgoing}
  if(access === 'DENIED'){
    outgoing= {firstName : user, timestamp: date, access : 'DENIED'}
    return outgoing
  }
}
  






async function getDB(): Promise<Low<Data>> {
  return await getDatabase()
}

async function addEntity(table: 'users' | 'records', value: User | AuthRecord) {
  const db = await getDB()
  db.data[table].push(await validate(table, value) as any)
  await db.write()
}

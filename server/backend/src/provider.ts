import express, { Express, Response, Request } from 'express'
import { getDatabase, validate } from './database.js'
import { AuthRecord, Data, FaceToken, OutgoingAccess, User } from './types.js'
import { Low } from 'lowdb'
import { DateTime } from 'luxon'
import OTP from 'otp'

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

/**
 * req = {volledige ID van een user buiten secret code}
 * 1) OTP 6 cijfers maken
 *    OTP url maken
 *    secret maken
 * 2) secret bij user zetten
 * 3) naar F de url sturen 
 * 4) krijgt code terug en vergelijk het (dit niet meer dus)
 * 5) als het juist is:
 *      zet user in data base
 *      stuur ok naar F 
 */
function handleNewUserOTP(req: Request, res: Response): void{
  const otp = new OTP()
  if (JSON.parse(req.body)) {
    const stream = req.body
    const user = JSON.parse(stream) as User // user parsen als Jason
    const expectedCode = otp.totp(Date.now()) //otp in backend, not needed anymore
    const URLCode = otp.totpURL // otp back to frontend
    const usertoken = otp.secret // secret for use
    user.tfaToken = usertoken 
    addEntity('users', user) // adding user to database 
    res.status(200).send(URLCode) // outgoing access ipv outgoing messages ok?
  }
  else{
    res.status(400).send()
  }
}

function getUser(id: string, property: string ): any {  // maybe only for tfa token seperate function so that any does not need to be used
  // find user

  // for ()
  //   door database?
  //   if userID = userID out of database Then
  //     ==) user  = user x? 
  //     ==) return user.property // met 'tfatoken' werkt het miss niet door de '', dus miss gwn functie enkel voor tfatoken maken
  //     ==) vb. tfatoken off user = ...
  return 'fun'
}


// right code to get userID etc.? 
function handleOTPVerification(req: Request, res: Response): void{
  if (JSON.parse(req.body)) {
    const stream = req.body
    const userID = stream.id // zo ophalen uit req met meerdere inputs?
    const UserOTP = stream.OTP // zo ophalen uit req met meerdere inputs? 
    const firstName = getUser(userID, 'firstName')
    const expectedOTP = getUser(userID, 'tfaToken')
    if (expectedOTP === UserOTP){
      res.status(200).send(evaluateAccess('GRANTED', firstName))
    }
    else {
      res.status(400).send() // dit terug en dan weet raspberry pi dat het fout is? 
    }
  }
  else{
    res.status(400).send()
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
  // const now = new Date()
  // const date = now.toLocaleString()
  const date = DateTime.now().setZone('Europe/Brussels')
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


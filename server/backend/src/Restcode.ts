//code for alternate handle Face

const tot: number = tokens.length
let b: number 
let index: number 
  
for (let i = 0; i < tot; i= i +1 ){
  const a = euclidDistance(req, tokens[i])
  if (i === 0)
    b = a
  else
  if (a < b){
    b = a 
    index= i}
  //return [index, b]
}
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //Check new user en oude handle OTP//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// function handleCheckNewUserOTP(req: Request, res: Response): void{
//   const expectedCode = req.body
//   const userCode = 4538 // Uit vorige functie halen via een of andere weg
//   if (expectedCode === userCode){
//     const status = {
//     res.status(200).send(URLCode)
//   }

  













/*
remarks handleOTP 
  very early draft
  a lot of parameters are not possible to add to the user to register in the database (still needs to be added in some way that the frontend can give this info when registering user or send this info to another function to do the rest of the process)
    facetoken (seperate function or registration process for this?), complexity with all the waiting for responses, in this or in other function?
  a way to stop the process when a person can't put in their pin because of some reason needs to be added? so that it can be stopped and won't run for eternity
  sending info to fronted as well?
    */


// voorlopig fout, maar delen te hergebruiken in andere zaken.
function handleOTP(req: Request, res: Response): void{
  const otp = new OTP()
  if (JSON.parse(req.body)) {
    const stream = req.body // { "userId": string, "otp": string }

    // await getDB
    // db.get(user adhv userId)
    // get secret

    const secret = 'test'

    const expectedCode = otp.totp(Date.now()) // wrong, because ? 
    // post request
    const userCode = stream.otp
    if (userCode === expectedCode){
      const usertoken = otp.secret
      //add to database
      res.status(200).send({
        
      })
      // somthing to fronted too? 
    }
    else{
      res.status(401).send()

      while (userCode !== expectedCode) { // | onderbreking krijgen 
        res.status(200).send('NOT OK') }
      if (userCode === expectedCode){
        const usertoken = otp.secret
        //add to database
        const newUser = {
          id: usertoken, 
          firstName: 'John', 
          lastName: 'Doe', 
          faceToken: { vertices: [1] },   
          tfaToken: 'to do', 
          roles: ['ADMIN'], 
          dateCreated: DateTime.now()
        }

        addEntity('users', mockUser)
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



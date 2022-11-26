import express, { Express, Request, Response } from 'express';
import { DateTime } from 'luxon';

export async function start(): Promise<void> {
    const app: Express = express()
    const port = 3000

    app.use(express.json())

    app.get('/', (req: Request, res: Response) => res.send("Hello from server!"))

    app.post('/access_face', handleFace)
    app.post('/access_otp', handleOtp)

    app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
}

// Changed heavily to facilitate testing of the Raspberry Pi frontend
async function handleFace(req: Request, res: Response) : Promise<void> {

  const THRESHOLD = 0.6
  const userFaceDescriptor = [-0.22342973947525024, 0.0625162422657013, 0.04080597683787346, -0.09170466661453247, -0.021512048318982124, 0.05087892711162567, -0.008536621928215027, -0.018538841977715492, 0.1152467206120491, -0.034918271005153656, 0.22288590669631958, 0.041493769735097885, -0.24713002145290375, -0.07330794632434845, -0.0006610359996557236, 0.036689989268779755, -0.11932042241096497, -0.11540943384170532, -0.04525904357433319, -0.01777956821024418, 0.04495815560221672, -0.0003801861312240362, 0.021068263798952103, 0.07398220151662827, -0.20554177463054657, -0.28477099537849426, -0.09818463772535324, -0.09031780064105988, 0.0801655501127243, -0.01049838773906231, 0.00834650918841362, -0.04413479566574097, -0.1481136679649353, -0.021929651498794556, 0.0003213323652744293, 0.11647927016019821, -0.09580693393945694, -0.0805141031742096, 0.2811638414859772, -0.008637660183012486, -0.1710069328546524, -0.029809560626745224, 0.05357063561677933, 0.3137868642807007, 0.17616155743598938, 0.004420312121510506, 0.03626713529229164, -0.10176815837621689, 0.11844072490930557, -0.28756675124168396, 0.12214779853820801, 0.2248734086751938, 0.0721212774515152, 0.13075852394104004, 0.034165360033512115, -0.15283706784248352, 0.08119937032461166, 0.2134888470172882, -0.2682235538959503, 0.05884696543216705, -0.06654420495033264, -0.020620692521333694, 0.04712375998497009, -0.030982930213212967, 0.2151138335466385, 0.15931428968906403, -0.14825564622879028, -0.19229859113693237, 0.21354152262210846, -0.15590904653072357, -0.03195122256875038, 0.1343129575252533, -0.12868742644786835, -0.2262641191482544, -0.28453290462493896, 0.11894519627094269, 0.37316787242889404, 0.19801867008209229, -0.1201755478978157, 0.07781761884689331, -0.15581420063972473, -0.12473193556070328, 0.05001797899603844, 0.09465906769037247, -0.09689030051231384, -0.0661962553858757, -0.07264160364866257, 0.002069629728794098, 0.210158571600914, 0.026888448745012283, -0.027607044205069542, 0.19035673141479492, 0.1241472139954567, -0.01698685809969902, 0.09433531761169434, 0.12926818430423737, -0.1605120450258255, 0.00980629026889801, -0.15316908061504364, -0.008034312166273594, 0.004457097500562668, -0.0931822881102562, 0.07770071923732758, 0.15530633926391602, -0.21849793195724487, 0.2370319366455078, 0.05986989662051201, -0.07868535816669464, 0.015403673984110355, -0.02460823580622673, -0.07158024609088898, -0.057855039834976196, 0.12970216572284698, -0.3041708469390869, 0.20605210959911346, 0.14498622715473175, 0.12204959243535995, 0.19512510299682617, 0.14107269048690796, 0.06931556016206741, 0.011297183111310005, 0.0044031403958797455, -0.13843262195587158, -0.015532920137047768, 0.025421369820833206, -0.018021009862422943, 0.06348321586847305, 0.07355307787656784]

  if (req.body) {
    const faceToCompare = req.body as IncomingFace
    const distance = euclidDistance(userFaceDescriptor, faceToCompare.faceDescriptor)
    const distances = [{id: 0, distance, firstName: "Wouter", roleId: "DUMMY"}]

    if (distances.length == 0) {
      // When there are no faces in the database nobody can enter :(
      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
    } else {
      // Find the closest user
      const matchedUser = distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr))

      if (matchedUser.distance <= THRESHOLD) {
        res.status(200).send(JSON.stringify(evaluateAccess('GRANTED', matchedUser.firstName)))
      } else {
        res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
      }
    }
  } else {
    res.status(400).send()
  }

}

// Changed heavily to facilitate testing of the Raspberry Pi frontend
async function handleOtp(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const passwords = [{id: 0, password: "123456", firstName: "Milo"}, {id: 1, password: "555555", firstName: "Wouter"}]
    const stream = req.body as IncomingOtp
    const user = passwords.filter(pw => pw.id === stream.id)

    if (user.length == 1) {
      if (user[0].password === stream.otp) {
          res.status(200).send(evaluateAccess('GRANTED', user[0].firstName))
      } else {
        res.status(401).send(JSON.stringify(evaluateAccess('DENIED', user[0].firstName)))
      }
    } else {
      res.status(401).send(JSON.stringify(evaluateAccess('DENIED', 'Unknown')))
    }
  } else {
    res.status(400).send()
  }
}

function euclidDistance(point1: number[], point2: number[]): number {
  const sum = point1
    .map((point, index) => {
      return Math.pow(point - point2[index], 2)
    })
    .reduce((previous, current) => previous + current, 0)
  return Math.sqrt(sum)
}

function evaluateAccess(access: 'GRANTED' | 'DENIED' | 'ERROR', firstName: string): OutgoingAccess {
  const date = DateTime.now().setZone('Europe/Brussels').toString()
  return { firstName, timestamp: date, access }
}

type Id = {
  id: number
}

type OutgoingAccess = {
  firstName: string
  timestamp: string
  access: 'GRANTED' | 'DENIED' | 'ERROR'
}

type IncomingOtp = Id & {
  otp: string
  timestamp: string
}

type IncomingFace = {
  faceDescriptor: number[]
}
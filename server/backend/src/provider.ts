import express, { Express, Request, Response } from 'express';
import { DateTime } from 'luxon';

export async function start(): Promise<void> {
    const app: Express = express()
    const port = 3000

    app.use(express.json())

    app.get('/', (req: Request, res: Response) => res.send("Hello from server!"))

    app.post('/access_face', handleFace)
    app.post('/access_otp', handleOtp)
    app.post('/get_firstName', handleId)

    app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
}

const users: User[] = [
  {id: 0, firstName: "Wouter", password: "555555", role: {name: "ADMIN"}, faceDescriptor: [-0.22342973947525024, 0.0625162422657013, 0.04080597683787346, -0.09170466661453247, -0.021512048318982124, 0.05087892711162567, -0.008536621928215027, -0.018538841977715492, 0.1152467206120491, -0.034918271005153656, 0.22288590669631958, 0.041493769735097885, -0.24713002145290375, -0.07330794632434845, -0.0006610359996557236, 0.036689989268779755, -0.11932042241096497, -0.11540943384170532, -0.04525904357433319, -0.01777956821024418, 0.04495815560221672, -0.0003801861312240362, 0.021068263798952103, 0.07398220151662827, -0.20554177463054657, -0.28477099537849426, -0.09818463772535324, -0.09031780064105988, 0.0801655501127243, -0.01049838773906231, 0.00834650918841362, -0.04413479566574097, -0.1481136679649353, -0.021929651498794556, 0.0003213323652744293, 0.11647927016019821, -0.09580693393945694, -0.0805141031742096, 0.2811638414859772, -0.008637660183012486, -0.1710069328546524, -0.029809560626745224, 0.05357063561677933, 0.3137868642807007, 0.17616155743598938, 0.004420312121510506, 0.03626713529229164, -0.10176815837621689, 0.11844072490930557, -0.28756675124168396, 0.12214779853820801, 0.2248734086751938, 0.0721212774515152, 0.13075852394104004, 0.034165360033512115, -0.15283706784248352, 0.08119937032461166, 0.2134888470172882, -0.2682235538959503, 0.05884696543216705, -0.06654420495033264, -0.020620692521333694, 0.04712375998497009, -0.030982930213212967, 0.2151138335466385, 0.15931428968906403, -0.14825564622879028, -0.19229859113693237, 0.21354152262210846, -0.15590904653072357, -0.03195122256875038, 0.1343129575252533, -0.12868742644786835, -0.2262641191482544, -0.28453290462493896, 0.11894519627094269, 0.37316787242889404, 0.19801867008209229, -0.1201755478978157, 0.07781761884689331, -0.15581420063972473, -0.12473193556070328, 0.05001797899603844, 0.09465906769037247, -0.09689030051231384, -0.0661962553858757, -0.07264160364866257, 0.002069629728794098, 0.210158571600914, 0.026888448745012283, -0.027607044205069542, 0.19035673141479492, 0.1241472139954567, -0.01698685809969902, 0.09433531761169434, 0.12926818430423737, -0.1605120450258255, 0.00980629026889801, -0.15316908061504364, -0.008034312166273594, 0.004457097500562668, -0.0931822881102562, 0.07770071923732758, 0.15530633926391602, -0.21849793195724487, 0.2370319366455078, 0.05986989662051201, -0.07868535816669464, 0.015403673984110355, -0.02460823580622673, -0.07158024609088898, -0.057855039834976196, 0.12970216572284698, -0.3041708469390869, 0.20605210959911346, 0.14498622715473175, 0.12204959243535995, 0.19512510299682617, 0.14107269048690796, 0.06931556016206741, 0.011297183111310005, 0.0044031403958797455, -0.13843262195587158, -0.015532920137047768, 0.025421369820833206, -0.018021009862422943, 0.06348321586847305, 0.07355307787656784]},
  {id: 1, firstName: "Brad", password: "123456", role: {name: "DUMMY"}, faceDescriptor: [-0.053933095186948776, 0.1300140768289566, 0.052557650953531265, -0.04642125591635704, -0.12251989543437958, 0.033155158162117004, -0.0957607626914978, -0.02308104932308197, 0.1095062866806984, -0.039501652121543884, 0.22871409356594086, 0.0042465925216674805, -0.22508002817630768, -0.12388703972101212, -0.0724150761961937, 0.04601696878671646, -0.0982884094119072, -0.12224925309419632, -0.08517132699489594, -0.022420566529035568, 0.0596453920006752, 0.057569921016693115, -0.001902783289551735, 0.024375230073928833, -0.09434191137552261, -0.38894081115722656, -0.07073415815830231, -0.08778081089258194, 0.054805148392915726, -0.13202469050884247, -0.017816871404647827, 0.06421338766813278, -0.12567363679409027, -0.0930318534374237, 0.03398628160357475, 0.0764574483036995, -0.09491465985774994, -0.07355130463838577, 0.21460244059562683, 0.03820226714015007, -0.13310059905052185, 0.05375169217586517, 0.011219421401619911, 0.2895927429199219, 0.12762320041656494, 0.08251014351844788, 0.04626714438199997, -0.11357070505619049, 0.2058681845664978, -0.19231025874614716, 0.10321327298879623, 0.23828721046447754, 0.15989510715007782, 0.13289907574653625, 0.11588657647371292, -0.2229512631893158, 0.09508276730775833, 0.16770634055137634, -0.2128293365240097, 0.07629360258579254, -0.06400203704833984, -0.07704196125268936, 0.021922718733549118, -0.059422850608825684, 0.1941603422164917, 0.09137045592069626, -0.057399336248636246, -0.16370947659015656, 0.22427190840244293, -0.07178300619125366, -0.04528828710317612, 0.13565543293952942, -0.10969816893339157, -0.15214402973651886, -0.19514119625091553, 0.07029211521148682, 0.3383646607398987, 0.18389713764190674, -0.2469465136528015, -0.023441970348358154, -0.11704874783754349, -0.05105902999639511, 0.01774761639535427, 0.04066498950123787, -0.14037467539310455, -0.05600003898143768, -0.14542068541049957, -0.07217459380626678, 0.15581433475017548, 0.04088326916098595, -0.050104424357414246, 0.23447896540164948, 0.09492228925228119, 0.07148797065019608, 0.1315339058637619, 0.014035139232873917, -0.20395292341709137, 0.010167899541556835, -0.12131276726722717, -0.07200649380683899, 0.0669017881155014, -0.17058293521404266, -0.03255367651581764, 0.09935370832681656, -0.17145641148090363, 0.20357735455036163, -0.007465369999408722, 0.03192608058452606, -0.01150654349476099, -0.02341739647090435, -0.05238491669297218, -0.004026175942271948, 0.17375946044921875, -0.2903154194355011, 0.24825243651866913, 0.11155414581298828, 0.11122609674930573, 0.21074596047401428, 0.130023792386055, 0.07676756381988525, -0.053915515542030334, -0.13184916973114014, -0.1523493528366089, -0.10999941825866699, 0.044763535261154175, -0.008469676598906517, 0.0018476592376828194, 0.045717597007751465]}
]

// Changed heavily to facilitate testing of the Raspberry Pi frontend
async function handleFace(req: Request, res: Response) : Promise<void> {

  const THRESHOLD = 0.52 // False accept rate less than 1/1000

  if (req.body) {
    const stream = req.body as IncomingFace
    const distances = users.map(user => {
      const distance = euclidDistance(user.faceDescriptor, stream.faceDescriptor)
      return {id: user.id, distance, firstName: user.firstName, roleId: user.role.name}
    })

    if (distances.length == 0) {
      // When there are no faces in the database nobody can enter :(
      res.status(401).json(evaluateAccess('DENIED', 'Unknown'))
    } else {
      // Find the closest user
      const matchedUser = distances.reduce((prev, curr) => (prev.distance < curr.distance ? prev : curr))

      if (matchedUser.distance <= THRESHOLD) {
        res.status(200).json(evaluateAccess('GRANTED', matchedUser.firstName))
      } else {
        res.status(401).json(evaluateAccess('DENIED', 'Unknown'))
      }
    }
  } else {
    res.sendStatus(400)
  }

}

// Added simple handler
async function handleId(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    const user = getUserById(stream.id)

    if (user === undefined) {
      res.status(401).json({firstName: null})
    } else {
      res.status(200).json({firstName: user.firstName})
    }
  } else {
    res.sendStatus(400)
  }
}

// Changed heavily to facilitate testing of the Raspberry Pi frontend
async function handleOtp(req: Request, res: Response): Promise<void> {
  if (req.body) {
    const stream = req.body as IncomingOtp
    const user = getUserById(stream.id)

    if (user === undefined) {
      res.status(401).json(evaluateAccess('DENIED', 'Unknown'))
    } else {
      if (user.password === stream.otp) {
        res.status(200).json(evaluateAccess('GRANTED', user.firstName))
      } else {
        res.status(401).json(evaluateAccess('DENIED', user.firstName))
      }
    }
  } else {
    res.sendStatus(400)
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

function getUserById(id: number): User | undefined {
  const userList = users.filter(user => user.id === id)
  if (userList.length == 1) {
    return userList[0]
  } else {
    return undefined
  }
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
}

type IncomingFace = {
  faceDescriptor: number[]
}

type Role = {
  name: string
}

type User = Id & {
  firstName: string,
  faceDescriptor: number[],
  password: string,
  role: Role
}
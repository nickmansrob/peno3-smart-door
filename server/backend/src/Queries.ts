import { getDatabase } from './Database.js'
import { AuthRecord } from './types.js'

export async function stateUser(id: string): Promise<string> {
  const db = await getDatabase()
  const userRecords = db.chain.get('records').find({ id: id }).value()
  if (userRecords.length === 0) {
    return 'ENTER'
  } else {
    let recordCompare = userRecords[0]
    for (let i = 1; i < userRecords.length; i++) {
      const record = userRecords[i]
      if (record.timestamp.toUnixInteger > recordCompare.timestamp.toUnixInteger) {
        recordCompare = record
      }
    }
    if (recordCompare.state === 'LEAVE') {
      return 'ENTER'
    } else {
      return 'LEAVE'
    }
  }
}

// Hourly data

//function amountEntries()

// Amount of employees inside

// function amountEmployees(): // Amount per day that was inside

function checkDayEnter(record: AuthRecord): boolean{
  const today = DateTime.now().weekday
  const dateRecord : string = record.timestamp
  const dayRecord = DateTime.fromISO(dateRecord).weekday
  const state = record.state
  if (state === 'ENTER' && today === dayRecord){
    return true
  }
  else{
    return false
  }
}
async function getEntries(req): Promise<number>{ // Amount current inside
  const db = await getDatabase()
  const records = db.chain.records as AuthRecord[]
  const validatedRecords = (records.map(x => x.record).filter(x => checkDayEnter(x) === true)).filter(record => record.lenght > 0)
  const amountOfEntries = validatedRecords.length
  return amountOfEntries
}

// {
//   0: 67,
//   2: 65,
//   ...
//   6: 0
// }


// Latest entries

//function getEmployees(): void {}

// All users including state

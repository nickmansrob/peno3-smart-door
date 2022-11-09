import { getDatabase } from './Database.js'
import { AuthRecord, UserRecord } from './types.js'
import { DateTime} from 'luxon'

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



// function amountEmployees(): // Amount per day that was inside



// Amount of employees inside

function checkDayEnter(record: UserRecord): boolean{
  //console.log('record', JSON.stringify(record))
  const today = DateTime.now().weekday
  //console.log(today)
  const dateRecord = record.timestamp
  //console.log(dateRecord)
  const dayRecord = DateTime.fromISO(dateRecord).weekday
  //console.log(dayRecord)
  const state = record.state
  if (state === 'ENTER' && today === dayRecord){
    return true
  }
  else{
    return false
  }
}
export async function getEntries(): Promise<number>{ // Amount current inside
  const db = await getDatabase()
  const records = db.chain.get('records').value() as AuthRecord
  //console.log(records)
  const idArray = Object.keys(records) // array strings
  //console.log(idArray)
  const test1 = idArray.map(id => records[id].records) // array user records
  //console.log('test1', test1)
  //const test2 = test1.filter(record => checkDayEnter(record)) // array user records
  //console.log('test 2', test2)
  //const test3 = test2.filter(array => array.lenght >0)
  const validatedRecords = (idArray.map(id => records[id].records).map(userRecords => userRecords.filter(record => checkDayEnter(record)))).filter(array => array.length >0)
  //console.log(validatedRecords)
  const amountOfEntries = validatedRecords.length
  return amountOfEntries
}

// Latest entries

//function getEmployees(): void {}

// All users including state

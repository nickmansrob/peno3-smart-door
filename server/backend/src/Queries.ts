import { getDatabase } from './Database.js'
import { AuthRecord, CustomInterval, UserRecord } from './types.js'
import { DateTime, Interval} from 'luxon'
import { inInterval, checkEnter, checkDate} from './CheckFunctions.js'
import { start } from 'repl'

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


//function amountEntries()
  

// function amountEmployees(): // Amount per day that was inside



// check functions

// check on day and state
function checkDayEnter(record: UserRecord): boolean{
  const today = DateTime.now().weekday
  const dateRecord = record.timestamp
  const dayRecord = DateTime.fromISO(dateRecord).weekday
  const state = record.state
  if (state === 'ENTER' && today === dayRecord){
    return true
  }
  else{
    return false
  }
}



// Amount of employees inside
// TO-DO ook nog totaal aantal mensen binnen toevoegen
// number[] type als output

export async function getEntries(): Promise<number>{ // Amount current inside
  const db = await getDatabase()
  const records = db.chain.get('records').value() as AuthRecord
  const idArray = Object.keys(records) 
  const validatedRecords = (idArray.map(id => records[id].records).map(userRecords => userRecords.filter(record => checkDayEnter(record)))).filter(array => array.length >0)
  const amountOfEntries = validatedRecords.length
  return amountOfEntries
}

// Latest entries
/**
 * frontend geeft x
 * laatste x enters
 */




//get range entries : 
/**
 * frontend geeft req.body.s en e ,  s en e zijn datums (stringvom) dateTime.fromISO(e).... wordt list?
 * backend geeft terug: 
 * @return [12, 45, ... 47]
 * doen via (type locaal maken):
 * 
 * function getRangeEntries(req, res) {
  const body = req.body as { s: string, e: string }
}
 */
export async function getRangeEntries(range: string[]) {
  // get Database
  const db = await getDatabase()
  const records = db.chain.get('records').value() as AuthRecord
  const idArray = Object.keys(records)

  // Define interval
  const startTime = DateTime.fromISO(range[0])
  const endTime = DateTime.fromISO(range[1])
  const interval = Interval.fromDateTimes(startTime, endTime)

  // console.log('interval', interval) //test

  // const lengthInterval = interval.length('days')

  //dayarray
  let currentDay = startTime
  const dayArray = [startTime]

  while (interval.contains(currentDay)){
    currentDay = currentDay.plus({ days: 1 })
    dayArray.push(currentDay) 
    
    // console.log('tijdens dayArray', dayArray) //test
  }

  // console.log('einde van dayArray', dayArray) //test

  const allAmountOfEntries = []
  // for loop to get information out of records
  for (const date of dayArray){
 
    const inRange = (idArray.map(id => records[id].records).map(userRecords => userRecords.filter(record => checkDate(record, date)))).filter(array => array.length >0)

    // console.log('tussentijdse in range', inRange) //test

    const amountOfEntries = inRange.length

    // console.log('tussentijdse amount of Entries', amountOfEntries) //test

    allAmountOfEntries.push(amountOfEntries)

    // console.log('tussentijdse all amount of entries', allAmountOfEntries) //test
  }

  return allAmountOfEntries
}

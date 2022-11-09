import { getDatabase } from './Database.js'
import { AuthRecord, CustomInterval, UserRecord } from './types.js'
import { DateTime} from 'luxon'
import { inInterval } from './Restriction.js'

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

//check on state
function checkEnter(record: UserRecord): boolean{
  const state = record.state
  if (state === 'ENTER'){
    return true
  }
  else{
    return false
  }
}
// check on interval

export function inInterval(currentTime: string, restrictionInterval: CustomInterval): boolean {
  const currentTimeNumber: string = currentTime.replace(':', '')
  const minimumEntry: string = restrictionInterval.s.replace(':', '')
  const maxEntry: string = restrictionInterval.e.replace(':', '')
  if (currentTimeNumber >= minimumEntry && currentTime <= maxEntry) {
    return true
  } else {
    return false
  }
}
function checkInterval(record: UserRecord, type: 'DAY'| 'DATE' | 'TIME', day?: string, restrictionInterval?: CustomInterval): boolean{
  const dateRecord = record.timestamp
  if (type ==='DATE'){
    const minimumDate = restrictionInterval.s
    const maxDate = restrictionInterval.e
  }
  if (type === 'TIME'){
    const currentTime = (DateTime.now().hour * 100 + DateTime.now().minute).toString()
    const currentTimeNumber: string = currentTime.replace(':', '')
    const timeRecord = (DateTime.fromISO(dateRecord).hour * 100 + DateTime.fromISO(dateRecord).minute).toString()
  }
  if (type === 'DAY'){
    const today = DateTime.now().weekday
    const dayRecord = DateTime.fromISO(dateRecord).weekday
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
 * frontend geeft req.body.s en e ,  s en e zijn datums (stringvom) dateTime.fromISO(e)....
 * backend geeft terug: 
 * @return [12, 45, ... 47]
 * doen via (type locaal maken):
 * 
 * function getRangeEntries(req, res) {
  const body = req.body as { s: string, e: string }
}
 */


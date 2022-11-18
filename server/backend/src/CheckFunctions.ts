import { DateTime, Interval } from 'luxon'
import { getDatabase } from './Database.js'
import { CustomInterval, LatestEntry, User, UserRecord } from './types.js'

export function inInterval(currentTime: number, restrictionInterval: CustomInterval): boolean {
  // const currentTimeNumber: string = currentTime.replace(':', '')
  const minimumEntry: number = restrictionInterval.s
  const maxEntry: number = restrictionInterval.e
  if (currentTime >= minimumEntry && currentTime <= maxEntry) {
    return true
  } else {
    return false
  }
}

//check on state
export function checkEnter(record: UserRecord): boolean{
  const state = record.state
  if (state === 'ENTER'){
    return true
  }
  else{
    return false
  }
}


export function checkDate(record: UserRecord, date: DateTime): boolean{
  const dateRecord = record.timestamp
  const dateRecordDateTime = DateTime.fromISO(dateRecord).toISODate()
  if (date.toISODate() === dateRecordDateTime){
    return true
  }
  else {
    return false
  }
}


export async function recordToLatestEntry(record: UserRecord): Promise<LatestEntry> {
  // get database and general info
  const db = await getDatabase()
  const allUsers = db.chain.get('users').value() as User[]
  const iduser = record.id

  // iterating over users and checking id

  const user = allUsers.filter(user => user.id === iduser)

  //get right information
  const timestampuser = record.timestamp
  const roleuser = user[0].role
  const firstNameuser = user[0].firstName
  const lastNameuser = user[0].lastName

  const latestEntriestype = { id: iduser,
    timestamp: timestampuser, 
    role: roleuser, 
    firstName: firstNameuser, 
    lastName: lastNameuser}

  return latestEntriestype

}

// check on day and state
export function checkDayEnter(record: UserRecord): boolean{
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




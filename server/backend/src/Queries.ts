import { DateTime, Interval } from 'luxon'
import { getDatabase } from './Database.js'
import { AuthRecord } from './types.js'

//abstract function getRecords(range: Interval, order: 'ASCENDING' | 'DESCENDING'): void

//function getEntries


export async function stateUser(id: string): Promise<string> {
  const db = await getDatabase()
  const userRecords = db.data.records.filter(record => record.id === id)
  if (userRecords.length === 0) {
    return 'ENTER'
  } 
  else {
    let recordCompare = userRecords[0]
    for (let i = 1; i < userRecords.length; i++) {
      const record = userRecords[i]
      if (record.timestamp.toUnixInteger > recordCompare.timestamp.toUnixInteger){
        recordCompare = record
      }
    }
    if (recordCompare.state === 'LEAVE'){
      return 'ENTER'
    }
    else {
      return 'LEAVE'
    }
  }
}

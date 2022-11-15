import { DateTime, Interval } from 'luxon'
import { getDatabase } from './Database.js'
import { CustomInterval, UserRecord } from './types.js'

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

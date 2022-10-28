import { Interval } from 'luxon'
import { getDatabase } from './Database.js'

async function getRecords(range: Interval, order: 'ASCENDING' | 'DESCENDING'): Promise<void> {
  const records = (await getDatabase()).data.records.filter((record) => range.contains(record.timestamp))
  const
}

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

// Hourly data

function amountEntries()

// Amount of employees inside

function getEntries(range: Interval)

// Latest entries

function getEmployees(): void {}

// All users including state
import { getDatabase } from './Database.js'

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

//function getEntries(range: Interval)

// Latest entries

//function getEmployees(): void {}

// All users including state

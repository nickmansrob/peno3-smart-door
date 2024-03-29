import { getDatabase } from './Database.js'
import { AuthRecord, CustomInterval, UserRecord, LatestEntry, User } from './types.js'
import { DateTime, Interval} from 'luxon'
import { inInterval, checkEnter, checkDate, recordToLatestEntry, checkDayEnter} from './CheckFunctions.js'



// Total amount of employees 

export async function getAmountEmployees():Promise<number> {
  const db = await getDatabase()
  const users = db.chain.get('users').value() as User[]
  // console.log(users)
  const enabledUsers = users.filter(user => user.enabled == true)
  // console.log(enabledUsers)
  const amountEmployees = enabledUsers.length
  // console.log(amountEmployees)
  return amountEmployees
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Amount of employees inside
// TO-DO ook nog totaal aantal mensen binnen toevoegen
// number[] type als output



export async function getEntries(): Promise<number[]>{ // Amount current inside
  const db = await getDatabase()
  const records = db.chain.get('records').value() as AuthRecord
  const idArray = Object.keys(records) 
  const validatedRecords = (idArray.map(id => records[id].records).map(userRecords => userRecords.filter(record => checkDayEnter(record)))).filter(array => array.length >0)
  const amountOfEntries = validatedRecords.length
  return [amountOfEntries, await getAmountEmployees()]
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Latest entries
/**
 * frontend geeft x
 * laatste x enters
 */
export async function latestEntries(latestAmount: number): Promise<LatestEntry[]>{ 
  // get Database
  const db = await getDatabase()
  const records = db.chain.get('records').value() as AuthRecord
  const idArray = Object.keys(records)

  // get all records in one array
  const allRecords = (idArray.map(id => records[id].records).flat()).filter(record => record.state === 'ENTER')

  // take first x
  const firstEntries = allRecords.splice(0, latestAmount)
  //console.log('EERSTE FIRSTENTRIES', firstEntries) //test
  //console.log('ALL RECORDS NA DE SPLIT', allRecords)
  // for lus to switch everything to only retain the latest 10 entries
  for (const record of allRecords){
    //console.log('De start van een lus', firstEntries)
    //console.log('TEST OP TRUE OR FALSE', DateTime.fromISO(firstEntries[0].timestamp) < DateTime.fromISO(record.timestamp) )
    const filterOfEntries = firstEntries.filter(compareRecord => DateTime.fromISO(compareRecord.timestamp) < DateTime.fromISO(record.timestamp))
    //console.log('FILTER OF ENTRIES4', filterOfEntries)
    if (filterOfEntries.length !== 0){
      //switch met max
      firstEntries.sort((userRecord1, userRecord2) =>  DateTime.fromISO(userRecord2.timestamp).toUnixInteger() - DateTime.fromISO(userRecord1.timestamp).toUnixInteger() )
      //console.log('Gesorteerde firstentries', firstEntries)
      //console.log('WAT WORDT ER GEWISSELD', firstEntries[latestAmount-1])
      //console.log('MET WAT WISSELEN WE?', record)
      firstEntries[latestAmount-1] = record
    }
  }

  //console.log('TWEEDE FIRST ENTRIES', firstEntries) //test

  // sort the list
  firstEntries.sort((userRecord1, userRecord2) => DateTime.fromISO(userRecord2.timestamp).toUnixInteger() - DateTime.fromISO(userRecord1.timestamp).toUnixInteger())

  
  // make entries to right format with .map (seperate function 'get right info and put it in a dict')
  const allLatestEntries = Promise.all(firstEntries.map(async record => await recordToLatestEntry(record)))

  return allLatestEntries
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

import { DateTime, Interval } from 'luxon'
import { exitCode } from 'process'
import { getDatabase } from './Database.js'
import { GroupRestriction, OutgoingAccess, Role, User, UserRestriction } from './types.js'

export async function userRestrictions(user: User): Promise<OutgoingAccess> {
  const day = DateTime.now().weekdayShort.toUpperCase()
  const time = DateTime.now()
  const id = user.id
  const role = user.roles
  const db = await getDatabase()

  const currentDay = DateTime.now().weekdayShort.toUpperCase()
  const userRestrictions = db.data.restrictions[currentDay].users.filter(
    (restriction: UserRestriction) => restriction.id === accessUser.id,
  )?.map( (entry: UserRestriction) => {return entry.interval})

  const groupRestrictions = db.data.restrictions[currentDay].groups.filter((restriction: GroupRestriction) =>
    intersectingArrays(restriction.role, accessUser.roles),
  )?.map( (entry: GroupRestriction) => {return entry.interval})

  // TODO: Check if in interval but not with contains as this includes the date and we only want the hour.
  // TODO: Check for empty restriction, allow if empty

  return { firstName: accessUser.firstName, timestamp: DateTime.now().setZone('Europe/Brussels'), access: 'GRANTED' }
}


/*
@returns true if arrays intersect, false if not
*/
 
function intersectingArrays(arr1: Role[], arr2: Role[]): boolean {
  const biggestArray = arr1.length > arr2.length ? arr1 : arr2
  const smallestArray = arr1.length <= arr2.length ? arr1 : arr2
  return biggestArray.filter(value => smallestArray.includes(value)).length !== 0
}

// const day = DateTime.now().weekdayShort.toUpperCase()
// const time = DateTime.now()
// const id = user.id
// const role = user.roles
// const db = await getDatabase()
// console.log('test log', db.data.restrictions['MON'])
// const restrictionsByUser = db.data.restrictions['MON'].users.filter(restriction => restriction['MON'].users.id === id)
// console.log('restriction user', restrictionsByUser)
// const restrictionsByUsertime = (db.data.restrictions['MON'].users.filter(restriction => restriction['MON'].users.id === id)).map(restriction => restriction.interval) // test if map function would work
// console.log(restrictionsByUsertime) // byUsertime, gebruiken we niet maar had ik even erbij gezet voor de map te proberen
// const restrictionsByGroup = db.data.restrictions['MON'].groups.filter(restriction => restriction['MON'].group.group === role)
// return restrictionsByUsertime
//   const allRestrictions = [...restrictionsByUser, ...restrictionsByGroup]
//   // const intervals = allRestrictions.map(allRestrictions.interval)
//   const check = (allRestrictions.map(interval => interval.contains(time))).filter(x => x === false)
//   if (check.length===0){
//     const Access : OutgoingAccess = {firstName : user.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'GRANTED'}
//     return Access
//   }
//   else {
//     const Access : OutgoingAccess = {firstName : user.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'DENIED'}
//     return Access
//   }

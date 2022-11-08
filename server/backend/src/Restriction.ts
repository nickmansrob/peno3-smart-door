import { DateTime, Interval } from 'luxon'
import { exitCode } from 'process'
import { getDatabase } from './Database.js'
import { CustomInterval, GroupRestriction, OutgoingAccess, Role, User, UserRestriction } from './types.js'



/**
 * Na een eerste test is er een fout gebleken in de functie intersectArrays, hij kan de lengte of zo niet lezen
 * ik kon er niets meer aan aanpassen in de sessie zelf. De test user lijkt ok te werken en deze staat in index
 * er zijn ook meerde logs per deel geplaats die achteraf bijna allemaal weggaan.
 * 
 */
export async function userRestrictions(accessUser: User): Promise<OutgoingAccess> {
  const db = await getDatabase()
  
  const currentTime = (DateTime.now().hour * 100 + DateTime.now().minute).toString()
  const currentDay = DateTime.now().weekdayShort.toUpperCase()
  const userRestrictions = db.data.restrictions[currentDay].users.filter(
    (restriction: UserRestriction) => restriction.id === accessUser.id,
  )?.map( (entry: UserRestriction) => {return entry.interval})  // Array of Costum intervals

  console.log(userRestrictions) // test

  const groupRestrictions = db.data.restrictions[currentDay].groups.filter((restriction: GroupRestriction) =>
    intersectingArrays(restriction.role, accessUser.roles),
  )?.map( (entry: GroupRestriction) => {return entry.interval})  // Array of Costum intervals

  console.log(groupRestrictions) // test

  const Restrictions = [...userRestrictions, ...groupRestrictions]  // Array of Costum intervals

  console.log(Restrictions) // test
  console.log(Restrictions.length) // test

  if (Restrictions.length ===0){
    const Access : OutgoingAccess = {firstName : accessUser.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'GRANTED'}

    console.log(Access) // test

    return Access
  }
  const booleanRestrictions = Restrictions.map(x => inInterval(currentTime, x))  // Array of booleans
  if (booleanRestrictions.includes(false)){
    const Access : OutgoingAccess = {firstName : accessUser.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'GRANTED'}

    console.log(Access) // test

    return Access
  }
  else {
    const Access : OutgoingAccess = {firstName : accessUser.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'DENIED'}

    console.log(Access) // test

    return Access
  }

  // OK?: Check if in interval but not with contains as this includes the date and we only want the hour.
  // OK?: Check for empty restriction, allow if empty
}


function inInterval(currentTime: string, restrictionInterval: CustomInterval): boolean {
  const currentTimeNumber: string = currentTime.replace(':', '')
  const minimumEntry : string= restrictionInterval.s.replace(':', '')
  const maxEntry : string= restrictionInterval.e.replace(':', '')
  if (currentTimeNumber >= minimumEntry && currentTime <= maxEntry){
    return true
  }
  else {
    return false
  }
}



/*
@returns true if arrays intersect, false if not
*/
 
function intersectingArrays(arr1: Role[], arr2: Role[]): boolean {
  const biggestArray = arr1.length > arr2.length ? arr1 : arr2
  const smallestArray = arr1.length <= arr2.length ? arr1 : arr2
  return biggestArray.filter(value => smallestArray.includes(value)).length !== 0
}


import { DateTime } from 'luxon'
import { getDatabase } from './Database.js'
import { OutgoingAccess, User } from './types.js'

export async function userRestrictions(user: User): Promise<OutgoingAccess>{
  const day = DateTime.now().weekdayShort.toUpperCase()
  const time = DateTime.now()
  const id = user.id
  const role = user.roles
  const db = await getDatabase()
  const restrictionsByUser = db.data.restrictions[day].filter(restriction => restriction[day].users.id === id)
  const restrictionsByGroup = db.data.restrictions[day].filter(restriction => restriction[day].group.group === role)
  const allRestrictions = [...restrictionsByUser, ...restrictionsByGroup]
  // const intervals = allRestrictions.map(allRestrictions.interval)
  const check = (allRestrictions.map(interval => interval.contains(time))).filter(x => x === false)
  if (check.length===0){
    const Access : OutgoingAccess = {firstName : user.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'GRANTED'}
    return Access
  }
  else {
    const Access : OutgoingAccess = {firstName : user.firstName, timestamp : DateTime.now().setZone('Europe/Brussels'), access: 'DENIED'}
    return Access
  }
}

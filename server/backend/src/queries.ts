import { DateTime, Interval } from 'luxon'
import { LatestEntry } from './types.js'
import { getAllActiveUsers, getLatestUserRecords, getUsers } from './user.js'

export async function getEntries(): Promise<{inside: number, total: number}> {
  const records = await getLatestUserRecords()
  const total = await getAllActiveUsers()

  if (records) {
    const inside = records.filter(record => record.state === 'ENTER').length
    return {inside, total}
  } else {
    return {inside: 0, total}
  }
}

export async function getRangeEntries(range: {s: DateTime, e: DateTime}): Promise<number[]> {
  const records = await getLatestUserRecords()
  const interval = Interval.fromDateTimes(range.s, range.e)

  if (records) {
    const rangeEntries = records.filter(record => interval.contains(DateTime.fromISO(record.timestamp)))
  }
}

export async function getLatestEntries(amount: number): Promise<LatestEntry[]> {
  const records = await getLatestUserRecords()

  if (records) {
    return await Promise.all(records.filter(record => record.state === 'ENTER').slice(amount).map(async record => {
      const user = await getUsers(record.id)
      if (user) {
        const userObject = [user].flat()[0]
        return {
          id: record.id,
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          timestamp: record.timestamp,
          role: userObject.roleName
        } as LatestEntry
      } else {
        return {} as LatestEntry
      }
    }))
  } else {
    return [] as LatestEntry[]
  }
}

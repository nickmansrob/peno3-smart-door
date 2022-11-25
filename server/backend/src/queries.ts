import { DateTime, Interval } from 'luxon'
import { LatestEntry } from './types.js'
import { getAllActiveUsers, getLatestUserRecords, getUsers } from './user.js'

export async function getEntries(): Promise<{ inside: number; total: number }> {
  const records = await getLatestUserRecords()
  const total = await getAllActiveUsers()

  if (records) {
    const inside = records.filter(record => record.state === 'ENTER').length
    return { inside, total }
  } else {
    return { inside: 0, total }
  }
}

export async function getRangeEntries(s: DateTime, e: DateTime): Promise<number[]> {
  const records = await getLatestUserRecords()
  const interval = Interval.fromDateTimes(s, e) // s and e already validated in provider

  if (records) {
    const rangeEntries = records.filter(record => interval.contains(DateTime.fromISO(record.timestamp)))

    let currentDay = interval.start
    const dateRange = []
    while (interval.contains(currentDay)) {
      dateRange.push(currentDay.toFormat('yyyy-MM-dd'))
      currentDay = currentDay.plus({ days: 1 })
    }

    return dateRange.map(
      day => rangeEntries.filter(record => DateTime.fromISO(record.timestamp).toFormat('yyyy-MM-dd') === day).length,
    )
  } else {
    return []
  }
}

export async function getLatestEntries(amount: number): Promise<LatestEntry[]> {  // number validated in provider
  const records = await getLatestUserRecords()

  if (records) {
    return await Promise.all(
      records
        .filter(record => record.state === 'ENTER')
        .slice(0, amount)
        .map(async record => {
          const user = await getUsers(record.id)
          if (user) {
            const userObject = [user].flat()[0]
            return {
              id: record.id,
              firstName: userObject.firstName,
              lastName: userObject.lastName,
              timestamp: record.timestamp,
              role: userObject.roleId,
            } as LatestEntry
          } else {
            return {} as LatestEntry
          }
        }),
    )
  } else {
    return [] as LatestEntry[]
  }
}

import { DateTime, Interval } from 'luxon'
import { LatestEntry } from './types.js'
import { getAllActiveUsers, getLatestEnabledUserRecords, getRangeRecords, getUsers } from './user.js'

export async function getEntries(): Promise<{ inside: number; total: number }> {
  // Realtime monitor
  // NO disabled users
  const records = await getLatestEnabledUserRecords()
  const total = await getAllActiveUsers()

  if (records) {
    const inside = records.length
    return { inside, total }
  } else {
    return { inside: 0, total }
  }
}

export async function getRangeEntries(s: DateTime, e: DateTime): Promise<number[]> {
  // Disabled users allowed
  const records = await getRangeRecords(s, e)
  const interval = Interval.fromDateTimes(s, e) // s and e already validated in provider

  if (records) {
    let currentDay = interval.start
    const dateRange = []
    while (interval.contains(currentDay)) {
      dateRange.push(currentDay.toFormat('yyyy-MM-dd'))
      currentDay = currentDay.plus({ days: 1 })
    }

    const recsPerUser = dateRange.map(day =>
      records.map(record =>
        record.records.filter(
          userRecord => DateTime.fromISO(userRecord.timestamp.toString()).toFormat('yyyy-MM-dd') === day,
        ),
      ),
    )

    console.log(recsPerUser)

    return []
  } else {
    return []
  }
}

export async function getLatestEntries(amount: number): Promise<LatestEntry[]> {
  // NO disabled users
  // number validated in provider
  const records = await getLatestEnabledUserRecords(amount)

  if (records) {
    return await Promise.all(
      records.map(async record => {
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

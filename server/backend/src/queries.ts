import { DateTime, Interval } from 'luxon'
import { getRangeRecords } from './record.js'
import { LatestEntry } from './types.js'
import { getAllActiveUsers, getLatestEnabledUserEntries, getLatestEnabledUserRecord, getUsers } from './user.js'

export async function getEntries(): Promise<{ inside: number; total: number }> {
  // Realtime monitor
  // NO disabled users
  const records = (await getLatestEnabledUserRecord())?.filter(record => record.state === 'ENTER')
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
    const dateRange = [] as string[]
    while (interval.contains(currentDay)) {
      dateRange.push(currentDay.toFormat('dd/MM/yyyy'))
      currentDay = currentDay.plus({ days: 1 })
    }

    // Filters out multiple entries per day per user and rewrites the record to dd/MM/yyyy
    const uniqueRecords = records.flatMap(userRecord =>
      userRecord.records
        .filter(
          (tag, index, array) =>
            array.findIndex(
              t => t.timestamp.toLocaleDateString('en-GB') == tag.timestamp.toLocaleDateString('en-GB'),
            ) == index,
        )
        .map(uniqueRecord => {
          return { userId: uniqueRecord.userId, timestamp: uniqueRecord.timestamp.toLocaleDateString('en-GB') }
        }),
    )

    return dateRange.map(day => uniqueRecords.filter(record => record.timestamp === day).length)
  } else {
    return []
  }
}

export async function getLatestEntries(amount: number): Promise<LatestEntry[]> {
  // NO disabled users
  // number validated in provider
  const records = await getLatestEnabledUserEntries(amount)

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

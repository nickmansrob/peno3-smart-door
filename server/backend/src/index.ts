import { DateTime, Interval } from 'luxon'
import { start } from './Provider.js'

//await start()

console.log(JSON.stringify(Interval.fromDateTimes(DateTime.fromISO('2022-10-21T21:28:15+02:00'), DateTime.fromISO('2022-10-28T21:28:15+02:00'))))

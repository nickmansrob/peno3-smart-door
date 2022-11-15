import { start } from './Provider.js'
import { latestEntries } from './Queries.js'

//await start()

console.log(await latestEntries(2))
console.log(await latestEntries(3))
console.log(await latestEntries(8))


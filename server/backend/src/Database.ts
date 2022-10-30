import { Low, JSONFile } from 'lowdb'
import { MockRestriction } from './assets/mockRestriction.js'
import { Data } from './types.js'

export async function initializeDatabase(): Promise<Low<Data>> {
  const dbPath = process.env.ENV == 'dev' ? './src/assets/db.json' : './src/data/db.json'

  const adapter = new JSONFile<Data>(dbPath)
  const db = new Low<Data>(adapter)

  await db.read()

  if (!db.data) {
    db.data = { users: [], records: [], restrictions: MockRestriction } // Start with a fresh database
    await db.write()
  }

  return db
}

export async function getDatabase(): Promise<Low<Data>> {
  return await initializeDatabase()
}

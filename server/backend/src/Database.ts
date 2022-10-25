import { Low, JSONFile } from 'lowdb'
import { Data } from './types.js'

export async function initializeDatabase(): Promise<Low<Data>> {
  const adapter = new JSONFile<Data>('./src/assets/db.json')
  const db = new Low<Data>(adapter)

  await db.read()

  if (!db.data) {
    db.data = { users: [], records: [], restrictions: [] } // Start with a fresh database
    await db.write()
  }

  return db
}

export async function getDatabase(): Promise<Low<Data>> {
  return await initializeDatabase()
}

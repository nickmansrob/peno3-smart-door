import { Low, JSONFile } from 'lowdb'
import { Data } from './types'
import { mockUser } from '../mocks/user.js'

let db: Low<Data>

export async function initializeDatabase(): Promise<void> {
  const adapter = new JSONFile<Data>('db.json')
  db = new Low<Data>(adapter)

  await db.read()

  db.data ||= {user: mockUser} // If db is null, add mockUser
  db.write()
}

export function getDatabaseInfo(): Data {
  return db.data
}

import { Low, JSONFile } from 'lowdb'
import { AuthRecord, Data, User, ValidationError } from './types.js'
import { mockRecord, mockRestriction, mockUser } from '../mocks/user.js'

export async function initializeDatabase(): Promise<Low<Data>> {
  const adapter = new JSONFile<Data>('./src/assets/db.json')
  const db = new Low<Data>(adapter)

  await db.read()

  if (!db.data) {
    // db.data = { users: [mockUser], records: [mockRecord], restrictions: [mockRestriction] } // If db is null, add mockUser
    db.data = { users: [], records: [], restrictions: [] } // start with a fresh database
    await db.write()
  }

  return db
}

export async function getDatabase(): Promise<Low<Data>> {
  return await initializeDatabase()
}

// TODO: fix this, always throws an error ?
export async function validate(table: 'users' | 'records', value: User | AuthRecord): Promise<User | AuthRecord>{
  const db = await getDatabase()

  const object = db.data[table]

  if (value.id in object.map( (prop: User | AuthRecord) => {return prop.id})) {
    return value
  } else {
    return value
    // throw new ValidationError(`Given id ${value.id} already exists in table ${table}`)
  }
}

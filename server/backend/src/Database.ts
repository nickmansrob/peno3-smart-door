import { Low, JSONFile } from 'lowdb'
import { MockRestriction } from './assets/mockRestriction.js'
import { Data } from './types.js'
import lodash from 'lodash'

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

export async function initializeDatabase(): Promise<LowWithLodash<Data>> {
  const dbPath = process.env.ENV == 'dev' ? './src/assets/db.json' : './src/data/db.json'

  const adapter = new JSONFile<Data>(dbPath)
  const db = new LowWithLodash<Data>(adapter)

  await db.read()

  if (!db.chain) {
    db.chain = { users: [], records: [], restrictions: MockRestriction } // Start with a fresh database
    await db.write()
  }

  return db
}

export async function getDatabase(): Promise<LowWithLodash<Data>> {
  return await initializeDatabase()
}

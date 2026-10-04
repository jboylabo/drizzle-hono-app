import 'dotenv/config'
import { createDb } from './client'
import { notes } from './schema'

async function seed() {
  const { db, sql } = createDb()
  try {
    await db.insert(notes).values([
      { title: 'Hello', body: 'First note from seed' },
      { title: 'Drizzle', body: 'PostgreSQL on Docker' },
    ])
    console.log('Seeded notes')
  } finally {
    await sql.end()
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

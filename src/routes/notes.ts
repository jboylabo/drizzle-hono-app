import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { createDb, type Db } from '../db/client'
import { notes } from '../db/schema'

type NotesEnv = {
  Variables: {
    db: Db
  }
}

const dbMiddleware = createMiddleware<NotesEnv>(async (c, next) => {
  const { db, sql } = createDb()
  c.set('db', db)
  try {
    await next()
  } finally {
    await sql.end()
  }
})

export const notesRoute = new Hono<NotesEnv>()
  .use(dbMiddleware)
  .get('/', async (c) => {
    const db = c.get('db')
    const rows = await db.select().from(notes)
    return c.json(rows)
  })
  .get('/:id', async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const [row] = await db.select().from(notes).where(eq(notes.id, id))
    if (!row) {
      return c.json({ error: 'Note not found' }, 404)
    }
    return c.json(row)
  })
  .post('/', async (c) => {
    const db = c.get('db')
    const body = await c.req.json<{ title?: string; body?: string }>()
    if (!body.title?.trim()) {
      return c.json({ error: 'title is required' }, 400)
    }
    const [row] = await db
      .insert(notes)
      .values({ title: body.title.trim(), body: body.body ?? null })
      .returning()
    return c.json(row, 201)
  })
  .delete('/:id', async (c) => {
    const db = c.get('db')
    const id = c.req.param('id')
    const [row] = await db.delete(notes).where(eq(notes.id, id)).returning()
    if (!row) {
      return c.json({ error: 'Note not found' }, 404)
    }
    return c.json(row)
  })

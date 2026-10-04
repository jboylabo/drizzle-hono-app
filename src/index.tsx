import { Hono } from 'hono'
import { NotesPage } from './pages/notes'
import { renderer } from './renderer'
import { notesRoute } from './routes/notes'

const app = new Hono()

app.route('/api/notes', notesRoute)

app.use(renderer)

app.get('/', (c) => {
  return c.render(<NotesPage />)
})

export default app

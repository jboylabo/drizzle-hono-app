import { Hono } from 'hono'
import { renderer } from './renderer'
import { notesRoute } from './routes/notes'

const app = new Hono()

app.route('/api/notes', notesRoute)

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

export default app

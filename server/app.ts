import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { middlewares } from './middlewares'
import { authRoute } from './routes/auth'
import { expensesRoute } from './routes/expenses'
import jsonNotFound from './utils/jsonNotFound'
import jsonOnError from './utils/jsonOnError'

const app = new Hono()

app.use('*', ...middlewares)

app.get('/', c => c.text('Hello, world!'))

const apiRoutes = app
  .basePath('/api')
  .route('/expenses', expensesRoute)
  .route('/', authRoute)
  .notFound(jsonNotFound)
  .onError(jsonOnError)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app
export type ApiRoutes = typeof apiRoutes

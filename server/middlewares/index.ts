import { clerkMiddleware } from '@hono/clerk-auth'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

export const middlewares = [
  clerkMiddleware(),
  logger(),
  cors(),

]

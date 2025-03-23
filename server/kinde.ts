import type { SessionManager, UserType } from '@kinde-oss/kinde-typescript-sdk'
import type { Context } from 'hono'
import {
  createKindeServerClient,
  GrantType,

} from '@kinde-oss/kinde-typescript-sdk'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { z } from 'zod'

const KindeEnv = z.object({
  KINDE_DOMAIN: z.string(),
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_REDIRECT_URI: z.string().url(),
  KINDE_LOGOUT_REDIRECT_URI: z.string().url(),
})

// throws an exception if the environment is missing something vital
const ProcessEnv = KindeEnv.parse(process.env)

// Client for authorization code flow
export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: ProcessEnv.KINDE_DOMAIN,
    clientId: ProcessEnv.KINDE_CLIENT_ID,
    clientSecret: ProcessEnv.KINDE_CLIENT_SECRET,
    redirectURL: ProcessEnv.KINDE_REDIRECT_URI,
    logoutRedirectURL: ProcessEnv.KINDE_LOGOUT_REDIRECT_URI,
  },
)

const store: Record<string, unknown> = {}

export function sessionManager(c: Context): SessionManager {
  return {
    async getSessionItem(key: string) {
      const result = getCookie(c, key)
      return result
    },
    async setSessionItem(key: string, value: unknown) {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      } as const
      if (typeof value === 'string') {
        setCookie(c, key, value, cookieOptions)
      }
      else {
        setCookie(c, key, JSON.stringify(value), cookieOptions)
      }
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key)
    },
    async destroySession() {
      ['id_token', 'access_token', 'user', 'refresh_token'].forEach((key) => {
        deleteCookie(c, key)
      })
    },
  }
}

interface Env {
  Variables: {
    user: UserType
  }
}

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c)
    const isAuthenticated = await kindeClient.isAuthenticated(manager)
    if (!isAuthenticated) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const user = await kindeClient.getUserProfile(manager)
    c.set('user', user)
    await next()
  }
  catch (e) {
    console.error(e)
    return c.json({ error: 'Unauthorized' }, 401)
  }
})

import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    const isDashboard = url.pathname.startsWith('/dashboard')
    const isApi = url.pathname.startsWith('/api')

    // If it's neither, just continue
    if (!isDashboard && !isApi) {
      return next()
    }

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    // Only redirect to login if we're on a dashboard page
    if (!session && isDashboard) {
      throw redirect({ to: '/login' })
    }

    // Continue with whatever session we found (or null for API)
    return next({ context: { session } })
  },
)

// src/start.ts
import { createMiddleware, createStart } from '@tanstack/react-start'
import { authMiddleware } from './middlewares/auth'

const loggingMiddleware = createMiddleware().server(({ request, next }) => {
  const url = request.url
  console.log(url)
  return next()
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [loggingMiddleware, authMiddleware],
  }
})

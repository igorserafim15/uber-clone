import type { FastifyInstance } from 'fastify'
import { signinGoogle } from './signin-google'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/drivers/signin/google',
    {
      schema: {
        tags: ['Auth'],
        querystring: signinGoogle.querySchema,
        response: signinGoogle.responseSchema,
      },
    },
    signinGoogle.handler,
  )
}

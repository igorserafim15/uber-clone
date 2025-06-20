import { InvalidCredentialsError } from '@/http/errors/invelid-credentials-errors'
import { PrismaDriverRepository } from '@/repositories/prisma/prisma-driver-repository'
import { LoginOrSignupUseCase } from '@/use-cases/login-or-signup-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const querySchema = z.object({
  access_token: z.string(),
})

const responseSchema = {
  200: z.object({ driver_id: z.string() }),
  400: z.object({ message: z.string() }),
}

type QuerySchema = z.infer<typeof querySchema>

async function handler(
  request: FastifyRequest<{ Querystring: QuerySchema }>,
  response: FastifyReply,
) {
  const query = request.query

  try {
    const driverRepository = new PrismaDriverRepository()
    const loginOrSignup = new LoginOrSignupUseCase(driverRepository)

    const driver = await loginOrSignup.execute(query.access_token)

    return response.status(200).send({ driver_id: driver.id })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return response.status(400).send({ message: err.message })
    }

    throw err
  }
}

export const signinGoogle = {
  handler,
  responseSchema,
  querySchema,
}

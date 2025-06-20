import { InvalidCredentialsError } from '@/http/errors/invelid-credentials-errors'
import type { DriverRepository } from '@/repositories/interfaces/driver-repository'
import z from 'zod'

const userInfoSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  picture: z.string().url().optional().nullable(),
})

export class LoginOrSignupUseCase {
  constructor(private driverRepository: DriverRepository) {}

  async execute(accessToken: string) {
    const URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

    const userResponse = await fetch(URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {
      throw new InvalidCredentialsError()
    })

    const userInfo = await userResponse.json().then((data) => {
      return userInfoSchema.safeParse(data)
    })

    if (!userInfo.success) {
      throw new InvalidCredentialsError()
    }

    const user = userInfo.data

    const userFound = await this.driverRepository.getByGoogleIdOrEmail(
      user.id,
      user.email,
    )

    if (userFound) {
      return userFound
    }

    return await this.driverRepository.create({
      email: user.email,
      google_id: user.id,
      name: user.name ?? '',
      photo_url: user.picture,
    })
  }
}

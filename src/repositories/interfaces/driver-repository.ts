import type { Prisma } from 'prisma/generated'

type Id = { id: string }

export interface DriverRepository {
  existsByGoogleId(googleId: string): Promise<Id | null>
  existsByEmail(email: string): Promise<Id | null>
  getByGoogleId(googleId: string): Promise<void>
  getByEmail(email: string): Promise<void>
  getByGoogleIdOrEmail(googleId: string, email: string): Promise<Id | null>
  create(data: Prisma.DriverCreateInput): Promise<Id>
}

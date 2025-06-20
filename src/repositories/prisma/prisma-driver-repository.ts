import { prisma } from '@/libs/prisma'
import type { DriverRepository } from '../interfaces/driver-repository'
import type { Prisma } from 'prisma/generated'

export class PrismaDriverRepository implements DriverRepository {
  async existsByGoogleId(googleId: string) {
    return await prisma.driver.findUnique({
      where: { google_id: googleId },
      select: { id: true },
    })
  }

  async existsByEmail(email: string) {
    return await prisma.driver.findUnique({
      where: { email },
      select: { id: true },
    })
  }

  async getByGoogleIdOrEmail(googleId: string, email: string) {
    return await prisma.driver.findFirst({
      where: { OR: [{ google_id: googleId }, { email }] },
      select: { id: true },
    })
  }

  getByGoogleId(googleId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getByEmail(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async create(data: Prisma.DriverCreateInput) {
    return await prisma.driver.create({
      data,
      select: { id: true },
    })
  }
}

// Production db.ts — no LibSQL adapter, PostgreSQL only
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma = globalForPrisma.prisma ?? (new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}) as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

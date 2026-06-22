// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // Only use LibSQL adapter for local SQLite dev
  const url = process.env.DATABASE_URL || 'file:./dev.db'
  if (url.startsWith('file:')) {
    try {
      const { PrismaLibSql } = require('@prisma/adapter-libsql')
      const adapter = new PrismaLibSql({ url })
      return new PrismaClient({ adapter } as any)
    } catch {
      // Adapter not available, use default client
    }
  }

  return client
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

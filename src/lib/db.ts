// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 Shogo Technologies, Inc.
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient() {
  const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql') || process.env.DATABASE_URL?.startsWith('postgres')

  if (isPostgres) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (PrismaClient as any)({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }

  const { PrismaLibSql } = require('@prisma/adapter-libsql')
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? (createClient() as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

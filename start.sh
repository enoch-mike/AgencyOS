#!/bin/sh
set -e

# If DATABASE_URL is postgres, ensure Prisma is configured for it
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then
  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma 2>/dev/null || true
  bun x prisma generate 2>/dev/null || true
  bun x prisma db push --skip-generate 2>/dev/null || true
fi

exec bun run start

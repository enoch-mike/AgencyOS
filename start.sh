#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then
  echo "🐘 PostgreSQL detected — configuring for production..."

  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  bun x prisma generate
  bun x prisma db push --skip-generate
fi

exec bun run start

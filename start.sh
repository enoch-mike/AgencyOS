#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then
  echo "PostgreSQL detected — configuring..."

  sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
  echo "Running prisma generate..."
  bun x prisma generate
  echo "Running prisma db push..."
  bun x prisma db push --skip-generate --accept-data-loss
  echo "Database ready."
fi

echo "Starting server..."
exec bun run start

#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then
  echo "PostgreSQL detected — pushing schema..."
  bun x prisma db push --skip-generate --accept-data-loss
  echo "Database ready."
fi

echo "Starting server on port ${PORT:-3001}..."
exec bun run start

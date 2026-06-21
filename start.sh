#!/bin/sh
set -e

echo "Pushing database schema..."
bun x prisma db push --skip-generate --accept-data-loss
echo "Database ready."

echo "Starting server on port ${PORT:-3001}..."
exec bun run start

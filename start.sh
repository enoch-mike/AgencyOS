#!/bin/sh

echo "Pushing database schema in background..."
bun x prisma db push --accept-data-loss 2>&1 &
echo "Starting server on port ${PORT:-8080}..."
exec bun run start

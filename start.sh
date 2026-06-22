#!/bin/sh

export PORT=3001

echo "Pushing database schema in background..."
bun x prisma db push --accept-data-loss 2>&1 &
echo "Starting server on port ${PORT}..."
exec bun run start

#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then
  echo "PostgreSQL detected — configuring..."

  bun -e "
    const fs = require('fs');
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');
    fs.writeFileSync('prisma/schema.prisma', schema.replace('provider = \"sqlite\"', 'provider = \"postgresql\"'));
    console.log('Provider swapped to postgresql');
  "

  echo "Running prisma generate..."
  bun x prisma generate

  echo "Running prisma db push..."
  bun x prisma db push --skip-generate --accept-data-loss

  echo "Database ready."
fi

echo "Starting server on port ${PORT:-3001}..."
exec bun run start

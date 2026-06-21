# Stage 1: Install dependencies
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Stage 2: Build
FROM base AS build
COPY . .

# If DATABASE_URL starts with postgres, swap provider to postgresql
RUN if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "^postgresql"; then \
      sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma; \
    fi

# Generate Prisma client
RUN bun x prisma generate

# Build frontend
RUN bun run build

# Stage 3: Production
FROM oven/bun:1-slim AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.tsx ./server.tsx
COPY --from=build /app/custom-routes.ts ./custom-routes.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/package.json ./
COPY --from=build /app/shogo.config.json ./

EXPOSE 3001

CMD ["bun", "run", "start"]

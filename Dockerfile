FROM oven/bun:1-slim AS base
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

FROM base AS build
COPY . .

RUN bun -e "const fs=require('fs');const s=fs.readFileSync('prisma/schema.prisma','utf-8');fs.writeFileSync('prisma/schema.prisma',s.replace('provider = \"sqlite\"','provider = \"postgresql\"'))" && bun x prisma generate && bun run build

FROM base AS production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.tsx ./server.tsx
COPY --from=build /app/custom-routes.ts ./custom-routes.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/src/lib ./src/lib
COPY --from=build /app/src/components ./src/components
COPY --from=build /app/package.json ./
COPY --from=build /app/shogo.config.json ./
COPY --from=build /app/start.sh ./
COPY --from=build /app/db.production.ts ./db.production.ts
RUN chmod +x ./start.sh
RUN cp db.production.ts src/lib/db.ts && rm db.production.ts

EXPOSE 3001

CMD ["./start.sh"]

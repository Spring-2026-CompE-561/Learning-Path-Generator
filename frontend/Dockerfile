# Official Bun image. Bun is the package manager (per bun.lock) AND the
# runtime that executes the Next.js dev server.
#stage 1 Building
FROM oven/bun:1 AS builder

WORKDIR /app

# Install deps first for layer caching — only re-runs when manifests change.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Bring in the rest of the source. Compose mounts ./frontend over /app
# at runtime for hot reload; this COPY makes the image runnable standalone.
COPY . .

# building
Run bun run build

#Stage 2L minimal runtime
FROM oven/bun:1-slim
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/bun.lock bun.lock
COPY --from=builder /app/node_modules node_modules



EXPOSE 3000

CMD ["bun","run", "start"]

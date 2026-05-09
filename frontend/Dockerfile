# Official Bun image. Bun is the package manager (per bun.lock) AND the
# runtime that executes the Next.js dev server.
#stage 1 Building
# begin image that already hav bun installed
FROM oven/bun:1 AS builder
# setting app as working directory where all later command happen in this directory
WORKDIR /app

# Install deps first for layer caching — only re-runs when manifests change.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Bring in the rest of the source. Compose mounts ./frontend over /app
# at runtime for hot reload; this COPY makes the image runnable standalone.
COPY . .

# building Next.js for production
RUN bun run build


#Stage 2 minimal runtime
# start a second smaller image, smaller than the build image
FROM node:20-alpine
WORKDIR /app
# Declare this is a production environment
ENV NODE_ENV=production
# Copying all neccessaries from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public



EXPOSE 3000
# command run when container started
CMD ["node", "./server.js"]

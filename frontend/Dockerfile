# Official Bun image. Bun is the package manager (per bun.lock) AND the
# runtime that executes the Next.js dev server.
FROM oven/bun:1

WORKDIR /app

# Install deps first for layer caching — only re-runs when manifests change.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Bring in the rest of the source. Compose mounts ./frontend over /app
# at runtime for hot reload; this COPY makes the image runnable standalone.
COPY . .

EXPOSE 3000

# Next defaults to listening on all interfaces inside containers, but we
# pass -H 0.0.0.0 explicitly so behavior doesn't depend on Next's defaults.
CMD ["bunx", "next", "dev", "-H", "0.0.0.0"]

# uv's official image — Python 3.12 and uv are both pre-installed.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Copy dependency manifests first so this layer caches
# until pyproject.toml / uv.lock actually change.
COPY pyproject.toml uv.lock ./

# Install deps into /app/.venv. --frozen forbids touching uv.lock,
# --no-install-project skips installing the app itself (no source yet).
RUN uv sync --frozen --no-install-project

# Now bring in the rest of the source and install the project itself.
# Compose will also bind-mount ./backend over /app for hot reload, but
# baking source in keeps the image runnable without a mount (e.g. in prod).
COPY . .
RUN uv sync --frozen

EXPOSE 8000

# fastapi dev binds to 127.0.0.1 by default — unreachable from outside
# the container. --host 0.0.0.0 makes it listen on all interfaces so
# the published port (compose's "8000:8000") actually works.
CMD ["uv", "run", "fastapi", "dev", "src/app/main.py", "--host", "0.0.0.0", "--port", "8000"]

# Learning Path Generator

A FastAPI backend API for generating personalized learning schedules. Users can create structured learning paths broken down into weekly plans with curated resources.

## Tech Stack

### Backend

* **FastAPI** - Web framework
* **PostgreSQL (Docker)** - Database
* **SQLAlchemy** - ORM
* **PyJWT + Argon2** - Authentication & password hashing
* **Pydantic** - Data validation

### Frontend

* **Next.js 16 (App Router + Turbopack)**
* **React + TypeScript**
* **shadcn/ui** - Component system
* **Bun** - Runtime & package manager

### DevOps

* **Docker + Docker Compose** - Containerized development

---

## Prerequisites

- **Docker** (Docker Desktop recommended)
- **Bun** (required for local frontend development and Playwright tests)
- **uv** (required only for running the backend locally without Docker)

> This project uses **Docker Compose v2** (`docker compose`).
> Modern Docker installations already include this.

### Verify installation

```bash
docker --version
docker compose version
bun --version
uv --version
```
If you only run the app with Docker, Bun and uv are not required.

---

## Getting Started (Docker - Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/Spring-2026-CompE-561/Learning-Path-Generator.git
cd Learning-Path-Generator
```

---

### 2. Set up environment variables

Create a `.env` file inside the **backend folder**:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with the following values:

```
SECRET_KEY=<output of: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://postgres:postgres@db:5432/learning_paths_test

GROQ_API_KEY=your_groq_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

---

### 3. Run the application

#### Mac / Windows:

```bash
docker compose up --build
```

#### Ubuntu / Linux:

```bash
sudo docker compose up --build
```

---

### 4. Access the application

Once Docker Compose is running:

* **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:8000](http://localhost:8000)
* **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

The frontend communicates with the backend automatically via the configured environment variables.

---

## Services Overview

The root-level `docker-compose.yml` runs the full application stack:

* **db** - PostgreSQL 16 database using a named Docker volume (`pgdata`)
* **backend** - FastAPI backend built from `backend/Dockerfile`
* **frontend** - Next.js frontend built from `frontend/Dockerfile`

### Docker Compose Behavior

* PostgreSQL runs first and uses a healthcheck with `pg_isready`
* Backend waits for the database to become healthy before starting
* Frontend waits for the backend service
* Backend source is bind-mounted for hot reload
* Frontend source is bind-mounted for hot reload
* Anonymous volumes protect container-specific `.venv`, `node_modules`, and `.next` folders

### Environment Variables Used by Compose

The backend loads variables from:

```bash
backend/.env
```

Docker Compose overrides `DATABASE_URL` inside the backend container so the backend connects to PostgreSQL using the Docker service name `db` instead of `localhost`:

```bash
DATABASE_URL=postgresql+psycopg://learning_app:dev_password_123@db:5432/learning_paths
```

The frontend uses:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://backend:8000
```

* `NEXT_PUBLIC_API_URL` is used by browser-side frontend requests
* `INTERNAL_API_URL` is used inside the frontend container for server-side requests

---

## Backend (FastAPI)

The backend is a **FastAPI application** located under `backend/src/app/`. The `backend/` folder also contains its own `Dockerfile`, dependency files, and environment file.

### Backend Structure

```
backend/
├── src/
│   └── app/
│       ├── main.py
│       ├── core/              # auth, database, settings
│       ├── exceptions/
│       ├── models/            # ORM models
│       ├── schemas/           # Pydantic schemas
│       ├── routes/            # API endpoints
│       ├── services/          # business logic (incl. ai.py)
│       ├── repository/        # data access layer
│       └── tests/             # unit tests
├── .env
├── .env.example
├── Dockerfile
├── pyproject.toml
├── pytest.ini
├── requirements.txt
└── uv.lock
```

---

## Frontend (Next.js + shadcn/ui)

The frontend is built using **Next.js (App Router + Turbopack)** and **Bun**, with UI components based on **shadcn/ui**.

### Key Notes

* Uses **App Router structure** (`src/app/`)
* Organized route groups (e.g. `(auth)`)
* Reusable UI components via `components/ui/`
* Custom hooks for dialogs and state management

### Structure Overview

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── account/
│   │   │   ├── dashboard/
│   │   │   └── schedule/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (Button, Dialog, etc.)
│   │   ├── meteor.tsx
│   │   ├── useLearningPathDialog.tsx
│   │   ├── useLogDialog.tsx
│   │   ├── useProfile.tsx
│   │   └── useSignDialog.tsx
│   └── lib/
```

### UI Components (shadcn)

This project follows **shadcn/ui conventions**:

* Components are locally installed and customizable
* Examples include:

  * Dialogs
  * Buttons
  * Forms
  * Inputs

To add new components:

```bash
bunx shadcn-ui@latest add <component-name>
```

---

## API Endpoints

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/users/register`                 | Register a new user             |
| POST   | `/users/login`                    | Login (returns JWT token)       |
| POST   | `/users/logout`                   | Logout / revoke tokens          |
| PUT    | `/users/update`                   | Update user credentials         |
| DELETE | `/users/me`                       | Delete user account             |
| POST   | `/learning-paths/`                | Create a learning path          |
| GET    | `/learning-paths/`                | Get all user's learning paths   |
| GET    | `/learning-paths/{id}`            | Get a specific learning path    |
| PUT    | `/learning-paths/{id}`            | Update a learning path          |
| DELETE | `/learning-paths/{id}`            | Delete a learning path          |
| GET    | `/learning-paths/{id}/weeklyplan` | Get weekly plans for a path     |
| POST   | `/resources`                      | Create a resource               |
| GET    | `/weeklyplan/{id}/resources`      | Get resources for a weekly plan |
| PUT    | `/resources/{id}`                 | Update a resource               |
| DELETE | `/resources/{id}`                 | Delete a resource               |

All endpoints except register and login require a Bearer JWT token.

---

## Data Model

```
User → LearningPath → WeeklyPlan → Resource
```

---

## Project Structure

The project is split into two main applications: a **FastAPI backend** and a **Next.js frontend**. Each application has its own `Dockerfile`, and the root-level `docker-compose.yml` builds and runs both containers together with PostgreSQL.

```
Learning-Path-Generator/
├── backend/
│   ├── src/                  # FastAPI application source code
│   ├── .dockerignore
│   ├── .env.example
│   ├── .python-version
│   ├── Dockerfile            # Backend container build file
│   ├── pyproject.toml
│   ├── pytest.ini
│   ├── requirements.txt
│   └── uv.lock
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── account/
│   │   │   │   ├── dashboard/
│   │   │   │   └── schedule/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── meteor.tsx
│   │   │   ├── useLearningPathDialog.tsx
│   │   │   ├── useLogDialog.tsx
│   │   │   ├── useProfile.tsx
│   │   │   └── useSignDialog.tsx
│   │   └── lib/
│   ├── .dockerignore
│   ├── Dockerfile            # Frontend container build file
│   ├── bun.lock
│   ├── components.json       # shadcn/ui config
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│   └── postgres-init.sql     # PostgreSQL initialization script
│
├── docs/
│   └── LearnPathAPI.yaml
│
└── docker-compose.yml        # Runs db, backend, and frontend together
```

---

## Development (Optional - Local without Docker)

### Backend

```bash
uv sync
uv run fastapi dev src/app/main.py
```

### Frontend

```bash
bun install
bun run dev
```

> Note: `bun run dev` is sufficient. You do **not** need `--bun` unless explicitly required for a script override.

---

## Testing

### Backend (Pytest)

#### Run all tests

```bash
uv run pytest src/app/tests/ -v
```

#### Run specific test groups

```bash
# User
uv run pytest src/app/tests/unit_tests/user/ -v

# Learning Path
uv run pytest src/app/tests/unit_tests/learning_path/ -v

# Weekly Plan
uv run pytest src/app/tests/unit_tests/weekly_plan/ -v

# Resource
uv run pytest src/app/tests/unit_tests/resources/ -v
```

---

### Frontend E2E (Playwright)

This project uses **Playwright** for end-to-end testing of the frontend.

#### Setup

```bash
cd frontend
bun install
bunx playwright install
```

> **Linux / Ubuntu users:**
> If tests fail due to missing system libraries, run:
>
> ```bash
> bunx playwright install --with-deps
> ```

---

#### Run tests

Make sure the application is running first:

```bash
docker compose up
```

Then in another terminal:

```bash
cd frontend
bun run test:e2e
```

---

#### Debug tests (optional)

```bash
bunx playwright test --headed --debug
```

---

#### Notes

* Tests require both **frontend and backend** to be running
* Default test URL: `http://localhost:3000`
* If login-related tests fail, ensure:

  * backend is running (`http://localhost:8000`)
  * frontend can reach backend API
  * test user exists or is created during tests

---

## Notes

* Database data persists using Docker volumes
* Backend waits for database readiness before starting
* Hot reload is enabled for development
* `.env` must be placed inside the `backend/` directory (not root)

---

## Full API Spec

See `docs/LearnPathAPI.yaml` for the OpenAPI specification

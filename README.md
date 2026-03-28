# Learning Path Generator

A FastAPI backend API for generating personalized learning schedules. Users can create structured learning paths broken down into weekly plans with curated resources.

## Tech Stack

- **FastAPI** - Web framework
- **SQLAlchemy** - ORM with SQLite (default)
- **PyJWT + Argon2** - JWT authentication and password hashing
- **Pydantic** - Data validation and settings management
- **uv** - Package manager

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) package manager

## Getting Started

### 1. Clone and navigate to the project

```bash
git clone https://github.com/Spring-2026-CompE-561/Learning-Path-Generator.git
cd Learning-Path-Generator
```

### 2. Install dependencies

```bash
uv sync
```

To include dev tools (ruff, pytest, pre-commit):

```bash
uv sync --group dev
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```
SECRET_KEY=<output of: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./learning_paths.db
```

### 4. Run the development server

```bash
uv run fastapi dev src/app/main.py
```

The server starts at **http://localhost:8000**.

- Swagger UI docs: http://localhost:8000/docs
- ReDoc docs: http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Login (returns JWT token) |
| POST | `/users/logout` | Logout / revoke tokens |
| PUT | `/users/update` | Update user credentials |
| DELETE | `/users/me` | Delete user account |
| POST | `/learning-paths/` | Create a learning path |
| GET | `/learning-paths/` | Get all user's learning paths |
| GET | `/learning-paths/{id}` | Get a specific learning path |
| PUT | `/learning-paths/{id}` | Update a learning path |
| DELETE | `/learning-paths/{id}` | Delete a learning path |
| GET | `/learning-paths/{id}/weeklyplan` | Get weekly plans for a path |
| POST | `/resources` | Create a resource |
| GET | `/weeklyplan/{id}/resources` | Get resources for a weekly plan |
| PUT | `/resources/{id}` | Update a resource |
| DELETE | `/resources/{id}` | Delete a resource |

All endpoints except register and login require a Bearer JWT token.

## Data Model

```
User → LearningPath → WeeklyPlan → Resource
```

- **User** - Account with username, email, hashed password
- **LearningPath** - A topic to learn with proficiency level, learning preferences, and duration (1-52 weeks)
- **WeeklyPlan** - Weekly goals and completion tracking for a learning path
- **Resource** - Learning materials (videos, articles, tutorials, etc.) linked to a weekly plan

## Project Structure

```
src/app/
├── main.py            # App entry point, router registration, CORS, middleware
├── core/
│   ├── settings.py    # App configuration from .env
│   ├── database.py    # SQLAlchemy engine and session setup
│   ├── auth.py        # JWT and password utilities
│   └── experienceLevel.py
├── models/            # SQLAlchemy ORM models
├── schemas/           # Pydantic request/response schemas
├── routes/            # API endpoint definitions
├── services/          # Business logic layer
├── repository/        # Data access layer
├── exceptions/        # Custom exceptions
└── tests/             # Unit tests
```

## Development

### Run linter and formatter

```bash
uv run ruff check src/
uv run ruff format src/
```

### Run tests

```bash
uv run python -m pytest
```

Run a specific test file:

```bash
uv run python -m pytest src/app/tests/unit_tests/user/test_user_routes.py
```

### Pre-commit hooks

Install hooks (one-time setup):

```bash
uv run pre-commit install
```

Run manually on all files:

```bash
uv run pre-commit run --all-files
```

## Full API Spec

See [docs/LearnPathAPI.yaml](docs/LearnPathAPI.yaml) for the complete OpenAPI 3.0.3 specification.


# How to run tests

# Testing Guide

## Setup

Make sure you have the dev dependencies installed and a `.env` file at the project root:

```bash
uv sync --group dev
```

Your `.env` should have:
```
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./learning_paths.db
```

All tests use an isolated SQLite test database so your real data is never touched.
## Running All Tests

```bash
uv run pytest src/app/tests/ -v
```

## Running Tests by Object

### User
```bash
uv run pytest src/app/tests/unit_tests/user/ -v
```

### Learning Path
```bash
uv run pytest src/app/tests/unit_tests/learning_path/ -v
```

### Weekly Plan
```bash
uv run pytest src/app/tests/unit_tests/weekly_plan/ -v
```

### Resource
```bash
uv run pytest src/app/tests/unit_tests/resources/ -v
```

---

## Running Tests by Layer

### Repository only (database operations)
```bash
uv run pytest src/app/tests/ -v -k "repository"
```

### Service only (business logic)
```bash
uv run pytest src/app/tests/ -v -k "service"
```

### Routes only (HTTP endpoints)
```bash
uv run pytest src/app/tests/ -v -k "routes"
```

## Running a Single Test

```bash
uv run pytest src/app/tests/unit_tests/user/test_user_routes.py::test_register_user_success -v
```

---

## Test Structure

```
src/app/tests/
    conftest.py                          # shared fixtures (db, client)
    unit_tests/
        user/
            conftest.py                  # user fixtures
            test_user_repository.py
            test_user_routes.py
            test_user_service.py
        learning_path/
            conftest.py                  # learning path fixtures
            test_learning_path_repository.py
            test_learning_path_routes.py
            test_learning_path_service.py
        weekly_plan/
            conftest.py                  # weekly plan fixtures
            test_weekly_plan_repository.py
            test_weekly_plan_routes.py
            test_weekly_plan_service.py
        resources/
            conftest.py                  # resource fixtures
            test_resource_repository.py
            test_resource_routes.py
            test_resource_service.py
```

## Notes

- Tests are isolated, each test starts with a fresh database and cleans up after itself
- The `conftest.py` in each folder provides fixtures specific to that object
- The top-level `conftest.py` provides the shared `db` and `client` fixtures used by all tests
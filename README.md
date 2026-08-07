# Task Manager

A full-stack Task Manager application built as an onboarding project. Users can create, view, update, and delete tasks with title, description, status, priority, and optional due date. Includes an AI-powered summarisation feature via the Claude API.

## Tech Stack

| Layer | Technology |
|---|---|
| Back-end API | Node.js + Express + TypeScript |
| Front-end | React + TypeScript + Vite |
| Database | PostgreSQL via `pg` (typed queries, no ORM) |
| Testing | Vitest (unit + integration) + Playwright (E2E) |
| CI/CD | GitHub Actions |
| AI (stretch) | Claude API via `@anthropic-ai/sdk` |

## Prerequisites

- **Node.js** ≥ 22
- **npm** ≥ 10
- **Docker** + **Docker Compose** (for local PostgreSQL)

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd task-manager
npm ci
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port **5433** and automatically runs `schema.sql` on first start.

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` as needed. Defaults for local development:

```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=taskmanager_dev
```

For the AI summarisation feature, add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Build the shared package

The API and web packages both depend on `packages/shared` for shared types and Zod schemas:

```bash
npm run build --workspace=packages/shared
```

### 5. Start the dev servers

```bash
npm run dev
```

This starts both the API (port 3000) and the React dev server (port 5173) concurrently.

## Project Structure

```
task-manager/
├── packages/
│   ├── api/          # Node.js + Express + TypeScript
│   │   ├── src/
│   │   │   ├── routes/        # HTTP layer — delegates to controllers
│   │   │   ├── controllers/   # Request parsing, validation, responses
│   │   │   ├── service/       # Business logic
│   │   │   ├── repository/    # Database access (SQL queries)
│   │   │   └── config/        # Database pool configuration
│   │   └── vitest.config.ts   # Test runner + coverage configuration
│   │
│   ├── web/          # React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Route-level components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── api/           # Typed API client (shared types)
│   │   └── e2e/               # Playwright E2E tests
│   │
│   └── shared/       # Shared TypeScript types + Zod schemas
│
├── .github/workflows/ci.yml  # GitHub Actions pipeline
├── docker-compose.yml         # Local Postgres instance
└── schema.sql                 # Database schema
```

## Available Scripts

From the project root:

| Script | Description |
|---|---|
| `npm run dev` | Start API + React dev servers concurrently |
| `npm run build` | Build all packages (shared → api → web) |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run type-check` | Run TypeScript type checking across all workspaces |
| `npm run test:unit` | Run unit tests (service layer, mocked repos) |
| `npm run test:unit:ci` | Run unit tests **with coverage** (used in CI) |
| `npm run test:integration` | Run integration tests (requires running Postgres) |
| `npm run test:coverage` | Run all tests with coverage report |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without modifying files |

## Running Tests

### Unit tests

```bash
npm run test:unit
```

### Unit tests with coverage

```bash
npm run test:unit:ci
```

Coverage report is generated in `packages/api/coverage/`. Thresholds are enforced at ≥70% for lines, functions, branches, and statements.

### Integration tests

Requires a running PostgreSQL instance (via `docker compose up -d`):

```bash
npm run test:integration
```

### E2E tests (Playwright)

Requires both the API and web dev servers to be running:

```bash
cd packages/web
npx playwright test
```

## CI Pipeline

GitHub Actions runs on every push and pull request:

1. Install dependencies
2. Build shared package
3. Lint
4. Type check
5. Initialize test database schema
6. Run unit tests with coverage (≥70% enforced)
7. Run integration tests (against real Postgres)
8. Build all packages
9. Upload coverage report as CI artifact

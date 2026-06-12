# DevLink

DevLink is a PERN stack starter for developer collaboration workflows. The repository now includes a runnable Express API, PostgreSQL schema bootstrapping, a React frontend, and Docker Compose so you can bring up the whole stack from the repo root.

## What is included

- Root workspace scripts for local development
- Express API with PostgreSQL connectivity and JWT auth endpoints
- React app with login, register, and dashboard routes
- Docker Compose for the full stack

## Project structure

```text
DevLink/
├── backend/
├── frontend/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create your environment file from the example:

```bash
copy .env.example .env
```

If you want local PostgreSQL outside Docker, set the `DB_*` values in your `.env` file before starting the server.

## Run locally

Start both apps from the repository root:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Run with Docker

Use the full-stack container setup from the repository root:

```bash
docker compose up --build
```

## API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`

## Database

The backend creates the `users` table on startup when `DATABASE_URL` is configured. The starter is ready for future project, skill, and join-request tables.

## Next steps

Add profile pages, project management features, join requests, and richer authorization rules on top of this scaffold.

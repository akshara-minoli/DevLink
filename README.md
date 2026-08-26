# DevLink

DevLink is a full-stack developer collaboration platform built with React,
Express, and PostgreSQL. Developers can publish profiles and skills, discover
projects, request to join teams, invite collaborators, and receive in-app
notifications. Administrators can moderate users and projects and send
notifications from a dedicated dashboard.

## Features

- JWT registration, login, and protected sessions
- Developer profiles with skills, social links, location, and portfolio details
- Public profile discovery with text and skill filters
- Project creation, editing, discovery, and skill-based recommendations
- Join-request approval and rejection workflows
- Direct collaborator invitations
- In-app notifications with read state
- Admin statistics, user management, project moderation, and announcements
- Light and dark themes
- Docker development and production images
- Jenkins CI with Docker image build stages
- Kubernetes manifests for PostgreSQL, the API, the web app, and ingress

## Technology

- Frontend: React 18, React Router, Vite, and Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt, and Prisma schema tooling
- Delivery: Docker, Nginx, Jenkins, Kubernetes, and Kustomize

## Repository Structure

```text
DevLink/
|-- backend/
|   |-- prisma/schema.prisma
|   |-- src/
|   |-- Dockerfile
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- Dockerfile
|   |-- nginx.conf
|   `-- package.json
|-- k8s/base/
|-- .dockerignore
|-- .env.example
|-- docker-compose.yml
|-- Dockerfile
|-- Jenkinsfile
|-- package-lock.json
`-- package.json
```

## Requirements

- Node.js 20 or later
- npm 10 or later
- PostgreSQL 16, or Docker Desktop with Docker Compose

## Environment

Copy the root example before running locally:

```powershell
Copy-Item .env.example .env
```

Important variables:

| Variable | Purpose | Development default |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host when `DATABASE_URL` is empty | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `devlink` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | Set locally |
| `DATABASE_URL` | Complete PostgreSQL connection string; overrides `DB_*` | Empty |
| `JWT_SECRET` | JWT signing secret | Replace before shared or production use |
| `PORT` | Express API port | `5000` |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS | `http://localhost:5173` |
| `VITE_API_URL` | API base URL embedded in the frontend | `http://localhost:5000` |

The API creates and updates the required tables and indexes at startup. The
schema includes users, skills, projects, project members, join requests,
collaboration requests, and notifications.

## Local Development

Install all workspace dependencies:

```bash
npm ci
```

Start the frontend and backend together:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

Individual workspace commands:

```bash
npm run dev:frontend
npm run dev:backend
npm run build
```

## Admin Account

Seed the development admin after configuring PostgreSQL:

```bash
npm run seed:admin --workspace backend
```

The current seed script creates `admin@devlink.lk` with password `admin@123`.
These credentials are for local development only and must be changed before
using the application in a shared environment.

## Docker Development

The root Compose configuration runs PostgreSQL and the combined development
container:

```bash
docker compose up --build
```

The application remains available on ports `5173` and `5000`. PostgreSQL data
is stored in the `db_data` volume.

Production images use separate Dockerfiles:

```bash
docker build -t devlink-api -f backend/Dockerfile .
docker build --build-arg VITE_API_URL=/api -t devlink-web -f frontend/Dockerfile .
```

The web image serves the Vite build through Nginx and proxies `/api/` to the
`devlink-api` service.

## API

Health:

- `GET /api/health`

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Profiles and skills:

- `GET /api/profiles`
- `GET /api/profiles/:id`
- `GET`, `PUT`, `DELETE /api/profile/me`
- `POST /api/skills`
- `DELETE /api/skills/:name`
- `GET /api/users`

Projects and collaboration:

- `GET`, `POST /api/projects`
- `GET /api/projects/recommended`
- `PUT`, `DELETE /api/projects/:id`
- `POST /api/projects/:id/join`
- `POST /api/projects/:id/collaborators`
- `GET /api/requests`
- `GET /api/requests/pending-count`
- `PATCH /api/requests/:id`

Notifications and administration:

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/admin/overview`
- `PATCH`, `DELETE /api/admin/users/:id`
- `DELETE /api/admin/projects/:id`
- `POST /api/admin/notifications`

Endpoints that modify profiles, projects, requests, or notifications require a
Bearer token. Administration endpoints additionally require the `admin` role.

## Jenkins

The Jenkins job should use **Pipeline script from SCM**, branch `main`, with
`Jenkinsfile` as the script path. The pipeline:

1. Checks out the selected revision into a clean workspace.
2. Verifies access to a Docker daemon.
3. Runs `npm ci` with a persistent cache and network retries.
4. Builds the frontend and verifies that the backend application loads.
5. Builds commit-tagged API and web images.
6. Pushes images and deploys only when Jenkins identifies a `main` or `master`
   branch build.

The current standalone Jenkins job does not populate `BRANCH_NAME` or
`GIT_BRANCH`, so image push and Kubernetes deployment are skipped while CI and
image builds still run.

Required Jenkins credentials for delivery:

- `ghcr-token`
- `kubeconfig`
- `devlink-postgres-password`
- `devlink-jwt-secret`
- `devlink-client-origin`

The Jenkins agent also needs the Docker CLI, access to a Docker daemon, and
`kubectl` for deployment. The current local Jenkins container connects through:

```text
DOCKER_HOST=unix:///var/run/docker.sock
```

This requires mounting `/var/run/docker.sock` into Jenkins and granting the
Jenkins process access to the socket. A TLS-enabled Docker-in-Docker setup can
instead use `tcp://docker:2376` with valid client certificates.

## Kubernetes

The `k8s/base` Kustomize configuration deploys:

- Namespace `devlink`
- PostgreSQL 16 with a 5 Gi persistent volume claim
- API deployment and service on port `5000`
- Nginx web deployment and service on port `80`
- Ingress host `devlink.local`

The workloads expect a `devlink-secrets` secret containing
`POSTGRES_PASSWORD`, `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN`.

Apply the base manifests with:

```bash
kubectl apply -k k8s/base
```

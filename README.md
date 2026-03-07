# User Management & Task Tracker API

> Single-file project documentation intended for reviewers and engineers. Place this file at the repository root as `README.md`.

---

## Table of contents

1. [Project Summary](#project-summary)
2. [Goals & Scope](#goals--scope)
3. [Technology Stack](#technology-stack)
4. [Architecture & Design](#architecture--design)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Reference (stable endpoints)](#api-reference-stable-endpoints)
8. [Environment & Configuration](#environment--configuration)
9. [Local Development](#local-development)
10. [Testing](#testing)
11. [Error Handling & Logging](#error-handling--logging)
12. [Security Considerations](#security-considerations)
13. [Deployment & CI/CD](#deployment--cicd)
14. [Operational Notes](#operational-notes)
15. [Future Improvements](#future-improvements)
16. [Appendix: Examples and Useful Commands](#appendix-examples-and-useful-commands)

---

## Project summary

A small, production-oriented backend API that supports user management and task tracking. It exposes endpoints for user registration, authentication, profile retrieval, task CRUD operations, and admin-only user management. The system uses JWT-based authentication, role-based authorization, and TypeORM with SQLite for persistence.

Design goals:

- Keep the code modular and testable (controllers, routes, utils, entities).
- Enforce secure defaults (hashed passwords, secret configuration in env).
- Provide clear, deterministic API contracts useful for automated tests.

Intended audience: maintainers, reviewers, and engineering peers evaluating implementation quality and design trade-offs.

---

## Goals & scope

**In-scope:**

- User registration and login
- JWT issuance and verification
- Per-user task ownership (users see their tasks only)
- Admin role with elevated privileges (view/delete users, view all tasks)
- Automated tests (Jest + Supertest)

**Out-of-scope (for this iteration):**

- Refresh tokens
- Pagination or advanced filtering for tasks
- Rate limiting, audit trails, or production-grade observability

---

## Technology stack

- **Runtime:** Node.js (LTS)
- **Web framework:** Express.js
- **ORM:** TypeORM (SQLite for local/test)
- **Authentication:** JWT (jsonwebtoken)
- **Password hashing:** bcrypt
- **Testing:** Jest + Supertest
- **Dev tooling:** nodemon (optional), eslint (project linting), prettier (formatting)

---

## Architecture & design

The project adopts a layered structure to separate concerns and ease testing:

```
Client -> Routes -> Controllers -> Service / Utils -> Repositories (TypeORM Entities) -> DB
```

- **Routes**: thin mapping from HTTP path/verb to controllers
- **Controllers**: parse and validate requests, orchestrate calls to utils/services, prepare HTTP responses
- **Utils / Services**: business logic and data access helpers
- **Entities / Repositories**: TypeORM entity definitions and DB interactions

This separation enables unit testing of controllers and services independently from persistence.

---

## Database schema

Two primary entities are used: `User` and `Task`.

### `User` (table: users)

| Column     | Type     | Notes                            |
| ---------- | -------- | -------------------------------- |
| id         | varchar  | primary key (string id provided) |
| password   | varchar  | bcrypt hashed password           |
| role       | varchar  | `user` or `admin`                |
| created_at | datetime | auto-generated timestamp         |

**Relations**

- One-to-many: User -> Task

### `Task` (table: tasks)

| Column      | Type     | Notes                            |                         |
| ----------- | -------- | -------------------------------- | ----------------------- |
| id          | varchar  | primary key (e.g. `task_<uuid>`) |                         |
| user_id     | varchar  | foreign key -> users.id          |                         |
| title       | varchar  | required                         |                         |
| description | varchar  | optional                         |                         |
| status      | varchar  | `pending`                        | `completed` (enum-like) |
| created_at  | datetime | timestamp                        |                         |

All timestamps are stored in UTC.

---

## Authentication & authorization

### Flow (high level)

1. Register (`POST /auth/register`) with `{ id, password }`.
2. Server hashes password with bcrypt and stores user with default role `user` (unless seeded differently).
3. Login (`POST /auth/login`) with `{ id, password }`.
4. Server verifies credentials and returns a JWT signed with `JWT_SECRET`.
5. Client includes `Authorization: Bearer <token>` for protected endpoints.
6. Authentication middleware extracts and verifies token and appends `req.user` with `id` and `role`.
7. Authorization checks within controllers confirm resource ownership or admin role.

**Note:** The code enforces a strict payload validation for auth endpoints — request bodies must contain only `id` and `password` or will receive `400 Bad Request`.

---

## API reference (stable endpoints)

> All responses are JSON. All protected endpoints require `Authorization: Bearer <JWT>`.

### Authentication

#### Register

- `POST /auth/register`
- Request body:

```json
{
  "id": "string",
  "password": "string"
}
```

- Success response: `201 Created`

```json
{ "id": "user1", "msg": "user created" }
```

- Validation errors: `400 Bad Request` (invalid keys / missing fields)

---

#### Login

- `POST /auth/login`
- Request body: same shape as register
- Success response: `200 OK`

```json
{ "token": "<JWT>" }
```

- Error: `401 Unauthorized` if credentials are invalid

---

### Profile

#### Get profile

- `GET /profile`
- Auth: required
- Response: `200 OK`

```json
{ "id": "user1", "role": "user", "created_at": "2026-01-01T12:00:00Z" }
```

---

### Tasks

All task endpoints are protected.

#### Create task

- `POST /tasks`
- Body:

```json
{ "title": "learn backend", "description": "practice APIs" }
```

- Response: `201 Created`

```json
{ "id": "task_123", "title": "learn backend", "status": "pending" }
```

---

#### Get tasks

- `GET /tasks`
- Users: returns only tasks owned by the user
- Admin: returns all tasks
- Response: `200 OK` — array of task objects

---

#### Update task

- `PUT /tasks/:id`
- Authorization: user must own the task or be admin
- Body: any of the updatable fields (`title`, `description`, `status`)
- Response: `200 OK` with updated task

---

#### Delete task

- `DELETE /tasks/:id`
- Authorization: user must own the task or be admin
- Response: `204 No Content` on success

---

### Admin APIs

#### Get all users

- `GET /users`
- Auth: admin only
- Response: `200 OK` — array of user summaries

---

#### Delete user

- `DELETE /users/:id`
- Auth: admin only
- Response: `204 No Content` on success

---

## Environment & configuration

The project reads runtime configuration from environment variables. A sample `.env.example` is included in the repository.

Minimum variables expected:

```
PORT=8000
JWT_SECRET=replace_with_a_secure_random_value
NODE_ENV=development
```

Load environment variables at process start (e.g. `dotenv` in `index.js`). Do not commit secrets.

---

## Local development

### Prerequisites

- Node.js LTS (18+ recommended)
- npm or yarn

### Getting started (development)

1. Clone the repository

```bash
git clone <repo-url>
cd backend-part
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` from `.env.example` and set `JWT_SECRET`.

4. Start the server (development)

```bash
npm start
# or
npm run dev    # when nodemon script exists
```

The server listens on `PORT` (default `8000`).

---

## Testing

Automated tests are implemented with Jest + Supertest. Tests run against an in-memory or test SQLite database to isolate side effects.

### Run tests

```bash
npm test
```

### Test coverage strategy

- Unit tests for utils and controllers when behavior can be exercised without a DB connection.
- Integration tests using Supertest for key endpoints (register, login, protected routes, task CRUD).
- Edge cases / validation failures are explicitly covered.

If tests fail due to environment, ensure `NODE_ENV=test` and no port collisions.

---

## Error handling & logging

- Controllers return consistent HTTP status codes and JSON error payloads.
- Validation errors: `400 Bad Request` with a body describing the issue.
- Authentication errors: `401 Unauthorized`.
- Forbidden operations: `403 Forbidden`.
- Not found: `404 Not Found`.
- Unexpected server errors: `500 Internal Server Error`.

A simple logger (console or a lightweight logger like `pino`) is appropriate for this scope; production systems should forward logs to a centralized system.

---

## Security considerations

- Passwords are hashed with `bcrypt` before storage — plaintext passwords are never persisted.
- JWT secret is required and must be treated as a secret (do not commit to source control).
- Protected endpoints validate the user's token and authority before performing operations.
- Inputs are validated to avoid unexpected keys or shapes — requests containing extra/unknown keys are rejected.

Additional hardening recommended for production:

- Enforce HTTPS
- Use secure cookie attributes if tokens are stored in cookies
- Add rate-limiting and request throttling
- Add input sanitization for fields persisted/returned

---

## Deployment & CI/CD

This project has a simple deployment surface. Typical pipeline steps:

1. Run tests (Jest)
2. Lint and format code (ESLint + Prettier)
3. Build (if applicable) and publish container image or Node bundle
4. Deploy to appropriate environment (Heroku, ECS, DigitalOcean App Platform, or any container host)

Environment-specific considerations:

- Use environment variables for secrets
- Use an appropriate DB in production (SQLite is not suitable for multi-instance deployments)

---

## Operational notes

- Database migrations: for small projects, TypeORM `synchronize` is convenient but avoid relying on it in production. Prefer explicit migrations for schema change management.
- Backups: regularly export the database when running in production.
- Monitor token expiry and rotate secrets if compromise is suspected.

---

## Future improvements (shortlist)

1. Add pagination and filtering to `GET /tasks`.
2. Introduce refresh-token flow.
3. Add structured logging and metrics (request latency, error rates).
4. Replace SQLite with a production-ready DB (Postgres) and add migrations.
5. Add API documentation generator (OpenAPI/Swagger) and integrate tests against the generated spec.

---

## Appendix: examples and useful commands

### Example `.env.example`

```
PORT=8000
JWT_SECRET=changemeplease
NODE_ENV=development
```

### Sample curl flows

**Register**

```bash
curl -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"id":"user1","password":"1234"}'
```

**Login**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"id":"user1","password":"1234"}'
```

**Create task (example)**

```bash
curl -X POST http://localhost:8000/tasks \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"title":"learn backend","description":"practice APIs"}'
```

---

## Contributing

- Keep changes modular and small.
- Add tests for new behaviors and edge cases.
- Follow the repository's linting and formatting rules.
- When changing a public API contract, update this README and the test suite.

---

## Contact / Maintainers

- Primary maintainer: repository owner (see `package.json` / repo metadata)
- For critical issues, open an issue and tag maintainers

---

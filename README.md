# Enterprise Node.js API

A highly scalable, production-ready REST API built with Node.js, Express, TypeScript, and Clean Architecture (Domain-Driven Design).

## Features

- **Architecture:** Clean Architecture + Layered Architecture (DDD)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod
- **Authentication:** JWT (Access & Refresh tokens), bcrypt
- **Logging:** Winston + Morgan
- **Security:** Helmet, CORS, Express Rate Limit
- **API Documentation:** Swagger / OpenAPI
- **Testing:** Jest + Supertest (Unit & Integration)
- **Code Quality:** ESLint, Prettier, Husky, lint-staged
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions ready

## Folder Structure

```text
src
├── config              # Environment, Swagger, etc.
├── infrastructure      # DB, Logger, External services
├── shared              # Cross-cutting concerns (Middleware, Exceptions, Utils)
├── modules             # Domain modules
│   └── user            # User Domain
│       ├── domain      # Entities, Interfaces
│       ├── application # Use Cases
│       ├── infrastructure # Repositories
│       ├── presentation# Controllers, Routes
│       ├── dto         # Data Transfer Objects
│       ├── mapper      # Object Mappers
│       └── validator   # Validation schemas
├── app.ts              # Express App setup
└── server.ts           # Server entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Copy `.env.example` to `.env` and fill in your configurations.
   ```bash
   cp .env.example .env
   ```

## Database Setup

This project uses Prisma and PostgreSQL.

1. Ensure PostgreSQL is running (or use Docker Compose).
2. Generate Prisma client and apply migrations:
   ```bash
   yarn prisma:generate
   yarn prisma:migrate
   ```

## Run

**Development:**
```bash
yarn dev
```

**Production:**
```bash
yarn build
yarn start
```

## Docker

Run the entire stack (API + PostgreSQL) via Docker Compose:

```bash
docker-compose up -d --build
```

## Testing

**Run all tests:**
```bash
yarn test
```

**Run tests with coverage:**
```bash
yarn test:coverage
```

## API Documentation

Swagger UI is available at `/api-docs` when the server is running.
Example: `http://localhost:3000/api-docs`

## Best Practices Followed

- SOLID Principles
- DRY and KISS
- Dependency Injection for loose coupling
- Separate responsibilities: Controller -> UseCase -> Repository
- Global error handling
- Predictable and uniform API responses
- Graceful shutdown

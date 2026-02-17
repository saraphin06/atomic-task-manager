# Task Manager

A full-stack Task Management application built with Spring Boot and React, demonstrating production-grade architecture, comprehensive testing, and clean code practices.

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up
```

This starts PostgreSQL, the backend (port 8080), and the frontend (port 3000).

### Option 2: Manual Setup

**Prerequisites:**
- Java 21+
- Node.js 20+
- PostgreSQL 16+ (or Docker for the database only)
- Gradle 9+

**Start the database:**
```bash
docker-compose up db
```

**Start the backend:**
```bash
cd backend
./gradlew bootRun
```

**Start the frontend:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
task-manager/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/taskmanager/
│   │   ├── config/             # CORS, JPA Auditing configuration
│   │   ├── controller/         # REST endpoints
│   │   ├── dto/                # Request/Response data transfer objects
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Custom exceptions + global handler
│   │   ├── mapper/             # Entity-DTO conversion
│   │   ├── repository/         # Spring Data JPA repositories + Specifications
│   │   └── service/            # Business logic
│   └── src/test/java/com/taskmanager/
│       ├── unit/               # Unit tests (Mockito)
│       └── integration/        # API tests (RestAssured)
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── api/                # Axios client + API functions
│   │   ├── components/         # Shared UI components
│   │   ├── features/tasks/     # Task feature module (components, hooks, types)
│   │   ├── pages/              # Route-level page components
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Utility functions
│   └── e2e/                    # Playwright E2E tests
├── docs/                       # Architecture decisions + strategy documents
└── docker-compose.yml          # Full-stack local development setup
```

This is a **monorepo** with clear separation between backend and frontend. The backend uses **layer-based packaging** (appropriate for a single entity). The frontend uses **feature-based modules** (grouping task-related code together).

## Backend

### Running

```bash
cd backend
./gradlew bootRun
```

The API starts on port 8080. Requires PostgreSQL (see Docker Compose).

### Testing

```bash
./gradlew test                                    # All tests
./gradlew test --tests "*.unit.*"                 # Unit tests only
./gradlew test --tests "*.integration.*"          # Integration tests only
```

Unit tests use Mockito for isolation. Integration tests use H2 in-memory database with RestAssured for full HTTP lifecycle testing.

### API Documentation (Swagger)

When the backend is running:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI spec**: http://localhost:8080/api/docs

## Frontend

### Running

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on port 3000 with a proxy to the backend.

### Testing

```bash
npm test                  # Unit tests (Vitest)
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
npm run test:e2e          # E2E tests (requires running backend)
```

## Testing Strategy


```
        /  E2E    \       ← 4 tests  (Playwright)
       /-----------\
      / Integration \     ← 10 tests (RestAssured)
     /---------------\
    /    Unit Tests   \   ← 25+ tests (JUnit/Mockito, Vitest/RTL)
   /-------------------\
```

- **Unit tests**: Fast, isolated, cover business logic, mappers, validation, UI components
- **Integration tests**: Full HTTP lifecycle with RestAssured against H2
- **E2E tests**: Critical user flows only (create, edit, toggle, delete)

## Deployment Strategy

### CI/CD Pipeline (GitHub Actions)
1. **Build**: Compile backend + frontend
2. **Test**: Run unit tests → integration tests → E2E tests (in pyramid order)
3. **Docker**: Build and push images to container registry
4. **Deploy**: Rolling deployment to staging → production

### Deployment Strategy
- **Blue-green** for zero-downtime deployments
- Health endpoints via Spring Actuator for readiness/liveness probes

### Monitoring & Logging
- **Structured logging**: SLF4J with JSON format for log aggregation (ELK, Datadog)
- **Health endpoints**: Spring Actuator `/actuator/health` for load balancer checks
- **Metrics**: Micrometer + Prometheus for JVM and application metrics
- **Distributed tracing**: OpenTelemetry for request tracing across services

## Assumptions
- Single-user application (no authentication required for MVP)
- No CI/CD pipeline implemented — documented as a deployment strategy

## AI usage
### Backend
- AI was used to generate the SpringDoc/OpenAPI integration, REST API test suite, CORS configuration, and JPA auditing setup.  Core business logic, entity design, service layer and unit tests are done manually.

### Frontend
- AI was used to generate tests, ete tests. Pages, components, form handling, and UX refinements are done manually with minimal AI assistance. 
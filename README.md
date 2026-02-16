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

This is a **monorepo** with clear separation between backend and frontend. The backend uses **layer-based packaging** (appropriate for a single entity). The frontend uses **feature-based modules** (grouping task-related code together). See [ADR-016](docs/DECISIONS.md) for rationale.

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

See [docs/API.md](docs/API.md) for detailed endpoint documentation.

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

## Architecture Decisions

All architectural decisions are documented in [docs/DECISIONS.md](docs/DECISIONS.md) using the ADR (Architecture Decision Record) format. Key decisions include:

- **ADR-001**: Spring Boot over Quarkus/Micronaut
- **ADR-003**: JPA/Hibernate over jOOQ/MyBatis
- **ADR-005**: Separate request/response DTOs
- **ADR-010**: React Query for server state management
- **ADR-013**: Test pyramid implementation strategy
- **ADR-018**: Lombok `@Getter/@Setter` on entities vs `@Data` on DTOs

## Testing Strategy

See [docs/TESTING-STRATEGY.md](docs/TESTING-STRATEGY.md) for the full testing strategy.

```
        /  E2E  \           ← 4 tests  (Playwright)
       /----------\
      / Integration \       ← 10 tests (RestAssured)
     /----------------\
    /    Unit Tests     \   ← 25+ tests (JUnit/Mockito, Vitest/RTL)
   /--------------------\
```

- **Unit tests**: Fast, isolated, cover business logic, mappers, validation, UI components
- **Integration tests**: Full HTTP lifecycle with RestAssured against H2
- **E2E tests**: Critical user flows only (create, edit, toggle, delete)

## Scalability Discussion

### Database
- **Indexing**: Add indexes on `is_completed`, `due_date`, and `created_at` for common filter/sort queries. Composite indexes for combined filter+sort patterns.
- **Connection pooling**: HikariCP (Spring Boot default) with tuned pool size based on workload (min 5, max 20 for typical usage).
- **Read replicas**: For read-heavy workloads, configure Spring's `@Transactional(readOnly = true)` to route to replicas.
- **Migration**: Flyway for versioned schema migrations in production (currently using `ddl-auto: update` for development).

### Application
- **Caching**: Add Redis caching for task list queries (`@Cacheable` on service methods). Cache invalidation on mutations.
- **Horizontal scaling**: Stateless backend enables running multiple instances behind a load balancer. Sticky sessions not required.
- **Rate limiting**: Spring Cloud Gateway or Bucket4j for API rate limiting per client.

### Frontend
- **CDN**: Serve static frontend assets from a CDN (CloudFront, Cloudflare) for global latency reduction.
- **Bundle splitting**: Vite's code splitting ensures users only download code for the current route.

## Security Considerations

- **Input validation**: Server-side validation via Bean Validation. Client-side validation is for UX only — never trusted.
- **SQL injection**: JPA parameterized queries prevent SQL injection by design. No raw SQL strings.
- **XSS prevention**: React's default JSX escaping prevents XSS. No `dangerouslySetInnerHTML` usage.
- **CORS**: Configured to allow only the frontend origin. Production should use environment-specific origins.
- **HTTPS**: Required in production. Backend should enforce HTTPS via Spring Security's `requiresSecure()`.
- **Authentication roadmap**: Spring Security + JWT tokens. Stateless auth fits the horizontal scaling model.
- **Rate limiting**: Prevent abuse via Bucket4j or API Gateway rate limiting.
- **Dependency scanning**: Regular `npm audit` and Gradle dependency vulnerability checks.

## Deployment Strategy

### CI/CD Pipeline (GitHub Actions)
1. **Build**: Compile backend + frontend
2. **Test**: Run unit tests → integration tests → E2E tests (in pyramid order)
3. **Docker**: Build and push images to container registry
4. **Deploy**: Rolling deployment to staging → production

### Container Orchestration
- **Docker** for local development and CI
- **Kubernetes** for production with:
  - HPA (Horizontal Pod Autoscaler) for the backend
  - PDB (Pod Disruption Budget) for availability
  - ConfigMaps/Secrets for environment configuration

### Environment Configuration
- Spring profiles (`dev`, `test`, `staging`, `prod`) for backend
- Environment variables for sensitive configuration (database credentials, API keys)
- No secrets in source code or Docker images

### Database Migrations
- Flyway for versioned, repeatable migrations
- Migrations run on application startup
- Backward-compatible migrations for zero-downtime deployments

### Deployment Strategy
- **Blue-green** for zero-downtime deployments
- **Rolling updates** in Kubernetes for gradual rollout
- Health endpoints via Spring Actuator for readiness/liveness probes

### Monitoring & Logging
- **Structured logging**: SLF4J with JSON format for log aggregation (ELK, Datadog)
- **Health endpoints**: Spring Actuator `/actuator/health` for load balancer checks
- **Metrics**: Micrometer + Prometheus for JVM and application metrics
- **Distributed tracing**: OpenTelemetry for request tracing across services

## Trade-offs & Assumptions

### Shortcuts Taken
- `ddl-auto: update` instead of Flyway migrations — acceptable for development, not production
- H2 for integration tests instead of Testcontainers — faster but less fidelity
- No authentication — the prompt focuses on task CRUD, auth would be the next feature
- Single browser (Chromium) for E2E tests — sufficient for this scope
- No CI/CD pipeline implemented — documented as a deployment strategy

### Assumptions
- Single-user application (no authentication required for MVP)
- Task volume is moderate (< 10,000 tasks) — pagination handles growth
- English-only (no i18n/l10n required)
- Modern browser support only (no IE11)

# RailWatch

RailWatch is a railway station congestion intelligence platform. It combines train, station, reservation, and congestion data to help passengers understand travel conditions and give railway teams a foundation for operational monitoring.

The current application provides a Spring Boot API and a React dashboard. The project is being developed toward a professional, software-only operations platform with SQL reporting, live data providers, incident workflows, and open-source analytics integrations.

## Current capabilities

- Search congestion by PNR
- Search stations and trains
- View station-level congestion
- View dashboard and historical station data
- Stream congestion updates with Server-Sent Events
- Run a local React/Vite dashboard
- Use Flyway migrations with MySQL
- Expose application health through Spring Boot Actuator
- Apply CORS, security headers, request correlation IDs, and validated API inputs

## Technology stack

### Current

- **Backend:** Java 17+, Spring Boot 4, Spring MVC, Spring Data JPA
- **Database:** MySQL
- **Migrations:** Flyway
- **Frontend:** React 19, Vite, Axios, Recharts
- **Testing:** JUnit, Spring Boot test support, H2
- **Build tools:** Maven Wrapper and npm

### Planned

- Role-based access for passengers, station staff, managers, and administrators
- External railway data provider adapters
- Historical SQL reporting views
- Metabase Community Edition and/or Grafana dashboards
- Explainable congestion forecasting
- Incident and notification workflows
- Containerized deployment and CI validation

## Architecture

```text
React/Vite dashboard
        |
        v
Spring Boot REST API
        |
        +--> MySQL + Flyway migrations
        |
        +--> Railway data providers
        |
        +--> Reporting and congestion services
```

The frontend uses relative `/api` URLs during development. Vite proxies those requests to the backend at `http://127.0.0.1:8080`.

## Prerequisites

- Java 17 or newer
- Node.js 18 or newer
- npm
- MySQL 8 or compatible MySQL server

The backend can run with the included Maven Wrapper, so a system Maven installation is not required.

## Configuration

The backend reads runtime configuration from environment variables. Defaults are suitable for local development when MySQL is available.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | Backend HTTP port |
| `DATABASE_URL` | `jdbc:mysql://localhost:3306/railway_congestion?createDatabaseIfNotExist=true&serverTimezone=UTC` | JDBC connection URL |
| `DATABASE_USERNAME` | `root` | Database username |
| `DATABASE_PASSWORD` | — | Database password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated frontend origins |
| `FLYWAY_ENABLED` | `true` | Enable database migrations |
| `DEMO_ENABLED` | `false` | Enable demo data behavior |
| `DEMO_INTERVAL_MS` | `15000` | Demo update interval |

Do not commit database passwords, API keys, or other secrets. Use environment variables or a local, untracked environment file.

## Run locally

### 1. Start MySQL

Create or use the `railway_congestion` database and provide credentials through environment variables when they differ from the defaults.

### 2. Start the backend

From the repository root:

```bash
bash mvnw spring-boot:run
```

The backend starts at [http://localhost:8080](http://localhost:8080).

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The dashboard starts at [http://localhost:5173](http://localhost:5173).

## Useful commands

Run backend tests:

```bash
bash mvnw test
```

Run frontend linting and the production build:

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

Check backend health:

```bash
curl http://localhost:8080/actuator/health
```

## API overview

The main API endpoints are:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/pnr/{pnr}` | Get congestion and train information for a PNR |
| `GET` | `/api/stations` | List available stations |
| `GET` | `/api/trains` | List available trains |
| `GET` | `/api/dashboard?date=YYYY-MM-DD` | Get dashboard metrics for a date |
| `GET` | `/api/stations/{stationId}/congestion?date=YYYY-MM-DD` | Get station congestion |
| `GET` | `/api/stations/{stationId}/history?from=YYYY-MM-DD&to=YYYY-MM-DD` | Get station history |
| `GET` | `/api/congestion/stream` | Stream congestion updates |
| `GET` | `/actuator/health` | Check application health |

The API returns JSON and includes an `X-Request-Id` response header for request tracing.

## Project structure

```text
.
├── frontend/                       # React/Vite dashboard
│   ├── src/components/             # Reusable UI components
│   ├── src/pages/                  # Application pages
│   └── src/services/               # Backend API clients
├── src/main/java/                  # Spring Boot application
│   └── com/example/railway_congestion/
│       ├── config/                 # CORS, security, scheduling, errors
│       ├── controller/             # REST endpoints
│       ├── dto/                    # API response models
│       ├── model/                  # JPA entities
│       ├── repository/             # Data access
│       └── service/                # Congestion business logic
├── src/main/resources/
│   └── db/migration/               # Flyway SQL migrations
├── src/test/                       # Backend tests
├── railway_congestion.sql          # Database reference/sample SQL
├── SETUP.md                        # Expanded local setup guide
└── pom.xml                         # Maven project configuration
```

## Product direction

RailWatch is intended to solve a practical operational problem: turning fragmented railway data into useful decisions.

Future versions will help answer:

- Which stations are currently crowded?
- When is congestion expected to peak?
- Which delays are likely to increase passenger volume?
- Which incidents require staff attention?
- Which travel alternatives may reduce congestion?

The planned free/open-source analytics stack is:

```text
MySQL or PostgreSQL
        +--> RailWatch API and React application
        +--> Metabase Community Edition for reporting
        +--> Grafana OSS for monitoring and alerts
```

## Development principles

- Keep operational data and reporting data clearly separated.
- Record data freshness and source for externally provided values.
- Validate all external input at the API boundary.
- Avoid storing secrets or unnecessary passenger-identifying data.
- Prefer small migrations and tested, reversible changes.
- Keep provider integrations behind interfaces so unavailable APIs do not break the application.

## Contributing

Create focused changes, run the relevant backend and frontend checks, and update documentation when behavior or setup changes. Commits for this repository should use the project contributor identity configured by the maintainer.

## License

No license has been declared yet. Add an explicit license before distributing RailWatch or accepting external contributions.

# Phase 0 baseline audit

## Current architecture

- **Backend:** Spring Boot 4, Java 17 target, Spring Data JPA, MySQL, Flyway, Actuator.
- **Frontend:** React 19, Vite, Axios, Recharts.
- **Current operational data:** `station`, `train`, and `reservation` tables.
- **Current dashboard APIs:** PNR lookup, station list, dashboard snapshot, station history, train list, SSE congestion stream.
- **Current live behavior:** the SSE stream is backed by the demo scheduler only when the `demo` profile and `DEMO_ENABLED=true` are enabled. It is not a provider feed.

## Baseline checks

| Check | Result |
|---|---|
| Frontend lint | Passed |
| Frontend production build | Passed |
| Backend test suite | Passed after hardening malformed-PNR routing and validation |

The original malformed-PNR fixture used an encoded space that MockMvc routed as an unmatched URL and therefore returned 404 before controller validation. The PNR route now accepts a non-empty path segment and explicitly validates the allowed character set, so malformed values return the intended stable 400 response.

## Schema reconciliation

`railway_congestion.sql` is a destructive development seed script: it drops the three prototype tables and inserts a larger sample dataset. Flyway `V1__baseline.sql` is non-destructive and inserts a smaller idempotent sample dataset. They are not equivalent production migrations and must not both be treated as the source of truth.

Phase 1 establishes Flyway as the upgrade path. The seed script remains useful for local fixture data, but production schema evolution must use versioned migrations.

## Decisions for Phase 1

- Preserve the existing reservation API and tables during migration.
- Use UTC for audit/import timestamps; retain a station timezone for display and date interpretation.
- Keep journey dates separate from observation timestamps.
- Preserve raw provider/source identity and import-run provenance.
- Make passenger counts non-negative and make repeated source records idempotent.
- Keep source/provider status as explicit data, not an inferred frontend label.

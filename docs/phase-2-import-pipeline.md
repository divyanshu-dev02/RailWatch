# Phase 2 import pipeline

## CSV contract

The first provider adapter accepts UTF-8 CSV with this exact header:

```csv
source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity
```

Example:

```csv
source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity
obs-1,1,2,2026-04-27,2026-04-27T06:00:00Z,420,800
```

`journey_date` is the service date. `observed_at` is an ISO-8601 UTC timestamp describing when the source measured or published the value. Passenger counts and capacities must be non-negative.

## API

Upload a CSV:

```bash
curl -X POST \
  -F "file=@observations.csv" \
  http://localhost:8080/api/imports/csv/rail-provider
```

The API returns an accepted import-run summary. Query the persisted run with:

```text
GET /api/imports/{importRunId}
```

## Processing behavior

- Every upload creates an `import_run` with provider, source type, timestamps, status, and row counters.
- Rows for unknown stations or trains, capacity violations, and other validation failures are rejected and counted.
- The uniqueness key `(provider_code, source_record_id, observed_at)` makes replaying the same source record a duplicate instead of creating another observation.
- Accepted rows are stored as immutable `passenger_observation` records linked to their import run.
- Malformed files fail the run with a bounded error message; they do not produce a successful empty import.

The current endpoint is intentionally provider-neutral and synchronous for the first implementation. Scheduling, retries, dead-letter storage, and external provider adapters are the next Phase 2/3 hardening steps.

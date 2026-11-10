# Phase 1 data foundation

## Core concepts

| Concept | Table | Purpose |
|---|---|---|
| Station master | `station` | Stable station identity, timezone, capacity, and active state |
| Train/service master | `train` | Service identity, station relationship, schedule, capacity, and active state |
| Legacy booking | `reservation` | Backward-compatible PNR and reservation records with provider provenance |
| Import execution | `import_run` | One provider/file/API ingestion attempt and its counts/status |
| Passenger observation | `passenger_observation` | Immutable time-stamped passenger/occupancy fact used for reporting and forecasting |

## Required invariants

- `provider_code` identifies the upstream system that supplied a record.
- `source_record_id` identifies the record in that upstream system.
- `import_run_id` links an observation to the import that processed it.
- `journey_date` describes the service/travel date; `observed_at` describes when the provider measured or published the value.
- Passenger counts and capacities cannot be negative.
- The observation uniqueness key `(provider_code, source_record_id, observed_at)` supports safe replay of the same input.
- Import row counts are never negative and failures retain an error message.

## Migration policy

`V2__operational_data_foundation.sql` extends the V1 schema without deleting existing data. Existing records are marked with the `legacy` provider code and receive database-managed audit timestamps. New ingestion code should write observations and import runs first; reservation compatibility writes should be retained only while existing consumers depend on them.

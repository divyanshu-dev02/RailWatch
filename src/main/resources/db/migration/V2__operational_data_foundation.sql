ALTER TABLE station
    ADD COLUMN station_code VARCHAR(32) NULL,
    ADD COLUMN timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    ADD COLUMN passenger_capacity INT NULL,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX uk_station_code ON station (station_code);

ALTER TABLE train
    ADD COLUMN service_code VARCHAR(32) NULL,
    ADD COLUMN arrival_time VARCHAR(10) NULL,
    ADD COLUMN passenger_capacity INT NULL,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX uk_train_service_code ON train (service_code);

ALTER TABLE reservation
    ADD COLUMN provider_code VARCHAR(64) NOT NULL DEFAULT 'legacy',
    ADD COLUMN source_record_id VARCHAR(128) NULL,
    ADD COLUMN source_updated_at TIMESTAMP NULL,
    ADD COLUMN imported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE INDEX idx_reservation_provider_source ON reservation (provider_code, source_record_id);
CREATE INDEX idx_reservation_status_date ON reservation (status, journey_date);

CREATE TABLE import_run (
    import_run_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provider_code VARCHAR(64) NOT NULL,
    source_type VARCHAR(24) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,
    source_observed_at TIMESTAMP NULL,
    status VARCHAR(24) NOT NULL,
    rows_received INT NOT NULL DEFAULT 0,
    rows_accepted INT NOT NULL DEFAULT 0,
    rows_rejected INT NOT NULL DEFAULT 0,
    rows_duplicate INT NOT NULL DEFAULT 0,
    error_message VARCHAR(1000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_import_run_counts CHECK (
        rows_received >= 0 AND rows_accepted >= 0 AND rows_rejected >= 0 AND rows_duplicate >= 0
    ),
    INDEX idx_import_run_provider_started (provider_code, started_at),
    INDEX idx_import_run_status (status)
);

CREATE TABLE passenger_observation (
    observation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    train_id INT NULL,
    journey_date DATE NOT NULL,
    observed_at TIMESTAMP NOT NULL,
    passenger_count INT NOT NULL,
    passenger_capacity INT NULL,
    provider_code VARCHAR(64) NOT NULL,
    source_record_id VARCHAR(128) NOT NULL,
    import_run_id BIGINT NOT NULL,
    quality_status VARCHAR(24) NOT NULL DEFAULT 'VALID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_observation_station FOREIGN KEY (station_id) REFERENCES station(station_id),
    CONSTRAINT fk_observation_train FOREIGN KEY (train_id) REFERENCES train(train_id),
    CONSTRAINT fk_observation_import_run FOREIGN KEY (import_run_id) REFERENCES import_run(import_run_id),
    CONSTRAINT chk_observation_passengers CHECK (passenger_count >= 0),
    CONSTRAINT chk_observation_capacity CHECK (passenger_capacity IS NULL OR passenger_capacity >= 0),
    UNIQUE KEY uk_observation_source (provider_code, source_record_id, observed_at),
    INDEX idx_observation_station_date (station_id, journey_date, observed_at),
    INDEX idx_observation_provider_time (provider_code, observed_at),
    INDEX idx_observation_import_run (import_run_id)
);

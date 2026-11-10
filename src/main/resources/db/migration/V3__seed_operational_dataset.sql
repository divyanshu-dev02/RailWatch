-- Seed a realistic operational dataset for local development and demonstrations.
-- The migration is intentionally deterministic and runs once through Flyway.

UPDATE station
SET station_code = CASE station_name
        WHEN 'New Delhi Railway Station' THEN 'NDLS'
        WHEN 'Mumbai Central' THEN 'BCT'
        WHEN 'Chennai Central' THEN 'MAS'
        ELSE station_code
    END,
    timezone = CASE station_name
        WHEN 'New Delhi Railway Station' THEN 'Asia/Kolkata'
        WHEN 'Mumbai Central' THEN 'Asia/Kolkata'
        WHEN 'Chennai Central' THEN 'Asia/Kolkata'
        ELSE timezone
    END,
    passenger_capacity = CASE station_name
        WHEN 'New Delhi Railway Station' THEN 18000
        WHEN 'Mumbai Central' THEN 15000
        WHEN 'Chennai Central' THEN 14000
        ELSE passenger_capacity
    END
WHERE station_name IN (
    'New Delhi Railway Station',
    'Mumbai Central',
    'Chennai Central'
);

INSERT IGNORE INTO station (
    station_name,
    city,
    station_code,
    timezone,
    passenger_capacity,
    active
) VALUES
    ('Howrah Junction', 'Kolkata', 'HWH', 'Asia/Kolkata', 17000, TRUE),
    ('KSR Bengaluru City', 'Bengaluru', 'SBC', 'Asia/Kolkata', 16000, TRUE),
    ('Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'CSMT', 'Asia/Kolkata', 19000, TRUE),
    ('Lucknow Charbagh', 'Lucknow', 'LKO', 'Asia/Kolkata', 12000, TRUE),
    ('Jaipur Junction', 'Jaipur', 'JP', 'Asia/Kolkata', 11000, TRUE),
    ('Ajmer Junction', 'Ajmer', 'AII', 'Asia/Kolkata', 8500, TRUE),
    ('Patna Junction', 'Patna', 'PNBE', 'Asia/Kolkata', 13000, TRUE),
    ('Bhubaneswar', 'Bhubaneswar', 'BBS', 'Asia/Kolkata', 10000, TRUE),
    ('Secunderabad Junction', 'Hyderabad', 'SC', 'Asia/Kolkata', 15000, TRUE),
    ('Pune Junction', 'Pune', 'PUNE', 'Asia/Kolkata', 14000, TRUE),
    ('Ahmedabad Junction', 'Ahmedabad', 'ADI', 'Asia/Kolkata', 15000, TRUE),
    ('Kolkata Terminal', 'Kolkata', 'KOAA', 'Asia/Kolkata', 9000, TRUE);

UPDATE train
SET service_code = CASE train_name
        WHEN 'Rajdhani Express' THEN 'NDLS-RJ'
        WHEN 'Mumbai Rajdhani' THEN 'BCT-RJ'
        WHEN 'Chennai Express' THEN 'MAS-EXP'
        ELSE service_code
    END,
    arrival_time = CASE train_name
        WHEN 'Rajdhani Express' THEN '18:00'
        WHEN 'Mumbai Rajdhani' THEN '19:00'
        WHEN 'Chennai Express' THEN '17:30'
        ELSE arrival_time
    END,
    passenger_capacity = CASE train_name
        WHEN 'Rajdhani Express' THEN 1200
        WHEN 'Mumbai Rajdhani' THEN 1100
        WHEN 'Chennai Express' THEN 950
        ELSE passenger_capacity
    END
WHERE train_name IN (
    'Rajdhani Express',
    'Mumbai Rajdhani',
    'Chennai Express'
);

-- Add three repeatable service patterns for every monitored station.
INSERT INTO train (
    train_name,
    station_id,
    departure_time,
    platform,
    service_code,
    arrival_time,
    passenger_capacity,
    active
)
SELECT CONCAT(s.city, ' Intercity'),
       s.station_id,
       '06:30',
       MOD(s.station_id, 4) + 1,
       CONCAT(s.station_code, '-IC'),
       '13:30',
       700 + MOD(s.station_id * 37, 300),
       TRUE
FROM station s
WHERE NOT EXISTS (
    SELECT 1
    FROM train t
    WHERE t.service_code = CONCAT(s.station_code, '-IC')
)
UNION ALL
SELECT CONCAT(s.city, ' Superfast'),
       s.station_id,
       '10:00',
       MOD(s.station_id + 1, 4) + 1,
       CONCAT(s.station_code, '-SF'),
       '17:00',
       850 + MOD(s.station_id * 29, 350),
       TRUE
FROM station s
WHERE NOT EXISTS (
    SELECT 1
    FROM train t
    WHERE t.service_code = CONCAT(s.station_code, '-SF')
)
UNION ALL
SELECT CONCAT(s.city, ' Night Express'),
       s.station_id,
       '20:30',
       MOD(s.station_id + 2, 4) + 1,
       CONCAT(s.station_code, '-NX'),
       '06:30',
       900 + MOD(s.station_id * 23, 300),
       TRUE
FROM station s
WHERE NOT EXISTS (
    SELECT 1
    FROM train t
    WHERE t.service_code = CONCAT(s.station_code, '-NX')
);

INSERT INTO import_run (
    provider_code,
    source_type,
    started_at,
    completed_at,
    source_observed_at,
    status,
    rows_received,
    rows_accepted,
    rows_rejected,
    rows_duplicate
) VALUES (
    'railwatch-seed',
    'SEED',
    UTC_TIMESTAMP(),
    UTC_TIMESTAMP(),
    UTC_TIMESTAMP(),
    'RUNNING',
    0,
    0,
    0,
    0
);

SET @seed_import_run_id = LAST_INSERT_ID();

-- Four observations per train per day for the last 30 days.
INSERT INTO passenger_observation (
    station_id,
    train_id,
    journey_date,
    observed_at,
    passenger_count,
    passenger_capacity,
    provider_code,
    source_record_id,
    import_run_id,
    quality_status
)
WITH RECURSIVE seed_days AS (
    SELECT CURRENT_DATE - INTERVAL 29 DAY AS journey_day, 0 AS day_offset
    UNION ALL
    SELECT journey_day + INTERVAL 1 DAY, day_offset + 1
    FROM seed_days
    WHERE journey_day < CURRENT_DATE
),
observation_slots AS (
    SELECT 1 AS slot_number, '06:00:00' AS observation_time
    UNION ALL SELECT 2, '10:00:00'
    UNION ALL SELECT 3, '14:00:00'
    UNION ALL SELECT 4, '18:00:00'
)
SELECT t.station_id,
       t.train_id,
       d.journey_day,
       TIMESTAMP(d.journey_day, o.observation_time),
       LEAST(
           t.passenger_capacity,
           FLOOR(
               t.passenger_capacity * (
                   0.35
                   + MOD(t.train_id + d.day_offset * 7 + o.slot_number * 13, 55) / 100
               )
           )
       ),
       t.passenger_capacity,
       'railwatch-seed',
       CONCAT(
           'seed-observation-',
           t.service_code,
           '-',
           DATE_FORMAT(d.journey_day, '%Y%m%d'),
           '-',
           o.slot_number
       ),
       @seed_import_run_id,
       'VALID'
FROM train t
CROSS JOIN seed_days d
CROSS JOIN observation_slots o
WHERE t.active = TRUE
  AND t.passenger_capacity IS NOT NULL;

SET @seed_observation_count = ROW_COUNT();

-- Four reservations per train per day, linked to the same current service set.
INSERT INTO reservation (
    pnr_number,
    train_id,
    journey_date,
    reserved_passengers,
    provider_code,
    source_record_id,
    source_updated_at,
    status
)
WITH RECURSIVE reservation_days AS (
    SELECT CURRENT_DATE - INTERVAL 29 DAY AS journey_day, 0 AS day_offset
    UNION ALL
    SELECT journey_day + INTERVAL 1 DAY, day_offset + 1
    FROM reservation_days
    WHERE journey_day < CURRENT_DATE
),
reservation_slots AS (
    SELECT 1 AS slot_number
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
)
SELECT CONCAT(
           'RW',
           DATE_FORMAT(d.journey_day, '%y%m%d'),
           LPAD(t.train_id, 4, '0'),
           LPAD(r.slot_number, 2, '0')
       ),
       t.train_id,
       DATE_FORMAT(d.journey_day, '%Y-%m-%d'),
       LEAST(
           t.passenger_capacity,
           35 + MOD(t.train_id * 17 + d.day_offset * 11 + r.slot_number * 23, 180)
       ),
       'railwatch-seed',
       CONCAT(
           'seed-reservation-',
           t.service_code,
           '-',
           DATE_FORMAT(d.journey_day, '%Y%m%d'),
           '-',
           r.slot_number
       ),
       UTC_TIMESTAMP(),
       'ACTIVE'
FROM train t
CROSS JOIN reservation_days d
CROSS JOIN reservation_slots r
WHERE t.active = TRUE
  AND t.passenger_capacity IS NOT NULL;

UPDATE import_run
SET status = 'COMPLETED',
    completed_at = UTC_TIMESTAMP(),
    rows_received = @seed_observation_count,
    rows_accepted = @seed_observation_count
WHERE import_run_id = @seed_import_run_id;

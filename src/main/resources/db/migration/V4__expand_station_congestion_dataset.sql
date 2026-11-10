-- Expand the development network with additional stations and high-utilization
-- services. This migration is deterministic and safe to apply once through Flyway.

INSERT IGNORE INTO station (
    station_name,
    city,
    station_code,
    timezone,
    passenger_capacity,
    active
) VALUES
    ('Kanpur Central', 'Kanpur', 'CNB', 'Asia/Kolkata', 12500, TRUE),
    ('Vadodara Junction', 'Vadodara', 'BRC', 'Asia/Kolkata', 10500, TRUE),
    ('Surat Railway Station', 'Surat', 'ST', 'Asia/Kolkata', 11500, TRUE),
    ('Nagpur Central', 'Nagpur', 'NGP', 'Asia/Kolkata', 13000, TRUE),
    ('Bhopal Junction', 'Bhopal', 'BPL', 'Asia/Kolkata', 10500, TRUE),
    ('Indore Junction', 'Indore', 'INDB', 'Asia/Kolkata', 9500, TRUE),
    ('Coimbatore Junction', 'Coimbatore', 'CBE', 'Asia/Kolkata', 9000, TRUE),
    ('Visakhapatnam', 'Visakhapatnam', 'VSKP', 'Asia/Kolkata', 10500, TRUE),
    ('Vijayawada Junction', 'Vijayawada', 'BZA', 'Asia/Kolkata', 11500, TRUE),
    ('Guwahati', 'Guwahati', 'GHY', 'Asia/Kolkata', 8500, TRUE),
    ('Ranchi Junction', 'Ranchi', 'RNC', 'Asia/Kolkata', 8500, TRUE),
    ('Dehradun', 'Dehradun', 'DDN', 'Asia/Kolkata', 7000, TRUE),
    ('Amritsar Junction', 'Amritsar', 'ASR', 'Asia/Kolkata', 9000, TRUE),
    ('Thiruvananthapuram Central', 'Thiruvananthapuram', 'TVC', 'Asia/Kolkata', 9500, TRUE),
    ('Mysuru Junction', 'Mysuru', 'MYS', 'Asia/Kolkata', 7500, TRUE);

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
SELECT CONCAT(s.city, ' Peak Express'),
       s.station_id,
       '07:15',
       MOD(s.station_id, 5) + 1,
       CONCAT(s.station_code, '-PX'),
       '15:15',
       850 + MOD(s.station_id * 31, 250),
       TRUE
FROM station s
WHERE s.station_code IN (
    'CNB', 'BRC', 'ST', 'NGP', 'BPL', 'INDB', 'CBE', 'VSKP',
    'BZA', 'GHY', 'RNC', 'DDN', 'ASR', 'TVC', 'MYS'
)
  AND NOT EXISTS (
      SELECT 1 FROM train t WHERE t.service_code = CONCAT(s.station_code, '-PX')
  )
UNION ALL
SELECT CONCAT(s.city, ' Regional'),
       s.station_id,
       '12:45',
       MOD(s.station_id + 1, 5) + 1,
       CONCAT(s.station_code, '-RG'),
       '20:45',
       700 + MOD(s.station_id * 19, 250),
       TRUE
FROM station s
WHERE s.station_code IN (
    'CNB', 'BRC', 'ST', 'NGP', 'BPL', 'INDB', 'CBE', 'VSKP',
    'BZA', 'GHY', 'RNC', 'DDN', 'ASR', 'TVC', 'MYS'
)
  AND NOT EXISTS (
      SELECT 1 FROM train t WHERE t.service_code = CONCAT(s.station_code, '-RG')
  )
UNION ALL
SELECT CONCAT(s.city, ' Night Link'),
       s.station_id,
       '21:00',
       MOD(s.station_id + 2, 5) + 1,
       CONCAT(s.station_code, '-NL'),
       '05:30',
       900 + MOD(s.station_id * 13, 250),
       TRUE
FROM station s
WHERE s.station_code IN (
    'CNB', 'BRC', 'ST', 'NGP', 'BPL', 'INDB', 'CBE', 'VSKP',
    'BZA', 'GHY', 'RNC', 'DDN', 'ASR', 'TVC', 'MYS'
)
  AND NOT EXISTS (
      SELECT 1 FROM train t WHERE t.service_code = CONCAT(s.station_code, '-NL')
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
    'railwatch-congestion-seed',
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

SET @congestion_seed_import_run_id = LAST_INSERT_ID();

-- Four observations per service per day for the last 30 days. The utilization
-- range is intentionally high (65%-99%) to exercise dashboard alert states.
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
                   0.65
                   + MOD(t.train_id * 3 + d.day_offset * 11 + o.slot_number * 17, 35) / 100
               )
           )
       ),
       t.passenger_capacity,
       'railwatch-congestion-seed',
       CONCAT(
           'congestion-observation-',
           t.service_code,
           '-',
           DATE_FORMAT(d.journey_day, '%Y%m%d'),
           '-',
           o.slot_number
       ),
       @congestion_seed_import_run_id,
       'VALID'
FROM train t
CROSS JOIN seed_days d
CROSS JOIN observation_slots o
WHERE t.service_code LIKE 'CNB-%'
   OR t.service_code LIKE 'BRC-%'
   OR t.service_code LIKE 'ST-%'
   OR t.service_code LIKE 'NGP-%'
   OR t.service_code LIKE 'BPL-%'
   OR t.service_code LIKE 'INDB-%'
   OR t.service_code LIKE 'CBE-%'
   OR t.service_code LIKE 'VSKP-%'
   OR t.service_code LIKE 'BZA-%'
   OR t.service_code LIKE 'GHY-%'
   OR t.service_code LIKE 'RNC-%'
   OR t.service_code LIKE 'DDN-%'
   OR t.service_code LIKE 'ASR-%'
   OR t.service_code LIKE 'TVC-%'
   OR t.service_code LIKE 'MYS-%';

SET @congestion_observation_count = ROW_COUNT();

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
           'RC',
           DATE_FORMAT(d.journey_day, '%y%m%d'),
           LPAD(t.train_id, 4, '0'),
           LPAD(r.slot_number, 2, '0')
       ),
       t.train_id,
       DATE_FORMAT(d.journey_day, '%Y-%m-%d'),
       LEAST(
           t.passenger_capacity,
           150 + MOD(t.train_id * 29 + d.day_offset * 13 + r.slot_number * 31, 260)
       ),
       'railwatch-congestion-seed',
       CONCAT(
           'congestion-reservation-',
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
WHERE t.service_code LIKE 'CNB-%'
   OR t.service_code LIKE 'BRC-%'
   OR t.service_code LIKE 'ST-%'
   OR t.service_code LIKE 'NGP-%'
   OR t.service_code LIKE 'BPL-%'
   OR t.service_code LIKE 'INDB-%'
   OR t.service_code LIKE 'CBE-%'
   OR t.service_code LIKE 'VSKP-%'
   OR t.service_code LIKE 'BZA-%'
   OR t.service_code LIKE 'GHY-%'
   OR t.service_code LIKE 'RNC-%'
   OR t.service_code LIKE 'DDN-%'
   OR t.service_code LIKE 'ASR-%'
   OR t.service_code LIKE 'TVC-%'
   OR t.service_code LIKE 'MYS-%';

UPDATE import_run
SET status = 'COMPLETED',
    completed_at = UTC_TIMESTAMP(),
    rows_received = @congestion_observation_count,
    rows_accepted = @congestion_observation_count
WHERE import_run_id = @congestion_seed_import_run_id;

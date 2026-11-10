INSERT INTO station (
    station_name, city, station_code, timezone, passenger_capacity, active,
    created_at, updated_at
) VALUES
    ('New Delhi Railway Station', 'New Delhi', 'NDLS', 'Asia/Kolkata', 18000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mumbai Central', 'Mumbai', 'BCT', 'Asia/Kolkata', 15000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Chennai Central', 'Chennai', 'MAS', 'Asia/Kolkata', 14000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Howrah Junction', 'Kolkata', 'HWH', 'Asia/Kolkata', 17000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('KSR Bengaluru City', 'Bengaluru', 'SBC', 'Asia/Kolkata', 16000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'CSMT', 'Asia/Kolkata', 19000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lucknow Charbagh', 'Lucknow', 'LKO', 'Asia/Kolkata', 12000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Jaipur Junction', 'Jaipur', 'JP', 'Asia/Kolkata', 11000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Ajmer Junction', 'Ajmer', 'AII', 'Asia/Kolkata', 8500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Patna Junction', 'Patna', 'PNBE', 'Asia/Kolkata', 13000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bhubaneswar', 'Bhubaneswar', 'BBS', 'Asia/Kolkata', 10000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Secunderabad Junction', 'Hyderabad', 'SC', 'Asia/Kolkata', 15000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Pune Junction', 'Pune', 'PUNE', 'Asia/Kolkata', 14000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Ahmedabad Junction', 'Ahmedabad', 'ADI', 'Asia/Kolkata', 15000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Kolkata Terminal', 'Kolkata', 'KOAA', 'Asia/Kolkata', 9000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Kanpur Central', 'Kanpur', 'CNB', 'Asia/Kolkata', 12500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Vadodara Junction', 'Vadodara', 'BRC', 'Asia/Kolkata', 10500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Surat Railway Station', 'Surat', 'ST', 'Asia/Kolkata', 11500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Nagpur Central', 'Nagpur', 'NGP', 'Asia/Kolkata', 13000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bhopal Junction', 'Bhopal', 'BPL', 'Asia/Kolkata', 10500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Indore Junction', 'Indore', 'INDB', 'Asia/Kolkata', 9500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Coimbatore Junction', 'Coimbatore', 'CBE', 'Asia/Kolkata', 9000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Visakhapatnam', 'Visakhapatnam', 'VSKP', 'Asia/Kolkata', 10500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Vijayawada Junction', 'Vijayawada', 'BZA', 'Asia/Kolkata', 11500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Guwahati', 'Guwahati', 'GHY', 'Asia/Kolkata', 8500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Ranchi Junction', 'Ranchi', 'RNC', 'Asia/Kolkata', 8500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Dehradun', 'Dehradun', 'DDN', 'Asia/Kolkata', 7000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Amritsar Junction', 'Amritsar', 'ASR', 'Asia/Kolkata', 9000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Thiruvananthapuram Central', 'Thiruvananthapuram', 'TVC', 'Asia/Kolkata', 9500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mysuru Junction', 'Mysuru', 'MYS', 'Asia/Kolkata', 7500, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO train (
    train_name, station_id, departure_time, platform, service_code,
    arrival_time, passenger_capacity, active, created_at, updated_at
)
SELECT CONCAT(s.city, ' Peak Express'), s.station_id, '07:15',
       MOD(s.station_id, 5) + 1, CONCAT(s.station_code, '-PX'),
       '15:15', 850 + MOD(s.station_id * 31, 250), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM station s
UNION ALL
SELECT CONCAT(s.city, ' Regional'), s.station_id, '12:45',
       MOD(s.station_id + 1, 5) + 1, CONCAT(s.station_code, '-RG'),
       '20:45', 700 + MOD(s.station_id * 19, 250), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM station s
UNION ALL
SELECT CONCAT(s.city, ' Night Link'), s.station_id, '21:00',
       MOD(s.station_id + 2, 5) + 1, CONCAT(s.station_code, '-NL'),
       '05:30', 900 + MOD(s.station_id * 13, 250), TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM station s;

INSERT INTO reservation (
    pnr_number, train_id, journey_date, reserved_passengers,
    provider_code, source_record_id, source_updated_at, imported_at,
    status, created_at, updated_at
)
SELECT CONCAT(
           'LOCAL',
           LPAD(CAST(days.x AS VARCHAR), 2, '0'),
           LPAD(CAST(t.train_id AS VARCHAR), 4, '0'),
           LPAD(CAST(slots.x AS VARCHAR), 2, '0')
       ),
       t.train_id,
       FORMATDATETIME(DATEADD('DAY', -days.x, CURRENT_DATE), 'yyyy-MM-dd'),
       CASE
           WHEN t.service_code LIKE '%-PX' THEN
               580 + MOD(t.train_id * 17 + days.x * 11 + slots.x * 23, 260)
           WHEN t.service_code LIKE '%-RG' THEN
               260 + MOD(t.train_id * 13 + days.x * 7 + slots.x * 19, 180)
           ELSE
               420 + MOD(t.train_id * 11 + days.x * 5 + slots.x * 29, 240)
       END,
       'railwatch-local',
       CONCAT('local-reservation-', t.service_code, '-', days.x, '-', slots.x),
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP,
       'ACTIVE',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM train t
CROSS JOIN SYSTEM_RANGE(0, 29) days
CROSS JOIN SYSTEM_RANGE(1, 4) slots;

CREATE TABLE IF NOT EXISTS station (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS train (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(150) NOT NULL,
    station_id INT NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    platform INT NOT NULL,
    CONSTRAINT fk_train_station FOREIGN KEY (station_id) REFERENCES station(station_id)
);

CREATE TABLE IF NOT EXISTS reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number VARCHAR(20) NOT NULL UNIQUE,
    train_id INT NOT NULL,
    journey_date VARCHAR(15) NOT NULL,
    reserved_passengers INT NOT NULL,
    CONSTRAINT fk_reservation_train FOREIGN KEY (train_id) REFERENCES train(train_id)
);

CREATE INDEX idx_train_station ON train(station_id);
CREATE INDEX idx_reservation_train_date ON reservation(train_id, journey_date);
CREATE INDEX idx_reservation_journey_date ON reservation(journey_date);

INSERT INTO station (station_name, city)
SELECT 'New Delhi Railway Station', 'New Delhi' WHERE NOT EXISTS (SELECT 1 FROM station);
INSERT INTO station (station_name, city)
SELECT 'Mumbai Central', 'Mumbai' WHERE NOT EXISTS (SELECT 1 FROM station WHERE station_name = 'Mumbai Central');
INSERT INTO station (station_name, city)
SELECT 'Chennai Central', 'Chennai' WHERE NOT EXISTS (SELECT 1 FROM station WHERE station_name = 'Chennai Central');

INSERT INTO train (train_name, station_id, departure_time, platform)
SELECT 'Rajdhani Express', station_id, '06:00', 1 FROM station WHERE station_name = 'New Delhi Railway Station'
AND NOT EXISTS (SELECT 1 FROM train);
INSERT INTO train (train_name, station_id, departure_time, platform)
SELECT 'Mumbai Rajdhani', station_id, '07:00', 2 FROM station WHERE station_name = 'Mumbai Central'
AND NOT EXISTS (SELECT 1 FROM train WHERE train_name = 'Mumbai Rajdhani');
INSERT INTO train (train_name, station_id, departure_time, platform)
SELECT 'Chennai Express', station_id, '05:30', 1 FROM station WHERE station_name = 'Chennai Central'
AND NOT EXISTS (SELECT 1 FROM train WHERE train_name = 'Chennai Express');

INSERT INTO reservation (pnr_number, train_id, journey_date, reserved_passengers)
SELECT '12345678', train_id, '2026-04-27', 800 FROM train WHERE train_name = 'Rajdhani Express'
AND NOT EXISTS (SELECT 1 FROM reservation WHERE pnr_number = '12345678');
INSERT INTO reservation (pnr_number, train_id, journey_date, reserved_passengers)
SELECT '22345678', train_id, '2026-04-27', 400 FROM train WHERE train_name = 'Mumbai Rajdhani'
AND NOT EXISTS (SELECT 1 FROM reservation WHERE pnr_number = '22345678');
INSERT INTO reservation (pnr_number, train_id, journey_date, reserved_passengers)
SELECT '32345678', train_id, '2026-04-27', 150 FROM train WHERE train_name = 'Chennai Express'
AND NOT EXISTS (SELECT 1 FROM reservation WHERE pnr_number = '32345678');

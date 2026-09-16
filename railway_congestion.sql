-- =====================================================
-- Smart Railway Station Congestion Monitoring System
-- Database: railway_congestion
-- =====================================================

CREATE DATABASE IF NOT EXISTS railway_congestion;
USE railway_congestion;

-- =====================================================
-- Table: station
-- =====================================================
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS train;
DROP TABLE IF EXISTS station;

CREATE TABLE station (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL
);

-- =====================================================
-- Table: train
-- =====================================================
CREATE TABLE train (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(150) NOT NULL,
    station_id INT NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    platform INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES station(station_id)
);

-- =====================================================
-- Table: reservation
-- =====================================================
CREATE TABLE reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number VARCHAR(20) NOT NULL UNIQUE,
    train_id INT NOT NULL,
    journey_date VARCHAR(15) NOT NULL,
    reserved_passengers INT NOT NULL,
    FOREIGN KEY (train_id) REFERENCES train(train_id)
);

-- =====================================================
-- Sample Data: Stations (10 major Indian railway stations)
-- =====================================================
INSERT INTO station (station_name, city) VALUES
('New Delhi Railway Station', 'New Delhi'),
('Mumbai Central', 'Mumbai'),
('Chennai Central', 'Chennai'),
('Howrah Junction', 'Kolkata'),
('Bangalore City Junction', 'Bangalore'),
('Ahmedabad Junction', 'Ahmedabad'),
('Jaipur Junction', 'Jaipur'),
('Lucknow Charbagh', 'Lucknow'),
('Hyderabad Deccan', 'Hyderabad'),
('Pune Junction', 'Pune');

-- =====================================================
-- Sample Data: Trains (15 trains)
-- =====================================================
INSERT INTO train (train_name, station_id, departure_time, platform) VALUES
('Rajdhani Express', 1, '06:00', 1),
('Shatabdi Express', 1, '08:30', 3),
('Duronto Express', 1, '14:00', 5),
('Mumbai Rajdhani', 2, '07:00', 2),
('Deccan Queen', 2, '10:15', 4),
('Chennai Express', 3, '05:30', 1),
('Coromandel Express', 3, '09:00', 3),
('Howrah Mail', 4, '11:00', 6),
('Gitanjali Express', 4, '16:30', 2),
('Bangalore Rajdhani', 5, '06:45', 1),
('Mysore Express', 5, '13:00', 4),
('Ahmedabad Mail', 6, '07:30', 2),
('Jaipur Superfast', 7, '08:00', 1),
('Lucknow Mail', 8, '22:00', 3),
('Hyderabad Express', 9, '10:30', 5);

-- =====================================================
-- Sample Data: Reservations (25+ entries with varied congestion)
-- =====================================================
INSERT INTO reservation (pnr_number, train_id, journey_date, reserved_passengers) VALUES
-- New Delhi (station_id=1) - HIGH congestion on 2026-04-27
('12345678', 1, '2026-04-27', 800),
('12345679', 2, '2026-04-27', 600),
('12345680', 3, '2026-04-27', 450),
('12345681', 1, '2026-04-28', 200),
('12345682', 2, '2026-04-28', 150),

-- Mumbai (station_id=2) - MEDIUM congestion on 2026-04-27
('22345678', 4, '2026-04-27', 400),
('22345679', 5, '2026-04-27', 350),
('22345680', 4, '2026-04-28', 100),

-- Chennai (station_id=3) - LOW congestion on 2026-04-27
('32345678', 6, '2026-04-27', 150),
('32345679', 7, '2026-04-27', 200),
('32345680', 6, '2026-04-28', 50),

-- Kolkata (station_id=4) - HIGH congestion on 2026-04-27
('42345678', 8, '2026-04-27', 900),
('42345679', 9, '2026-04-27', 700),

-- Bangalore (station_id=5) - MEDIUM congestion on 2026-04-27
('52345678', 10, '2026-04-27', 500),
('52345679', 11, '2026-04-27', 300),

-- Ahmedabad (station_id=6) - LOW congestion
('62345678', 12, '2026-04-27', 120),

-- Jaipur (station_id=7) - LOW congestion
('72345678', 13, '2026-04-27', 200),

-- Lucknow (station_id=8) - MEDIUM congestion
('82345678', 14, '2026-04-27', 650),

-- Hyderabad (station_id=9) - LOW congestion
('92345678', 15, '2026-04-27', 180),

-- Extra entries for trends
('12345690', 1, '2026-04-29', 300),
('12345691', 2, '2026-04-29', 250),
('22345690', 4, '2026-04-29', 500),
('42345690', 8, '2026-04-29', 400),
('52345690', 10, '2026-04-29', 200),
('32345690', 6, '2026-04-29', 100);

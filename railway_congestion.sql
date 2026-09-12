-- =====================================================
-- RailWatch: Smart Railway Station Congestion Monitoring System
-- Database: railway_congestion (MySQL 8.x)
-- =====================================================

CREATE DATABASE IF NOT EXISTS railway_congestion;
USE railway_congestion;

DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS train;
DROP TABLE IF EXISTS station;

-- =====================================================
-- Table: station
-- =====================================================
CREATE TABLE station (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_code VARCHAR(10) NOT NULL UNIQUE,
    station_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zone VARCHAR(50),
    latitude DOUBLE,
    longitude DOUBLE,
    total_platforms INT DEFAULT 10,
    daily_capacity INT DEFAULT 300000,
    INDEX idx_station_code (station_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Table: train
-- =====================================================
CREATE TABLE train (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10),
    train_name VARCHAR(150) NOT NULL,
    train_type VARCHAR(30) DEFAULT 'SUPERFAST',
    station_id INT NOT NULL,
    departure_time VARCHAR(10) NOT NULL,
    arrival_time VARCHAR(10),
    platform INT NOT NULL,
    total_capacity INT DEFAULT 1200,
    source_station VARCHAR(50),
    destination_station VARCHAR(50),
    FOREIGN KEY (station_id) REFERENCES station(station_id) ON DELETE CASCADE,
    INDEX idx_train_station_dep (station_id, departure_time),
    INDEX idx_train_station_plat (station_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Table: reservation
-- =====================================================
CREATE TABLE reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number VARCHAR(20) NOT NULL UNIQUE,
    train_id INT NOT NULL,
    journey_date VARCHAR(15) NOT NULL,
    reserved_passengers INT NOT NULL,
    coach_type VARCHAR(10) DEFAULT 'CC',
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED',
    FOREIGN KEY (train_id) REFERENCES train(train_id) ON DELETE CASCADE,
    INDEX idx_res_pnr (pnr_number),
    INDEX idx_res_train_date (train_id, journey_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Seed: Stations (10 Major Indian Railway Junctions)
-- =====================================================
INSERT INTO station (station_id, station_code, station_name, city, zone, latitude, longitude, total_platforms, daily_capacity) VALUES
(1, 'NDLS', 'New Delhi Railway Station', 'New Delhi', 'NR - Northern Railway', 28.6431, 77.2197, 16, 500000),
(2, 'BCT', 'Mumbai Central', 'Mumbai', 'WR - Western Railway', 18.9696, 72.8193, 7, 350000),
(3, 'MAS', 'Chennai Central', 'Chennai', 'SR - Southern Railway', 13.0827, 80.2755, 12, 400000),
(4, 'HWH', 'Howrah Junction', 'Kolkata', 'ER - Eastern Railway', 22.5839, 88.3426, 23, 1000000),
(5, 'SBC', 'KSR Bengaluru City', 'Bengaluru', 'SWR - South Western Railway', 12.9784, 77.5695, 10, 300000),
(6, 'ADI', 'Ahmedabad Junction', 'Ahmedabad', 'WR - Western Railway', 23.0270, 72.6012, 12, 280000),
(7, 'JP', 'Jaipur Junction', 'Jaipur', 'NWR - North Western Railway', 26.9208, 75.7873, 8, 220000),
(8, 'LKO', 'Lucknow Charbagh', 'Lucknow', 'NR - Northern Railway', 26.8311, 80.9234, 9, 260000),
(9, 'HYB', 'Hyderabad Deccan Nampally', 'Hyderabad', 'SCR - South Central Railway', 17.3917, 78.4682, 6, 200000),
(10, 'PUNE', 'Pune Junction', 'Pune', 'CR - Central Railway', 18.5284, 73.8739, 6, 250000);

-- =====================================================
-- Seed: Trains (21 Express Trains)
-- =====================================================
INSERT INTO train (train_id, train_number, train_name, train_type, station_id, departure_time, arrival_time, platform, total_capacity, source_station, destination_station) VALUES
(1, '12002', 'Bhopal Shatabdi Express', 'SHATABDI', 1, '06:00', '05:30', 1, 1100, 'NDLS', 'RKMP'),
(2, '22436', 'Vande Bharat Express', 'VANDE_BHARAT', 1, '06:30', '06:00', 3, 1128, 'NDLS', 'BSB'),
(3, '12952', 'Mumbai Rajdhani Express', 'RAJDHANI', 1, '16:55', '16:15', 2, 1200, 'NDLS', 'MMCT'),
(4, '12260', 'Sealdah Duronto Express', 'DURONTO', 1, '19:45', '19:00', 5, 1250, 'NDLS', 'SDAH'),
(5, '12951', 'August Kranti Rajdhani', 'RAJDHANI', 2, '17:40', '17:00', 2, 1200, 'MMCT', 'NDLS'),
(6, '12124', 'Deccan Queen Superfast', 'SUPERFAST', 2, '17:10', '16:30', 4, 950, 'CSMT', 'PUNE'),
(7, '20901', 'Gandhinagar Capital Vande Bharat', 'VANDE_BHARAT', 2, '06:00', '05:25', 1, 1128, 'MMCT', 'GNC'),
(8, '12622', 'Tamil Nadu Superfast Express', 'SUPERFAST', 3, '22:00', '21:15', 1, 1400, 'MAS', 'NDLS'),
(9, '12842', 'Coromandel Express', 'SUPERFAST', 3, '07:00', '06:15', 3, 1350, 'MAS', 'HWH'),
(10, '12301', 'Howrah Rajdhani Express', 'RAJDHANI', 4, '16:50', '16:00', 9, 1200, 'HWH', 'NDLS'),
(11, '12860', 'Gitanjali Superfast Express', 'SUPERFAST', 4, '13:50', '13:00', 21, 1450, 'HWH', 'CSMT'),
(12, '12839', 'Howrah Mail', 'MAIL_EXPRESS', 4, '23:45', '22:50', 17, 1300, 'HWH', 'MAS'),
(13, '20608', 'Mysuru Vande Bharat Express', 'VANDE_BHARAT', 5, '14:50', '14:15', 1, 1128, 'MAS', 'MYS'),
(14, '12658', 'Chennai Mail', 'MAIL_EXPRESS', 5, '22:40', '21:50', 4, 1200, 'SBC', 'MAS'),
(15, '12932', 'Ahmedabad Double Decker', 'SUPERFAST', 6, '06:00', '05:30', 2, 1500, 'ADI', 'MMCT'),
(16, '12986', 'Delhi Sarai Rohilla AC Double Decker', 'SUPERFAST', 7, '06:00', '05:20', 1, 1400, 'JP', 'DEE'),
(17, '12230', 'Lucknow Mail', 'SUPERFAST', 8, '22:00', '21:10', 3, 1300, 'LJN', 'NDLS'),
(18, '12723', 'Telangana Express', 'SUPERFAST', 9, '06:00', '05:15', 5, 1350, 'HYB', 'NDLS'),
(19, '12157', 'Hutatma Express', 'SUPERFAST', 10, '17:55', '17:15', 3, 1100, 'PUNE', 'SUR'),
(20, '12004', 'Lucknow Swarna Shatabdi', 'SHATABDI', 1, '06:10', '05:40', 3, 1150, 'NDLS', 'LKO'),
(21, '14041', 'Mussoorie Express', 'MAIL_EXPRESS', 1, '22:25', '21:40', 7, 1000, 'DLI', 'DDN');

-- =====================================================
-- Seed: Reservations (35 entries across Low, Med, High, and Critical Congestion)
-- =====================================================
INSERT INTO reservation (pnr_number, train_id, journey_date, reserved_passengers, coach_type, booking_status) VALUES
-- New Delhi (station_id=1) - Acute HIGH & Peak Bottleneck on 2026-04-27
('2458963214', 1, '2026-04-27', 850, 'CC', 'CONFIRMED'),
('2458963215', 2, '2026-04-27', 920, 'CC', 'CONFIRMED'),
('2458963216', 20, '2026-04-27', 780, 'EC', 'CONFIRMED'),
('2458963217', 3, '2026-04-27', 650, '2A', 'CONFIRMED'),
('2458963218', 4, '2026-04-27', 520, '3A', 'RAC'),
('12345678', 1, '2026-04-27', 800, 'CC', 'CONFIRMED'),
('12345679', 2, '2026-04-27', 600, 'CC', 'CONFIRMED'),
('12345680', 4, '2026-04-27', 450, 'SL', 'WAITLIST'),

-- Mumbai Central (station_id=2) - MEDIUM Congestion
('22345678', 5, '2026-04-27', 420, '2A', 'CONFIRMED'),
('22345679', 6, '2026-04-27', 380, 'CC', 'CONFIRMED'),
('8451239874', 7, '2026-04-27', 350, 'EC', 'CONFIRMED'),

-- Chennai Central (station_id=3) - LOW Congestion
('32345678', 8, '2026-04-27', 160, '3A', 'CONFIRMED'),
('32345679', 9, '2026-04-27', 190, 'SL', 'RAC'),

-- Howrah Junction (station_id=4) - HIGH Congestion
('42345678', 10, '2026-04-27', 950, '1A', 'CONFIRMED'),
('42345679', 11, '2026-04-27', 820, 'SL', 'CONFIRMED'),
('9876543210', 12, '2026-04-27', 670, '3A', 'CONFIRMED'),

-- Bangalore City (station_id=5) - MEDIUM Congestion
('52345678', 13, '2026-04-27', 490, 'CC', 'CONFIRMED'),
('52345679', 14, '2026-04-27', 310, 'SL', 'CONFIRMED'),

-- Ahmedabad (station_id=6) - LOW Congestion
('62345678', 15, '2026-04-27', 140, 'CC', 'CONFIRMED'),

-- Jaipur (station_id=7) - LOW Congestion
('72345678', 16, '2026-04-27', 210, 'CC', 'CONFIRMED'),

-- Lucknow (station_id=8) - MEDIUM Congestion
('82345678', 17, '2026-04-27', 680, 'SL', 'CONFIRMED'),

-- Hyderabad (station_id=9) - LOW Congestion
('92345678', 18, '2026-04-27', 190, '3A', 'CONFIRMED'),

-- Pune (station_id=10) - MEDIUM Congestion
('10234567', 19, '2026-04-27', 540, 'CC', 'CONFIRMED'),

-- Subsequent Dates (2026-04-28 Post-Rush Normalization)
('12345681', 1, '2026-04-28', 220, 'CC', 'CONFIRMED'),
('12345682', 2, '2026-04-28', 170, 'CC', 'CONFIRMED'),
('22345680', 5, '2026-04-28', 110, '2A', 'CONFIRMED'),
('32345680', 8, '2026-04-28', 70, '3A', 'CONFIRMED'),
('42345680', 10, '2026-04-28', 380, '1A', 'CONFIRMED'),

-- Weekend Dates (2026-04-29)
('12345690', 1, '2026-04-29', 310, 'CC', 'CONFIRMED'),
('12345691', 2, '2026-04-29', 260, 'CC', 'CONFIRMED'),
('22345690', 5, '2026-04-29', 520, '2A', 'CONFIRMED'),
('42345690', 10, '2026-04-29', 410, '1A', 'CONFIRMED'),
('52345690', 13, '2026-04-29', 220, 'CC', 'CONFIRMED'),
('32345690', 8, '2026-04-29', 110, '3A', 'CONFIRMED'),
('7412589630', 20, '2026-04-29', 450, 'EC', 'CONFIRMED');

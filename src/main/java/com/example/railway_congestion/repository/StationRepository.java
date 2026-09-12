package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.railway_congestion.model.Station;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Integer> {
    Optional<Station> findByStationCodeIgnoreCase(String stationCode);
}
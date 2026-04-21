package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.railway_congestion.model.Station;

public interface StationRepository extends JpaRepository<Station, Integer> {

}
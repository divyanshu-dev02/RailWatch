package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.railway_congestion.model.Train;

import java.util.List;




public interface TrainRepository extends JpaRepository<Train, Integer> {
    List<Train> findByStationId(int stationId);
}
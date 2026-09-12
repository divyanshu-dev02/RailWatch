package com.example.railway_congestion.controller;

import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class StationController {

    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;

    public StationController(StationRepository stationRepository, TrainRepository trainRepository) {
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
    }

    @GetMapping("/stations")
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    @GetMapping("/stations/{id}")
    public ResponseEntity<Station> getStationById(@PathVariable int id) {
        return stationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stations/code/{code}")
    public ResponseEntity<Station> getStationByCode(@PathVariable String code) {
        return stationRepository.findByStationCodeIgnoreCase(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stations/{id}/trains")
    public List<Train> getStationTrains(@PathVariable int id) {
        return trainRepository.findByStationIdOrderByDepartureTimeAsc(id);
    }
}
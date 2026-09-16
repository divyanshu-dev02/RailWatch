package com.example.railway_congestion.controller;

import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.repository.StationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class StationController {

    private final StationRepository stationRepository;

    public StationController(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @GetMapping({"/stations", "/api/stations"})
    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }
}

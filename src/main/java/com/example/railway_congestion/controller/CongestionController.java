package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.CongestionResponse;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.TrainRepository;
import com.example.railway_congestion.service.CongestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class CongestionController {

    private final CongestionService congestionService;
    private final TrainRepository trainRepository;

    public CongestionController(CongestionService congestionService,
                                TrainRepository trainRepository) {
        this.congestionService = congestionService;
        this.trainRepository = trainRepository;
    }

    /**
     * GET /pnr/{pnr}
     * Search congestion by PNR number
     */
    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<?> getStatusByPnr(@PathVariable String pnr) {
        CongestionResponse response = congestionService.getStatusByPnr(pnr);
        if (response == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "PNR not found", "pnr", pnr));
        }
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/congestion?stationId=1&date=2026-04-27
     * Get congestion for a station on a specific date
     */
    @GetMapping("/api/congestion")
    public ResponseEntity<?> getCongestionByStationAndDate(
            @RequestParam int stationId,
            @RequestParam String date) {
        CongestionResponse response = congestionService.getCongestionByStationAndDate(stationId, date);
        if (response == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Station not found", "stationId", stationId));
        }
        return ResponseEntity.ok(response);
    }

    /**
     * GET /trains
     * Get all trains
     */
    @GetMapping("/trains")
    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }
}
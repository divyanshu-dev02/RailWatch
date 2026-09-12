package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.DelaySimulationRequest;
import com.example.railway_congestion.dto.DelaySimulationResponse;
import com.example.railway_congestion.service.DelaySimulatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/simulator")
public class SimulatorController {

    private final DelaySimulatorService delaySimulatorService;

    public SimulatorController(DelaySimulatorService delaySimulatorService) {
        this.delaySimulatorService = delaySimulatorService;
    }

    /**
     * POST /api/simulator/delay
     * Accepts trainId, delayMinutes, and optional journeyDate
     */
    @PostMapping("/delay")
    public ResponseEntity<?> simulateDelayPost(@RequestBody DelaySimulationRequest request) {
        DelaySimulationResponse response = delaySimulatorService.simulateDelay(request);
        if (response == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Train not found for simulation", "trainId", request.getTrainId()));
        }
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/simulator/delay?trainId=1&delayMinutes=30&date=2026-04-27
     * Convenient GET endpoint for quick testing and query-based requests
     */
    @GetMapping("/delay")
    public ResponseEntity<?> simulateDelayGet(
            @RequestParam int trainId,
            @RequestParam(defaultValue = "30") int delayMinutes,
            @RequestParam(required = false, defaultValue = "2026-04-27") String date) {
        DelaySimulationRequest request = DelaySimulationRequest.builder()
                .trainId(trainId)
                .delayMinutes(delayMinutes)
                .journeyDate(date)
                .build();
        DelaySimulationResponse response = delaySimulatorService.simulateDelay(request);
        if (response == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Train not found for simulation", "trainId", trainId));
        }
        return ResponseEntity.ok(response);
    }
}

package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.ApiError;
import com.example.railway_congestion.dto.CongestionResponse;
import com.example.railway_congestion.dto.DashboardResponse;
import com.example.railway_congestion.dto.StationSnapshot;
import com.example.railway_congestion.dto.TrendPoint;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.TrainRepository;
import com.example.railway_congestion.service.CongestionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CongestionController {
    private final CongestionService service;
    private final TrainRepository trainRepository;

    public CongestionController(CongestionService service, TrainRepository trainRepository) {
        this.service = service;
        this.trainRepository = trainRepository;
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<?> getStatusByPnr(@PathVariable String pnr) {
        CongestionResponse response = service.getStatusByPnr(pnr.trim());
        return response == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@RequestParam(defaultValue = "2026-04-27") String date) {
        if (!validDate(date)) return ResponseEntity.badRequest().body(ApiError.of("INVALID_DATE", "Use YYYY-MM-DD format.", 400));
        return ResponseEntity.ok(service.getDashboard(date));
    }

    @GetMapping("/stations/{stationId}/congestion")
    public ResponseEntity<?> stationCongestion(@PathVariable int stationId,
                                                @RequestParam String date) {
        if (!validDate(date)) return ResponseEntity.badRequest().body(ApiError.of("INVALID_DATE", "Use YYYY-MM-DD format.", 400));
        StationSnapshot response = service.getStationCongestion(stationId, date);
        return response == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(response);
    }

    @GetMapping("/stations/{stationId}/history")
    public ResponseEntity<?> stationHistory(@PathVariable int stationId,
                                            @RequestParam String from,
                                            @RequestParam String to) {
        if (!validDate(from) || !validDate(to)) return ResponseEntity.badRequest().body(ApiError.of("INVALID_DATE", "Use YYYY-MM-DD format.", 400));
        List<TrendPoint> response = service.getStationHistory(stationId, from, to);
        return response == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(response);
    }

    @GetMapping(value = "/congestion/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() { return service.subscribe(); }

    @GetMapping("/trains")
    public List<Train> trains() { return trainRepository.findAll(); }

    private boolean validDate(String date) {
        try { LocalDate.parse(date); return true; }
        catch (DateTimeParseException | NullPointerException exception) { return false; }
    }
}

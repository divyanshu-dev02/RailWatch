package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.CongestionResponse;
import com.example.railway_congestion.service.CongestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class LegacyController {
    private final CongestionService service;

    public LegacyController(CongestionService service) { this.service = service; }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<CongestionResponse> pnr(@PathVariable String pnr) {
        CongestionResponse response = service.getStatusByPnr(pnr.trim());
        return response == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(response);
    }
}

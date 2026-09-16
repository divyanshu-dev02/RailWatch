package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.StationSnapshot;
import com.example.railway_congestion.service.CongestionService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
@Profile("demo")
public class DemoController {
    private final CongestionService service;

    public DemoController(CongestionService service) { this.service = service; }

    @PostMapping("/tick")
    public StationSnapshot tick() { return service.demoTick("2026-04-27"); }
}

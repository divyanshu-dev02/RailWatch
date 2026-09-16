package com.example.railway_congestion.config;

import com.example.railway_congestion.service.CongestionService;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Profile("demo")
public class DemoScheduler {
    private final CongestionService service;

    public DemoScheduler(CongestionService service) { this.service = service; }

    @Scheduled(fixedRateString = "${railwatch.demo.interval-ms:15000}")
    public void publishDemoUpdate() { service.demoTick("2026-04-27"); }
}

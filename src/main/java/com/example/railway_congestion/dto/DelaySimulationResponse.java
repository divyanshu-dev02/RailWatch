package com.example.railway_congestion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DelaySimulationResponse {
    private int trainId;
    private String trainNumber;
    private String trainName;
    private int stationId;
    private String stationName;
    private String originalDeparture;
    private String simulatedDeparture;
    private int delayMinutes;

    private String originalCongestionLevel;
    private String simulatedCongestionLevel;

    private int originalWindowPassengers;
    private int simulatedWindowPassengers;
    private int passengerDelta;

    private boolean platformCollision;
    private int collidingPlatform;
    private List<String> collidingTrains;

    private boolean stampedeRiskEscalation;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL_STAMPEDE_RISK
    private String narrative;
    private String mitigationRecommendation;

    private List<PlatformLoadDto> simulatedPlatformLoads;
}

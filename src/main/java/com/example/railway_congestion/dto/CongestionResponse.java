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
public class CongestionResponse {

    private String congestionLevel;    // LOW, MEDIUM, HIGH, CRITICAL_STAMPEDE_RISK
    private int totalPassengers;
    private String stationName;
    private String stationCode;
    private String city;
    private String zone;
    private Double latitude;
    private Double longitude;
    private Integer totalPlatforms;

    private String trainNumber;
    private String trainName;
    private String trainType;
    private String departureTime;
    private String arrivalTime;
    private int platform;
    private String sourceStation;
    private String destinationStation;

    private String pnr;
    private String journeyDate;
    private String coachType;
    private String bookingStatus;
    private int reservedPassengers;

    private int stationId;
    private int trainId;

    // Advanced Engine Components
    private TimeWindowAnalysis timeWindowAnalysis;
    private List<PlatformLoadDto> platformLoads;
    private TravelAdvisoryDto travelAdvisory;
    private List<HourlyTimelineDto> timeline;
}


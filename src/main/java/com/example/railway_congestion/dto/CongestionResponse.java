package com.example.railway_congestion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CongestionResponse {

    private String congestionLevel;    // LOW, MEDIUM, HIGH
    private int totalPassengers;
    private String stationName;
    private String city;
    private String trainName;
    private String departureTime;
    private int platform;
    private String pnr;
    private String journeyDate;
    private int stationId;
    private int trainId;
}

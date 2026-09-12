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
public class TravelAdvisoryDto {
    private String recommendedArrivalTime;
    private int bufferMinutesBeforeDeparture;
    private String optimalEntryGate;
    private String recommendedFob;
    private String concourseGuidance;
    private String baggageGuidance;
    private String safetyAdvisory;
    private List<String> alternativeTrains;
}

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
public class PlatformLoadDto {
    private int platformNumber;
    private List<String> assignedTrains;
    private int platformPassengerVolume;
    private int platformCapacity;
    private int densityPercentage;
    private String loadStatus; // OPTIMAL, MODERATE, CROWDED, CRITICAL_STAMPEDE_RISK
    private boolean stampedeHazard;
    private String hazardWarning;
}

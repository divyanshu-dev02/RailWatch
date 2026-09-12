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
public class HourlyTimelineDto {
    private String timeSlot;
    private int passengerCount;
    private int trainCount;
    private List<String> trainNames;
    private boolean isPeakSlot;
}

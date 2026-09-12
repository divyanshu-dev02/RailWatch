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
public class TimeWindowAnalysis {
    private String windowStart;
    private String windowEnd;
    private int windowDurationMinutes;
    private int concurrentTrainsCount;
    private List<String> concurrentTrainNames;
    private int windowPassengerVolume;
    private boolean acuteBottleneck;
    private String bottleneckSeverity; // LOW, MODERATE, SEVERE, CRITICAL
    private double concourseCongestionFactor;
    private String acuteReason;
}

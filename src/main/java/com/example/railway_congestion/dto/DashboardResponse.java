package com.example.railway_congestion.dto;

import java.util.List;

public record DashboardResponse(
        String date,
        int totalPassengers,
        int lowStations,
        int mediumStations,
        int highStations,
        List<StationSnapshot> stations,
        List<TrendPoint> trend,
        String lastUpdated
) {
}

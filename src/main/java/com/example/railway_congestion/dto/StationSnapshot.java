package com.example.railway_congestion.dto;

public record StationSnapshot(
        int stationId,
        String stationName,
        String city,
        int totalPassengers,
        String congestionLevel,
        String journeyDate,
        String eventTimestamp
) {
}

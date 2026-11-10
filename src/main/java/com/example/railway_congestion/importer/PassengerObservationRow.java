package com.example.railway_congestion.importer;

import java.time.Instant;
import java.time.LocalDate;

public record PassengerObservationRow(
        String sourceRecordId,
        int stationId,
        Integer trainId,
        LocalDate journeyDate,
        Instant observedAt,
        int passengerCount,
        Integer passengerCapacity
) {
}

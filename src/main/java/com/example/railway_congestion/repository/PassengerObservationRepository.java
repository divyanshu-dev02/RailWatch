package com.example.railway_congestion.repository;

import com.example.railway_congestion.model.PassengerObservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerObservationRepository extends JpaRepository<PassengerObservation, Long> {
    boolean existsByProviderCodeAndSourceRecordIdAndObservedAt(
            String providerCode, String sourceRecordId, java.time.Instant observedAt);
}

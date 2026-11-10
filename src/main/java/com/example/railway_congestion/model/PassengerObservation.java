package com.example.railway_congestion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "passenger_observation", indexes = {
        @Index(name = "idx_observation_station_date", columnList = "station_id,journey_date,observed_at"),
        @Index(name = "idx_observation_provider_time", columnList = "provider_code,observed_at"),
        @Index(name = "idx_observation_import_run", columnList = "import_run_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_observation_source", columnNames = {"provider_code", "source_record_id", "observed_at"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerObservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "observation_id")
    private long observationId;

    @Column(name = "station_id", nullable = false, insertable = false, updatable = false)
    private int stationId;

    @Column(name = "train_id", insertable = false, updatable = false)
    private Integer trainId;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Column(name = "observed_at", nullable = false)
    private Instant observedAt;

    @Column(name = "passenger_count", nullable = false)
    private int passengerCount;

    @Column(name = "passenger_capacity")
    private Integer passengerCapacity;

    @Column(name = "provider_code", nullable = false, length = 64)
    private String providerCode;

    @Column(name = "source_record_id", nullable = false, length = 128)
    private String sourceRecordId;

    @Column(name = "import_run_id", nullable = false, insertable = false, updatable = false)
    private long importRunId;

    @Column(name = "quality_status", nullable = false, length = 24)
    private String qualityStatus;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id")
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_run_id", nullable = false)
    private ImportRun importRun;
}

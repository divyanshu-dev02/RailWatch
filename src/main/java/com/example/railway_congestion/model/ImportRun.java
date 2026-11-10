package com.example.railway_congestion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "import_run", indexes = {
        @Index(name = "idx_import_run_provider_started", columnList = "provider_code,started_at"),
        @Index(name = "idx_import_run_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRun {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "import_run_id")
    private long importRunId;

    @Column(name = "provider_code", nullable = false, length = 64)
    private String providerCode;

    @Column(name = "source_type", nullable = false, length = 24)
    private String sourceType;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "source_observed_at")
    private Instant sourceObservedAt;

    @Column(nullable = false, length = 24)
    private String status;

    @Column(name = "rows_received", nullable = false)
    private int rowsReceived;

    @Column(name = "rows_accepted", nullable = false)
    private int rowsAccepted;

    @Column(name = "rows_rejected", nullable = false)
    private int rowsRejected;

    @Column(name = "rows_duplicate", nullable = false)
    private int rowsDuplicate;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;
}

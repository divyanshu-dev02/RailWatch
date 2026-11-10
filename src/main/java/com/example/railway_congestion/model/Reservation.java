package com.example.railway_congestion.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private int reservationId;

    @Column(name = "pnr_number")
    private String pnrNumber;

    @Column(name = "train_id", insertable = false, updatable = false)
    private int trainId;

    @Column(name = "journey_date")
    private String journeyDate;

    @Column(name = "reserved_passengers")
    private int reservedPassengers;

    @Column(name = "provider_code", nullable = false, length = 64)
    private String providerCode = "legacy";

    @Column(name = "source_record_id", length = 128)
    private String sourceRecordId;

    @Column(name = "source_updated_at")
    private java.time.Instant sourceUpdatedAt;

    @Column(name = "imported_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant importedAt;

    @Column(nullable = false, length = 24)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "train_id")
    @JsonIgnore
    private Train train;
}
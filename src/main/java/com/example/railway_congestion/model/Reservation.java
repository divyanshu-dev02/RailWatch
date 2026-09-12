package com.example.railway_congestion.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation", indexes = {
    @Index(name = "idx_res_pnr", columnList = "pnr_number", unique = true),
    @Index(name = "idx_res_train_date", columnList = "train_id, journey_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private int reservationId;

    @Column(name = "pnr_number", length = 20, nullable = false, unique = true)
    private String pnrNumber;

    @Column(name = "train_id", nullable = false)
    private int trainId;

    @Column(name = "journey_date", length = 15, nullable = false)
    private String journeyDate;

    @Column(name = "reserved_passengers", nullable = false)
    private int reservedPassengers;

    @Column(name = "coach_type", length = 10)
    private String coachType; // 1A, 2A, 3A, SL, CC, 2S

    @Column(name = "booking_status", length = 20)
    private String bookingStatus; // CONFIRMED, RAC, WAITLIST

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "train_id", insertable = false, updatable = false)
    private Train train;
}
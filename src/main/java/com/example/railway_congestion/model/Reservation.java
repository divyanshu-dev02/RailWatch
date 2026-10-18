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

    @ManyToOne
    @JoinColumn(name = "train_id")
    @JsonIgnore
    private Train train;
}
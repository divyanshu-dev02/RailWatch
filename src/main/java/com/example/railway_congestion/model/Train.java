package com.example.railway_congestion.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "train")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "train_id")
    private int trainId;

    @Column(name = "train_name")
    private String trainName;

    @Column(name = "station_id")
    private int stationId;

    @Column(name = "departure_time")
    private String departureTime;

    private int platform;

    @Column(name = "service_code", length = 32, unique = true)
    private String serviceCode;

    @Column(name = "arrival_time", length = 10)
    private String arrivalTime;

    @Column(name = "passenger_capacity")
    private Integer passengerCapacity;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "station_id", insertable = false, updatable = false)
    @JsonIgnore
    private Station station;
}
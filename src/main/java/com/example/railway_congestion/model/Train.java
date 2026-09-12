package com.example.railway_congestion.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "train", indexes = {
    @Index(name = "idx_train_station_dep", columnList = "station_id, departure_time"),
    @Index(name = "idx_train_station_plat", columnList = "station_id, platform")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "train_id")
    private int trainId;

    @Column(name = "train_number", length = 10)
    private String trainNumber;

    @Column(name = "train_name", nullable = false)
    private String trainName;

    @Column(name = "train_type", length = 30)
    private String trainType; // VANDE_BHARAT, RAJDHANI, SHATABDI, SUPERFAST, EXPRESS

    @Column(name = "station_id", nullable = false)
    private int stationId;

    @Column(name = "departure_time", length = 10, nullable = false)
    private String departureTime;

    @Column(name = "arrival_time", length = 10)
    private String arrivalTime;

    @Column(nullable = false)
    private int platform;

    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @Column(name = "source_station")
    private String sourceStation;

    @Column(name = "destination_station")
    private String destinationStation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "station_id", insertable = false, updatable = false)
    private Station station;
}
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

    @ManyToOne
    @JoinColumn(name = "station_id", insertable = false, updatable = false)
    @JsonIgnore
    private Station station;
}
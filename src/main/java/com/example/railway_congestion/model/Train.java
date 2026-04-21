package com.example.railway_congestion.model;

import jakarta.persistence.*;



@Entity
@Table(name = "train")
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

    public int getTrainId() {
        return trainId;
    }

    public int getStationId() {
        return stationId;
    }
}
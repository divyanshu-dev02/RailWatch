package com.example.railway_congestion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "station")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private int stationId;

    @Column(name = "station_name")
    private String stationName;

    private String city;

    @Column(name = "station_code", length = 32, unique = true)
    private String stationCode;

    @Column(nullable = false, length = 64)
    private String timezone = "UTC";

    @Column(name = "passenger_capacity")
    private Integer passengerCapacity;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
    private java.time.Instant updatedAt;

    public Station(int stationId, String stationName, String city) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.city = city;
    }
}

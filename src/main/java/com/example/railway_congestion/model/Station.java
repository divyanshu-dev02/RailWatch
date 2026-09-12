package com.example.railway_congestion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "station", indexes = {
    @Index(name = "idx_station_code", columnList = "station_code")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private int stationId;

    @Column(name = "station_code", length = 10, nullable = false)
    private String stationCode;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Column(nullable = false)
    private String city;

    @Column(length = 50)
    private String zone;

    private Double latitude;
    private Double longitude;

    @Column(name = "total_platforms")
    private Integer totalPlatforms;

    @Column(name = "daily_capacity")
    private Integer dailyCapacity;
}

package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.*;
import com.example.railway_congestion.model.Reservation;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CongestionService {

    private final ReservationRepository reservationRepository;
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final CongestionEngine congestionEngine;
    private final TravelAdvisoryService travelAdvisoryService;

    public CongestionService(ReservationRepository reservationRepository,
                             TrainRepository trainRepository,
                             StationRepository stationRepository,
                             CongestionEngine congestionEngine,
                             TravelAdvisoryService travelAdvisoryService) {
        this.reservationRepository = reservationRepository;
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
        this.congestionEngine = congestionEngine;
        this.travelAdvisoryService = travelAdvisoryService;
    }

    /**
     * Look up congestion by PNR number.
     * Finds the reservation, then calculates station-level congestion, 45-min rolling window, platform loads, and travel advisory.
     */
    public CongestionResponse getStatusByPnr(String pnr) {
        Reservation reservation = reservationRepository.findByPnrNumber(pnr);
        if (reservation == null) {
            return null;
        }

        Train train = reservation.getTrain();
        if (train == null && reservation.getTrainId() > 0) {
            train = trainRepository.findById(reservation.getTrainId()).orElse(null);
        }
        if (train == null) {
            return null;
        }

        int stationId = train.getStationId();
        Station station = stationRepository.findById(stationId).orElse(null);
        String journeyDate = reservation.getJourneyDate();

        // Calculate total passengers at this station across all trains on journey date
        Integer stationPax = reservationRepository.getTotalPassengersByStationAndDate(stationId, journeyDate);
        int totalPassengers = (stationPax != null) ? stationPax : 0;
        if (totalPassengers == 0) {
            // fallback across all dates if specific date has no aggregate
            List<Train> trainsAtStation = trainRepository.findByStationId(stationId);
            for (Train t : trainsAtStation) {
                Integer p = reservationRepository.getTotalPassengers(t.getTrainId());
                if (p != null) totalPassengers += p;
            }
        }

        // Advanced Engine Analytics
        TimeWindowAnalysis timeWindow = congestionEngine.calculateTimeWindowAnalysis(train, journeyDate);
        List<PlatformLoadDto> platformLoads = congestionEngine.calculatePlatformLoads(stationId, journeyDate);
        List<HourlyTimelineDto> timeline = congestionEngine.calculateTimeline(stationId, journeyDate);

        // Overall Congestion Level
        String level = calculateCongestionLevel(totalPassengers, timeWindow, platformLoads);

        // Commuter Travel Advisory
        TravelAdvisoryDto advisory = travelAdvisoryService.generateAdvisory(station, train, level, timeWindow, platformLoads);

        return CongestionResponse.builder()
                .congestionLevel(level)
                .totalPassengers(totalPassengers)
                .stationName(station != null ? station.getStationName() : "Unknown Station")
                .stationCode(station != null ? station.getStationCode() : "")
                .city(station != null ? station.getCity() : "")
                .zone(station != null ? station.getZone() : "")
                .latitude(station != null ? station.getLatitude() : null)
                .longitude(station != null ? station.getLongitude() : null)
                .totalPlatforms(station != null ? station.getTotalPlatforms() : 10)
                .trainNumber(train.getTrainNumber())
                .trainName(train.getTrainName())
                .trainType(train.getTrainType())
                .departureTime(train.getDepartureTime())
                .arrivalTime(train.getArrivalTime())
                .platform(train.getPlatform())
                .sourceStation(train.getSourceStation())
                .destinationStation(train.getDestinationStation())
                .pnr(pnr)
                .journeyDate(journeyDate)
                .coachType(reservation.getCoachType())
                .bookingStatus(reservation.getBookingStatus())
                .reservedPassengers(reservation.getReservedPassengers())
                .stationId(stationId)
                .trainId(train.getTrainId())
                .timeWindowAnalysis(timeWindow)
                .platformLoads(platformLoads)
                .travelAdvisory(advisory)
                .timeline(timeline)
                .build();
    }

    /**
     * Get congestion for a specific station on a specific date.
     */
    public CongestionResponse getCongestionByStationAndDate(int stationId, String date) {
        Optional<Station> stationOpt = stationRepository.findById(stationId);
        if (stationOpt.isEmpty()) {
            return null;
        }

        Station station = stationOpt.get();
        Integer totalPassengers = reservationRepository.getTotalPassengersByStationAndDate(stationId, date);
        int passengers = (totalPassengers != null) ? totalPassengers : 0;

        List<Train> stationTrains = trainRepository.findByStationIdOrderByDepartureTimeAsc(stationId);
        Train referenceTrain = stationTrains.isEmpty() ? null : stationTrains.get(0);

        TimeWindowAnalysis timeWindow = referenceTrain != null
                ? congestionEngine.calculateTimeWindowAnalysis(referenceTrain, date)
                : null;
        List<PlatformLoadDto> platformLoads = congestionEngine.calculatePlatformLoads(stationId, date);
        List<HourlyTimelineDto> timeline = congestionEngine.calculateTimeline(stationId, date);

        String level = calculateCongestionLevel(passengers, timeWindow, platformLoads);

        TravelAdvisoryDto advisory = referenceTrain != null
                ? travelAdvisoryService.generateAdvisory(station, referenceTrain, level, timeWindow, platformLoads)
                : null;

        return CongestionResponse.builder()
                .congestionLevel(level)
                .totalPassengers(passengers)
                .stationName(station.getStationName())
                .stationCode(station.getStationCode())
                .city(station.getCity())
                .zone(station.getZone())
                .latitude(station.getLatitude())
                .longitude(station.getLongitude())
                .totalPlatforms(station.getTotalPlatforms())
                .trainNumber(referenceTrain != null ? referenceTrain.getTrainNumber() : null)
                .trainName(referenceTrain != null ? referenceTrain.getTrainName() : "Station Overview")
                .trainType(referenceTrain != null ? referenceTrain.getTrainType() : "ALL")
                .departureTime(referenceTrain != null ? referenceTrain.getDepartureTime() : "--:--")
                .arrivalTime(referenceTrain != null ? referenceTrain.getArrivalTime() : "--:--")
                .platform(referenceTrain != null ? referenceTrain.getPlatform() : 1)
                .sourceStation(referenceTrain != null ? referenceTrain.getSourceStation() : null)
                .destinationStation(referenceTrain != null ? referenceTrain.getDestinationStation() : null)
                .journeyDate(date)
                .stationId(stationId)
                .trainId(referenceTrain != null ? referenceTrain.getTrainId() : 0)
                .timeWindowAnalysis(timeWindow)
                .platformLoads(platformLoads)
                .travelAdvisory(advisory)
                .timeline(timeline)
                .build();
    }

    /**
     * Enhanced Congestion Assessment:
     * Takes into account cumulative passengers, acute 45-min bottleneck peaks, and platform stampede hazards.
     */
    public String calculateCongestionLevel(int passengers, TimeWindowAnalysis window, List<PlatformLoadDto> platformLoads) {
        boolean stampedeRisk = platformLoads != null && platformLoads.stream().anyMatch(PlatformLoadDto::isStampedeHazard);
        if (stampedeRisk || (window != null && "CRITICAL".equalsIgnoreCase(window.getBottleneckSeverity()))) {
            return "CRITICAL_STAMPEDE_RISK";
        }

        if (passengers >= 1500 || (window != null && window.isAcuteBottleneck())) {
            return "HIGH";
        } else if (passengers >= 500) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    public String calculateCongestionLevel(int passengers) {
        if (passengers < 500) {
            return "LOW";
        } else if (passengers <= 1500) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }
}
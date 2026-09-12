package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.HourlyTimelineDto;
import com.example.railway_congestion.dto.PlatformLoadDto;
import com.example.railway_congestion.dto.TimeWindowAnalysis;
import com.example.railway_congestion.model.Reservation;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CongestionEngine {

    private final ReservationRepository reservationRepository;
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;

    public CongestionEngine(ReservationRepository reservationRepository,
                            TrainRepository trainRepository,
                            StationRepository stationRepository) {
        this.reservationRepository = reservationRepository;
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
    }

    /**
     * Converts "HH:mm" to minutes from midnight
     */
    public int parseTimeToMinutes(String timeStr) {
        if (timeStr == null || !timeStr.contains(":")) {
            return 480; // default 08:00
        }
        try {
            String[] parts = timeStr.trim().split(":");
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            return (hours * 60 + minutes) % 1440;
        } catch (Exception e) {
            return 480;
        }
    }

    /**
     * Converts minutes from midnight to "HH:mm"
     */
    public String formatMinutesToTime(int totalMinutes) {
        int normalized = (totalMinutes % 1440 + 1440) % 1440;
        int hours = normalized / 60;
        int minutes = normalized % 60;
        return String.format("%02d:%02d", hours, minutes);
    }

    /**
     * Calculates 45-minute rolling time-window passenger volume around target train's departure
     */
    public TimeWindowAnalysis calculateTimeWindowAnalysis(Train targetTrain, String journeyDate) {
        int depMinutes = parseTimeToMinutes(targetTrain.getDepartureTime());
        int windowStartMinutes = depMinutes - 45;
        int windowEndMinutes = depMinutes;

        String windowStart = formatMinutesToTime(windowStartMinutes);
        String windowEnd = formatMinutesToTime(windowEndMinutes);

        List<Train> stationTrains = trainRepository.findByStationId(targetTrain.getStationId());
        List<String> concurrentTrains = new ArrayList<>();
        int windowPassengers = 0;

        for (Train t : stationTrains) {
            int tDepMinutes = parseTimeToMinutes(t.getDepartureTime());
            // Train departs within target train's boarding window or within 15 min after
            if (tDepMinutes >= (depMinutes - 45) && tDepMinutes <= (depMinutes + 15)) {
                concurrentTrains.add(t.getTrainName() + " (" + t.getDepartureTime() + ", P" + t.getPlatform() + ")");
                Integer count = getTrainPassengerCount(t.getTrainId(), journeyDate);
                windowPassengers += (count != null ? count : 0);
            }
        }

        boolean acuteBottleneck = windowPassengers >= 1000 || concurrentTrains.size() >= 3;
        String severity = "LOW";
        if (windowPassengers >= 1800 || (windowPassengers >= 1200 && concurrentTrains.size() >= 3)) {
            severity = "CRITICAL";
        } else if (windowPassengers >= 1200 || concurrentTrains.size() >= 3) {
            severity = "SEVERE";
        } else if (windowPassengers >= 600 || concurrentTrains.size() >= 2) {
            severity = "MODERATE";
        }

        double frictionFactor = 1.0 + Math.min(1.2, (windowPassengers / 1500.0) * 0.8);

        String acuteReason = acuteBottleneck
                ? "Acute boarding bottleneck: " + concurrentTrains.size() + " express trains departing within the 45-min window (" + windowStart + " - " + windowEnd + "), concentrating " + windowPassengers + " passengers in station concourses."
                : "Steady commuter flow during this departure window.";

        return TimeWindowAnalysis.builder()
                .windowStart(windowStart)
                .windowEnd(windowEnd)
                .windowDurationMinutes(45)
                .concurrentTrainsCount(concurrentTrains.size())
                .concurrentTrainNames(concurrentTrains)
                .windowPassengerVolume(windowPassengers)
                .acuteBottleneck(acuteBottleneck)
                .bottleneckSeverity(severity)
                .concourseCongestionFactor(Math.round(frictionFactor * 100.0) / 100.0)
                .acuteReason(acuteReason)
                .build();
    }

    /**
     * Calculates per-platform passenger density and stampede hazard risk
     */
    public List<PlatformLoadDto> calculatePlatformLoads(int stationId, String journeyDate) {
        Optional<Station> stationOpt = stationRepository.findById(stationId);
        int totalPlatforms = stationOpt.map(Station::getTotalPlatforms).orElse(10);
        if (totalPlatforms <= 0) totalPlatforms = 8;

        List<Train> stationTrains = trainRepository.findByStationId(stationId);
        Map<Integer, List<Train>> platformTrainMap = new HashMap<>();
        for (Train t : stationTrains) {
            platformTrainMap.computeIfAbsent(t.getPlatform(), k -> new ArrayList<>()).add(t);
        }

        List<PlatformLoadDto> platformLoads = new ArrayList<>();
        int defaultPlatformCapacity = 800; // Standard IR platform holding capacity

        for (int p = 1; p <= totalPlatforms; p++) {
            List<Train> trainsOnPlatform = platformTrainMap.getOrDefault(p, Collections.emptyList());
            List<String> assignedTrainNames = new ArrayList<>();
            int totalPlatformPax = 0;

            for (Train t : trainsOnPlatform) {
                assignedTrainNames.add(t.getTrainName() + " [" + t.getDepartureTime() + "]");
                Integer pax = getTrainPassengerCount(t.getTrainId(), journeyDate);
                if (pax != null) {
                    totalPlatformPax += pax;
                }
            }

            int densityPct = Math.min(125, (totalPlatformPax * 100) / defaultPlatformCapacity);
            String status = "OPTIMAL";
            boolean hazard = false;
            String warning = null;

            if (densityPct >= 90 || (totalPlatformPax >= 800 && trainsOnPlatform.size() >= 2)) {
                status = "CRITICAL_STAMPEDE_RISK";
                hazard = true;
                warning = "CRITICAL STAMPEDE HAZARD: Platform " + p + " load (" + densityPct + "%) exceeds safe evacuation capacity. Crowd barriers active.";
            } else if (densityPct >= 65) {
                status = "CROWDED";
                warning = "High platform passenger volume. Boarding delays anticipated.";
            } else if (densityPct >= 30) {
                status = "MODERATE";
            }

            platformLoads.add(PlatformLoadDto.builder()
                    .platformNumber(p)
                    .assignedTrains(assignedTrainNames)
                    .platformPassengerVolume(totalPlatformPax)
                    .platformCapacity(defaultPlatformCapacity)
                    .densityPercentage(densityPct)
                    .loadStatus(status)
                    .stampedeHazard(hazard)
                    .hazardWarning(warning)
                    .build());
        }

        return platformLoads;
    }

    /**
     * Generates 24-hour timeline slots for station on journeyDate
     */
    public List<HourlyTimelineDto> calculateTimeline(int stationId, String journeyDate) {
        List<Train> stationTrains = trainRepository.findByStationId(stationId);
        Map<Integer, List<Train>> hourMap = new HashMap<>();
        for (Train t : stationTrains) {
            int hour = parseTimeToMinutes(t.getDepartureTime()) / 60;
            hourMap.computeIfAbsent(hour, k -> new ArrayList<>()).add(t);
        }

        List<HourlyTimelineDto> timeline = new ArrayList<>();
        // Cover hours 05:00 to 23:00
        for (int h = 5; h <= 23; h++) {
            List<Train> trains = hourMap.getOrDefault(h, Collections.emptyList());
            int paxSum = 0;
            List<String> names = new ArrayList<>();
            for (Train t : trains) {
                names.add(t.getTrainName());
                Integer p = getTrainPassengerCount(t.getTrainId(), journeyDate);
                if (p != null) paxSum += p;
            }

            String slot = String.format("%02d:00", h);
            boolean isPeak = paxSum >= 600 || trains.size() >= 2;

            timeline.add(HourlyTimelineDto.builder()
                    .timeSlot(slot)
                    .passengerCount(paxSum)
                    .trainCount(trains.size())
                    .trainNames(names)
                    .isPeakSlot(isPeak)
                    .build());
        }

        return timeline;
    }

    public Integer getTrainPassengerCount(int trainId, String journeyDate) {
        if (journeyDate == null || journeyDate.trim().isEmpty()) {
            return reservationRepository.getTotalPassengers(trainId);
        }
        List<Reservation> list = reservationRepository.findByTrainIdAndJourneyDate(trainId, journeyDate);
        if (list == null || list.isEmpty()) {
            return reservationRepository.getTotalPassengers(trainId);
        }
        return list.stream().mapToInt(Reservation::getReservedPassengers).sum();
    }
}

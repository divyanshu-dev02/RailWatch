package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.DelaySimulationRequest;
import com.example.railway_congestion.dto.DelaySimulationResponse;
import com.example.railway_congestion.dto.PlatformLoadDto;
import com.example.railway_congestion.dto.TimeWindowAnalysis;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DelaySimulatorService {

    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final CongestionEngine congestionEngine;

    public DelaySimulatorService(TrainRepository trainRepository,
                                 StationRepository stationRepository,
                                 CongestionEngine congestionEngine) {
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
        this.congestionEngine = congestionEngine;
    }

    public DelaySimulationResponse simulateDelay(DelaySimulationRequest request) {
        int trainId = request.getTrainId();
        int delayMinutes = request.getDelayMinutes();
        String journeyDate = request.getJourneyDate() != null && !request.getJourneyDate().trim().isEmpty()
                ? request.getJourneyDate().trim() : "2026-04-27";

        Train targetTrain = trainRepository.findById(trainId).orElse(null);
        if (targetTrain == null) {
            return null;
        }

        Station station = stationRepository.findById(targetTrain.getStationId()).orElse(null);
        String stationName = station != null ? station.getStationName() : "Unknown Station";

        int origDepMinutes = congestionEngine.parseTimeToMinutes(targetTrain.getDepartureTime());
        int simDepMinutes = origDepMinutes + delayMinutes;
        String simulatedDepTime = congestionEngine.formatMinutesToTime(simDepMinutes);

        // Original Window Metrics
        TimeWindowAnalysis origWindow = congestionEngine.calculateTimeWindowAnalysis(targetTrain, journeyDate);
        int origWindowPax = origWindow.getWindowPassengerVolume();

        // Calculate Simulated Overlaps
        List<Train> stationTrains = trainRepository.findByStationId(targetTrain.getStationId());
        List<String> collidingTrainNames = new ArrayList<>();
        boolean platformCollision = false;
        int collidingPlatform = targetTrain.getPlatform();
        int simWindowPax = 0;

        Integer targetTrainPax = congestionEngine.getTrainPassengerCount(targetTrain.getTrainId(), journeyDate);
        if (targetTrainPax == null) targetTrainPax = 600;
        simWindowPax += targetTrainPax;

        for (Train other : stationTrains) {
            if (other.getTrainId() == targetTrain.getTrainId()) continue;

            int otherDepMinutes = congestionEngine.parseTimeToMinutes(other.getDepartureTime());

            // Check if other train departs in the simulated 45-min window [simDepMinutes - 45, simDepMinutes + 15]
            if (otherDepMinutes >= (simDepMinutes - 45) && otherDepMinutes <= (simDepMinutes + 15)) {
                collidingTrainNames.add(other.getTrainName() + " (" + other.getDepartureTime() + ", P" + other.getPlatform() + ")");
                Integer otherPax = congestionEngine.getTrainPassengerCount(other.getTrainId(), journeyDate);
                simWindowPax += (otherPax != null ? otherPax : 0);

                // Platform collision: both trains scheduled on the same platform within 30 minutes
                if (other.getPlatform() == targetTrain.getPlatform() && Math.abs(otherDepMinutes - simDepMinutes) <= 35) {
                    platformCollision = true;
                }
            }
        }

        // Determine Before and After Levels
        String origLevel = origWindowPax >= 1500 ? "HIGH" : (origWindowPax >= 500 ? "MEDIUM" : "LOW");
        String simLevel = simWindowPax >= 1800 || (platformCollision && simWindowPax >= 1000)
                ? "CRITICAL_STAMPEDE_RISK"
                : (simWindowPax >= 1200 ? "HIGH" : (simWindowPax >= 500 ? "MEDIUM" : "LOW"));

        boolean stampedeEscalation = ("CRITICAL_STAMPEDE_RISK".equals(simLevel) && !"CRITICAL_STAMPEDE_RISK".equals(origLevel))
                || (platformCollision && simWindowPax >= 800);

        String severity = stampedeEscalation ? "CRITICAL_STAMPEDE_RISK"
                : (simWindowPax > origWindowPax + 500 ? "HIGH" : (simWindowPax > origWindowPax ? "MEDIUM" : "LOW"));

        int delta = simWindowPax - origWindowPax;

        // Build human-readable narrative
        StringBuilder sb = new StringBuilder();
        sb.append("Delaying ").append(targetTrain.getTrainName()).append(" by ").append(delayMinutes).append(" minutes (")
                .append(targetTrain.getDepartureTime()).append(" ➔ ").append(simulatedDepTime).append(") ");

        if (platformCollision) {
            sb.append("causes a DIRECT PLATFORM COLLISION on Platform ").append(collidingPlatform)
                    .append(" with concurrent train departures! ");
        } else if (!collidingTrainNames.isEmpty()) {
            sb.append("shifts its passenger boarding surge into direct conflict with ")
                    .append(collidingTrainNames.size()).append(" other train(s): ")
                    .append(String.join(", ", collidingTrainNames)).append(". ");
        } else {
            sb.append("shifts departure into a quieter operational window without major concurrent collisions. ");
        }

        sb.append("Acute 45-min concourse passenger load shifts from ").append(origWindowPax)
                .append(" to ").append(simWindowPax).append(" (").append(delta >= 0 ? "+" : "").append(delta).append(" pax). ");

        if (stampedeEscalation) {
            sb.append("CRITICAL ALERT: Overcrowding hazard escalates to STAMPEDE RISK. Immediate station master intervention required.");
        }

        // Mitigation Recommendation
        String mitigation;
        if (platformCollision) {
            int altPlat = (targetTrain.getPlatform() % 8) + 1;
            mitigation = "Station Master Action: Reassign " + targetTrain.getTrainName() + " to Platform " + altPlat +
                    " immediately to prevent dual-train platform gridlock and boarding stampede.";
        } else if (stampedeEscalation) {
            mitigation = "Crowd Control Protocol: Regulate entry turnstiles at main concourses and deploy RPF personnel on Platform " + targetTrain.getPlatform() + ".";
        } else if (delta > 300) {
            mitigation = "Inform passengers via SMS advisory to enter via secondary gate to distribute concourse pressure.";
        } else {
            mitigation = "Routine delay protocol: Update platform digital indicators with revised departure " + simulatedDepTime + ".";
        }

        List<PlatformLoadDto> simulatedPlatforms = congestionEngine.calculatePlatformLoads(targetTrain.getStationId(), journeyDate);

        return DelaySimulationResponse.builder()
                .trainId(trainId)
                .trainNumber(targetTrain.getTrainNumber())
                .trainName(targetTrain.getTrainName())
                .stationId(targetTrain.getStationId())
                .stationName(stationName)
                .originalDeparture(targetTrain.getDepartureTime())
                .simulatedDeparture(simulatedDepTime)
                .delayMinutes(delayMinutes)
                .originalCongestionLevel(origLevel)
                .simulatedCongestionLevel(simLevel)
                .originalWindowPassengers(origWindowPax)
                .simulatedWindowPassengers(simWindowPax)
                .passengerDelta(delta)
                .platformCollision(platformCollision)
                .collidingPlatform(collidingPlatform)
                .collidingTrains(collidingTrainNames)
                .stampedeRiskEscalation(stampedeEscalation)
                .severity(severity)
                .narrative(sb.toString())
                .mitigationRecommendation(mitigation)
                .simulatedPlatformLoads(simulatedPlatforms)
                .build();
    }
}

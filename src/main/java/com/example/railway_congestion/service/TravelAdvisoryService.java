package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.PlatformLoadDto;
import com.example.railway_congestion.dto.TimeWindowAnalysis;
import com.example.railway_congestion.dto.TravelAdvisoryDto;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TravelAdvisoryService {

    private final TrainRepository trainRepository;
    private final CongestionEngine congestionEngine;

    public TravelAdvisoryService(TrainRepository trainRepository, CongestionEngine congestionEngine) {
        this.trainRepository = trainRepository;
        this.congestionEngine = congestionEngine;
    }

    public TravelAdvisoryDto generateAdvisory(Station station, Train train, String congestionLevel,
                                             TimeWindowAnalysis windowAnalysis, List<PlatformLoadDto> platformLoads) {
        int depMinutes = congestionEngine.parseTimeToMinutes(train.getDepartureTime());
        int bufferMinutes;
        String arrivalTimeText;

        boolean isHighOrCritical = "HIGH".equalsIgnoreCase(congestionLevel) ||
                "CRITICAL_STAMPEDE_RISK".equalsIgnoreCase(congestionLevel) ||
                (windowAnalysis != null && windowAnalysis.isAcuteBottleneck());

        if ("CRITICAL_STAMPEDE_RISK".equalsIgnoreCase(congestionLevel) || (windowAnalysis != null && "CRITICAL".equalsIgnoreCase(windowAnalysis.getBottleneckSeverity()))) {
            bufferMinutes = 90;
        } else if (isHighOrCritical) {
            bufferMinutes = 75;
        } else if ("MEDIUM".equalsIgnoreCase(congestionLevel)) {
            bufferMinutes = 45;
        } else {
            bufferMinutes = 30;
        }

        int targetArrivalMinutes = depMinutes - bufferMinutes;
        String recTime = congestionEngine.formatMinutesToTime(targetArrivalMinutes);
        arrivalTimeText = recTime + " (" + bufferMinutes + " mins before departure)";

        // Optimal Gate & Foot Overbridge Selection based on Station Code and Platform
        int platform = train.getPlatform();
        String stationCode = station != null && station.getStationCode() != null ? station.getStationCode().toUpperCase() : "GEN";
        String optimalGate;
        String recommendedFob;

        switch (stationCode) {
            case "NDLS":
                if (platform <= 5) {
                    optimalGate = "Gate 2 (Ajmeri Gate Metro Concourse Side)";
                    recommendedFob = "FOB 3 (Direct ramp to Platforms 1-5, bypasses main concourse)";
                } else {
                    optimalGate = "Gate 1 (Paharganj Main Entry)";
                    recommendedFob = "FOB 1 (North Escalator link for Platforms 6-16)";
                }
                break;
            case "HWH":
                if (platform <= 8) {
                    optimalGate = "Old Complex Main Portico (Gate A - Subhas Bose Concourse)";
                    recommendedFob = "Central Subway link towards Platforms 1-8";
                } else {
                    optimalGate = "New Complex South Concourse (Gate C - Yatri Niwas Side)";
                    recommendedFob = "Elevated FOB 4 connecting Platforms 9-23";
                }
                break;
            case "BCT":
            case "MMCT":
                if (platform <= 3) {
                    optimalGate = "East Concourse (Tardeo Road / Bellasis Road Entry)";
                    recommendedFob = "South FOB connecting Platforms 1-3 directly";
                } else {
                    optimalGate = "West Concourse (Maratha Mandir Road Entry)";
                    recommendedFob = "FOB 2 with direct escalator access to Platforms 4-7";
                }
                break;
            case "MAS":
                if (platform <= 6) {
                    optimalGate = "Wall Tax Road Gate (North Suburban Entry)";
                    recommendedFob = "North Platform Walkway (zero flight stairs)";
                } else {
                    optimalGate = "EVR Periyar Salai Main Entrance (South Concourse)";
                    recommendedFob = "Main FOB with tactile guide strips for Platforms 7-12";
                }
                break;
            case "SBC":
                if (platform <= 4) {
                    optimalGate = "Krantivira Sangolli Rayanna Metro Skywalk Entry";
                    recommendedFob = "Main Skywalk Link direct to Platforms 1-4";
                } else {
                    optimalGate = "Okalipuram Rear Gate Entrance";
                    recommendedFob = "East FOB connecting Platforms 5-10";
                }
                break;
            default:
                if (platform <= 3) {
                    optimalGate = "Main Portico Concourse (Gate 1)";
                    recommendedFob = "Platform 1 level ramp & North FOB";
                } else {
                    optimalGate = "Secondary Concourse Gate (East/Rear Entry)";
                    recommendedFob = "Central Foot Overbridge with elevator support";
                }
                break;
        }

        // Baggage and concourse advice
        String baggageGuidance;
        String concourseGuidance;
        String safetyAdvisory;

        if (isHighOrCritical) {
            baggageGuidance = "Heavy concourse rush detected. Limit luggage to compact trolley bags. Luggage scanner queues at " + optimalGate + " are averaging 8-12 minutes.";
            concourseGuidance = "Avoid central concourse crossroads. Use " + recommendedFob + " for shortest footfall friction directly to Platform " + platform + ".";
            safetyAdvisory = "STAMPEDE PREVENTION ALERT: Maintain queue discipline on platform staircases. Stand behind the yellow safety tactile strip until train halts.";
        } else if ("MEDIUM".equalsIgnoreCase(congestionLevel)) {
            baggageGuidance = "Moderate passenger traffic. Standard baggage allowed. Porters available at " + optimalGate + ".";
            concourseGuidance = "Proceed via " + optimalGate + ". Security screening wait time is under 4 minutes.";
            safetyAdvisory = "Platform " + platform + " has moderate boarding density. Look for coach position display markers above track.";
        } else {
            baggageGuidance = "Concourse is clear. Standard check-in with minimal queue times (<2 mins).";
            concourseGuidance = "Direct boarding via " + optimalGate + " with uninhibited platform access.";
            safetyAdvisory = "Comfortable travel conditions. Enjoy your journey!";
        }

        // Alternative Trains Query
        List<String> altTrains = new ArrayList<>();
        if (station != null) {
            List<Train> candidates = trainRepository.findByStationId(station.getStationId());
            for (Train t : candidates) {
                if (t.getTrainId() != train.getTrainId()) {
                    int tDep = congestionEngine.parseTimeToMinutes(t.getDepartureTime());
                    if (Math.abs(tDep - depMinutes) <= 180) { // within 3 hours
                        altTrains.add(t.getTrainName() + " (" + t.getTrainNumber() + ") - Departs " + t.getDepartureTime() + " from P" + t.getPlatform());
                    }
                }
            }
        }

        return TravelAdvisoryDto.builder()
                .recommendedArrivalTime(arrivalTimeText)
                .bufferMinutesBeforeDeparture(bufferMinutes)
                .optimalEntryGate(optimalGate)
                .recommendedFob(recommendedFob)
                .concourseGuidance(concourseGuidance)
                .baggageGuidance(baggageGuidance)
                .safetyAdvisory(safetyAdvisory)
                .alternativeTrains(altTrains.isEmpty() ? List.of("No immediate alternate trains within 3-hour window") : altTrains)
                .build();
    }
}

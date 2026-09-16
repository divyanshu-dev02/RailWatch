package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.CongestionResponse;
import com.example.railway_congestion.dto.DashboardResponse;
import com.example.railway_congestion.dto.StationSnapshot;
import com.example.railway_congestion.dto.TrendPoint;
import com.example.railway_congestion.model.Reservation;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class CongestionService {
    private final ReservationRepository reservationRepository;
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public CongestionService(ReservationRepository reservationRepository, TrainRepository trainRepository,
                             StationRepository stationRepository) {
        this.reservationRepository = reservationRepository;
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
    }

    public CongestionResponse getStatusByPnr(String pnr) {
        Reservation reservation = reservationRepository.findByPnrNumber(pnr);
        if (reservation == null || reservation.getTrain() == null) return null;
        Train train = reservation.getTrain();
        int stationId = train.getStationId();
        Optional<Station> stationOpt = stationRepository.findById(stationId);
        int totalPassengers = totalPassengers(stationId, reservation.getJourneyDate());
        return CongestionResponse.builder().congestionLevel(calculateCongestionLevel(totalPassengers))
                .totalPassengers(totalPassengers).stationName(stationOpt.map(Station::getStationName).orElse("Unknown"))
                .city(stationOpt.map(Station::getCity).orElse("Unknown")).trainName(train.getTrainName())
                .departureTime(train.getDepartureTime()).platform(train.getPlatform()).pnr(pnr)
                .journeyDate(reservation.getJourneyDate()).stationId(stationId).trainId(train.getTrainId()).build();
    }

    public DashboardResponse getDashboard(String date) {
        List<StationSnapshot> snapshots = stationRepository.findAll().stream().map(station -> snapshot(station, date)).toList();
        int total = snapshots.stream().mapToInt(StationSnapshot::totalPassengers).sum();
        int low = countLevel(snapshots, "LOW");
        int medium = countLevel(snapshots, "MEDIUM");
        int high = countLevel(snapshots, "HIGH");
        LocalDate selected = LocalDate.parse(date);
        List<TrendPoint> trend = reservationRepository.getPassengerTrend(selected.minusDays(6).toString(), selected.toString());
        return new DashboardResponse(date, total, low, medium, high, snapshots, trend, Instant.now().toString());
    }

    public StationSnapshot getStationCongestion(int stationId, String date) {
        return stationRepository.findById(stationId).map(station -> snapshot(station, date)).orElse(null);
    }

    public List<TrendPoint> getStationHistory(int stationId, String from, String to) {
        if (stationRepository.findById(stationId).isEmpty()) return null;
        return reservationRepository.getPassengerTrend(from, to);
    }

    public int totalPassengers(int stationId, String date) {
        Integer total = reservationRepository.getTotalPassengersByStationAndDate(stationId, date);
        return total == null ? 0 : total;
    }

    public String calculateCongestionLevel(int passengers) {
        if (passengers < 500) return "LOW";
        if (passengers <= 1500) return "MEDIUM";
        return "HIGH";
    }

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(error -> emitters.remove(emitter));
        return emitter;
    }

    public StationSnapshot demoTick(String date) {
        List<Station> stations = stationRepository.findAll();
        if (stations.isEmpty()) return null;
        Station station = stations.get(ThreadLocalRandom.current().nextInt(stations.size()));
        int current = totalPassengers(station.getStationId(), date);
        int next = Math.max(0, current + ThreadLocalRandom.current().nextInt(-75, 126));
        StationSnapshot event = new StationSnapshot(station.getStationId(), station.getStationName(), station.getCity(), next,
                calculateCongestionLevel(next), date, Instant.now().toString());
        publish(event);
        return event;
    }

    private StationSnapshot snapshot(Station station, String date) {
        int passengers = totalPassengers(station.getStationId(), date);
        return new StationSnapshot(station.getStationId(), station.getStationName(), station.getCity(), passengers,
                calculateCongestionLevel(passengers), date, Instant.now().toString());
    }

    private int countLevel(List<StationSnapshot> snapshots, String level) {
        return (int) snapshots.stream().filter(snapshot -> level.equals(snapshot.congestionLevel())).count();
    }

    private void publish(StationSnapshot event) {
        emitters.forEach(emitter -> {
            try { emitter.send(SseEmitter.event().name("congestion-update").data(event)); }
            catch (Exception exception) { emitters.remove(emitter); }
        });
    }
}

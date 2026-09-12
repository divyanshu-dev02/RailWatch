package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.railway_congestion.model.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    Reservation findByPnrNumber(String pnrNumber);

    List<Reservation> findByTrainIdAndJourneyDate(int trainId, String journeyDate);

    @Query("SELECT SUM(r.reservedPassengers) FROM Reservation r WHERE r.train.trainId = :trainId")
    Integer getTotalPassengers(@Param("trainId") int trainId);

    @Query("SELECT SUM(r.reservedPassengers) FROM Reservation r " +
           "WHERE r.train.stationId = :stationId AND r.journeyDate = :date")
    Integer getTotalPassengersByStationAndDate(@Param("stationId") int stationId,
                                               @Param("date") String date);

    @Query("SELECT r FROM Reservation r WHERE r.train.stationId = :stationId AND r.journeyDate = :date")
    List<Reservation> findByStationIdAndDate(@Param("stationId") int stationId,
                                             @Param("date") String date);
}
package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.railway_congestion.model.Reservation;

import java.util.List;
import com.example.railway_congestion.dto.TrendPoint;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    Reservation findByPnrNumber(String pnrNumber);

    @Query("SELECT SUM(r.reservedPassengers) FROM Reservation r WHERE r.train.trainId = :trainId")
    Integer getTotalPassengers(@Param("trainId") int trainId);

    @Query("SELECT r FROM Reservation r WHERE r.train.stationId = :stationId AND r.journeyDate = :date")
    List<Reservation> findByStationIdAndDate(@Param("stationId") int stationId,
                                             @Param("date") String date);

    @Query("SELECT COALESCE(SUM(r.reservedPassengers), 0) FROM Reservation r " +
           "WHERE r.train.stationId = :stationId AND r.journeyDate = :date")
    Integer getTotalPassengersByStationAndDate(@Param("stationId") int stationId,
                                               @Param("date") String date);

    @Query("SELECT new com.example.railway_congestion.dto.TrendPoint(r.journeyDate, SUM(r.reservedPassengers)) " +
           "FROM Reservation r WHERE r.journeyDate BETWEEN :fromDate AND :toDate " +
           "GROUP BY r.journeyDate ORDER BY r.journeyDate")
    List<TrendPoint> getPassengerTrend(@Param("fromDate") String fromDate,
                                       @Param("toDate") String toDate);
}

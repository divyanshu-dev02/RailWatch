package com.example.railway_congestion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.railway_congestion.model.Reservation;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    Reservation findByPnrNumber(String pnrNumber);
    @Query("SELECT SUM(r.reservedPassengers) FROM Reservation r WHERE r.train.trainId = :trainId")
    Integer getTotalPassengers(@Param("trainId") int trainId);
}
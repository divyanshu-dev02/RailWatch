package com.example.railway_congestion.model;

import jakarta.persistence.*;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reservationId;

    @Column(name = "pnr_number")
    private String pnrNumber;

    private int reservedPassengers;

    private String journeyDate;

    @ManyToOne
    @JoinColumn(name = "train_id")
    private Train train;

    public int getReservationId() {
        return reservationId;
    }

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public int getReservedPassengers() {
        return reservedPassengers;
    }

    public void setReservedPassengers(int reservedPassengers) {
        this.reservedPassengers = reservedPassengers;
    }

    public String getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(String journeyDate) {
        this.journeyDate = journeyDate;
    }


    public Train getTrain() {
        return train;
    }

    public void setTrain(Train train) {
        this.train = train;
    }
}
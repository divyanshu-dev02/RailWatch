package com.example.railway_congestion.service;

import com.example.railway_congestion.model.Reservation;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.TrainRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CongestionService {

    private final ReservationRepository reservationRepository;
    private final TrainRepository trainRepository;

    public CongestionService(ReservationRepository reservationRepository,
                             TrainRepository trainRepository) {
        this.reservationRepository = reservationRepository;
        this.trainRepository = trainRepository;
    }
    public String getCongestionForTrain(int trainId){

        Integer passengers = reservationRepository.getTotalPassengers(trainId);

        if(passengers == null)
            return "No reservation data";

        if(passengers < 500)
            return "LOW congestion";

        else if(passengers < 1500)
            return "MEDIUM congestion";

        else
            return "HIGH congestion";
    }

    public String getStationStatusByPnr(String pnr){

        System.out.println("PNR received: " + pnr);

        Reservation reservation = reservationRepository.findByPnrNumber(pnr);
        if (reservation == null){
            return "pnr not found";
        }
        System.out.println("Reservation: " + reservation);

        Train train = reservation.getTrain();
        if(train == null){
            return "train data not found";
        }
        System.out.println("Train: " + train);

        int stationId = train.getStationId();
        System.out.println("Station ID: " + stationId);

        return getStationCongestion(stationId);
    }


    public String getStationCongestion(int stationId){

        List<Train> trains = trainRepository.findByStationId(stationId);

        int totalPassengers = 0;

        for(Train train : trains){

            Integer passengers = reservationRepository.getTotalPassengers(train.getTrainId());

            if(passengers != null){
                totalPassengers += passengers;
            }
        }

        return calculateCongestion(totalPassengers);
    }

    public String calculateCongestion(int passengers){

        if(passengers < 500)
            return "LOW congestion";

        else if(passengers < 2000)
            return "MEDIUM congestion";

        else
            return "HIGH congestion";
    }
}
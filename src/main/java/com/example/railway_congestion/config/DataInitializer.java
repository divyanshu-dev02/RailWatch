package com.example.railway_congestion.config;

import com.example.railway_congestion.model.Reservation;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final ReservationRepository reservationRepository;

    public DataInitializer(StationRepository stationRepository,
                           TrainRepository trainRepository,
                           ReservationRepository reservationRepository) {
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public void run(String... args) {
        boolean needsReseed = stationRepository.count() == 0 ||
                stationRepository.findAll().stream().anyMatch(s -> s.getStationCode() == null || s.getStationCode().trim().isEmpty() || s.getTotalPlatforms() == null);

        if (needsReseed) {
            System.out.println("⚡ [RailWatch DataInitializer] Upgrading schema with 10 major junctions, coordinates, trains, and reservations...");
            try {
                reservationRepository.deleteAll();
                trainRepository.deleteAll();
                stationRepository.deleteAll();
            } catch (Exception e) {
                System.out.println("Note during cleanup: " + e.getMessage());
            }
            seedStationsAndData();
            System.out.println("✅ [RailWatch DataInitializer] Realistic dataset successfully seeded!");
        } else {
            System.out.println("ℹ️ [RailWatch DataInitializer] Database already seeded. Total stations: " + stationRepository.count());
        }
    }

    private void seedStationsAndData() {
        // 1. Stations (10 Major Indian Rail Junctions)
        Station ndls = Station.builder()
                .stationCode("NDLS").stationName("New Delhi Railway Station").city("New Delhi")
                .zone("NR - Northern Railway").latitude(28.6431).longitude(77.2197)
                .totalPlatforms(16).dailyCapacity(500000).build();

        Station bct = Station.builder()
                .stationCode("BCT").stationName("Mumbai Central").city("Mumbai")
                .zone("WR - Western Railway").latitude(18.9696).longitude(72.8193)
                .totalPlatforms(7).dailyCapacity(350000).build();

        Station mas = Station.builder()
                .stationCode("MAS").stationName("Chennai Central").city("Chennai")
                .zone("SR - Southern Railway").latitude(13.0827).longitude(80.2755)
                .totalPlatforms(12).dailyCapacity(400000).build();

        Station hwh = Station.builder()
                .stationCode("HWH").stationName("Howrah Junction").city("Kolkata")
                .zone("ER - Eastern Railway").latitude(22.5839).longitude(88.3426)
                .totalPlatforms(23).dailyCapacity(1000000).build();

        Station sbc = Station.builder()
                .stationCode("SBC").stationName("KSR Bengaluru City").city("Bengaluru")
                .zone("SWR - South Western Railway").latitude(12.9784).longitude(77.5695)
                .totalPlatforms(10).dailyCapacity(300000).build();

        Station adi = Station.builder()
                .stationCode("ADI").stationName("Ahmedabad Junction").city("Ahmedabad")
                .zone("WR - Western Railway").latitude(23.0270).longitude(72.6012)
                .totalPlatforms(12).dailyCapacity(280000).build();

        Station jp = Station.builder()
                .stationCode("JP").stationName("Jaipur Junction").city("Jaipur")
                .zone("NWR - North Western Railway").latitude(26.9208).longitude(75.7873)
                .totalPlatforms(8).dailyCapacity(220000).build();

        Station lko = Station.builder()
                .stationCode("LKO").stationName("Lucknow Charbagh").city("Lucknow")
                .zone("NR - Northern Railway").latitude(26.8311).longitude(80.9234)
                .totalPlatforms(9).dailyCapacity(260000).build();

        Station hyb = Station.builder()
                .stationCode("HYB").stationName("Hyderabad Deccan Nampally").city("Hyderabad")
                .zone("SCR - South Central Railway").latitude(17.3917).longitude(78.4682)
                .totalPlatforms(6).dailyCapacity(200000).build();

        Station pune = Station.builder()
                .stationCode("PUNE").stationName("Pune Junction").city("Pune")
                .zone("CR - Central Railway").latitude(18.5284).longitude(73.8739)
                .totalPlatforms(6).dailyCapacity(250000).build();

        List<Station> savedStations = stationRepository.saveAll(List.of(ndls, bct, mas, hwh, sbc, adi, jp, lko, hyb, pune));
        Station s1 = savedStations.get(0); // NDLS
        Station s2 = savedStations.get(1); // BCT
        Station s3 = savedStations.get(2); // MAS
        Station s4 = savedStations.get(3); // HWH
        Station s5 = savedStations.get(4); // SBC
        Station s6 = savedStations.get(5); // ADI
        Station s7 = savedStations.get(6); // JP
        Station s8 = savedStations.get(7); // LKO
        Station s9 = savedStations.get(8); // HYB
        Station s10 = savedStations.get(9); // PUNE

        // 2. Trains (22 Trains across the 10 Stations)
        Train t1 = Train.builder().trainNumber("12002").trainName("Bhopal Shatabdi Express").trainType("SHATABDI")
                .stationId(s1.getStationId()).departureTime("06:00").arrivalTime("05:30").platform(1)
                .totalCapacity(1100).sourceStation("NDLS").destinationStation("RKMP").build();

        Train t2 = Train.builder().trainNumber("22436").trainName("Vande Bharat Express").trainType("VANDE_BHARAT")
                .stationId(s1.getStationId()).departureTime("06:30").arrivalTime("06:00").platform(3)
                .totalCapacity(1128).sourceStation("NDLS").destinationStation("BSB").build();

        Train t3 = Train.builder().trainNumber("12952").trainName("Mumbai Rajdhani Express").trainType("RAJDHANI")
                .stationId(s1.getStationId()).departureTime("16:55").arrivalTime("16:15").platform(2)
                .totalCapacity(1200).sourceStation("NDLS").destinationStation("MMCT").build();

        Train t4 = Train.builder().trainNumber("12260").trainName("Sealdah Duronto Express").trainType("DURONTO")
                .stationId(s1.getStationId()).departureTime("19:45").arrivalTime("19:00").platform(5)
                .totalCapacity(1250).sourceStation("NDLS").destinationStation("SDAH").build();

        Train t5 = Train.builder().trainNumber("12951").trainName("August Kranti Rajdhani").trainType("RAJDHANI")
                .stationId(s2.getStationId()).departureTime("17:40").arrivalTime("17:00").platform(2)
                .totalCapacity(1200).sourceStation("MMCT").destinationStation("NDLS").build();

        Train t6 = Train.builder().trainNumber("12124").trainName("Deccan Queen Superfast").trainType("SUPERFAST")
                .stationId(s2.getStationId()).departureTime("17:10").arrivalTime("16:30").platform(4)
                .totalCapacity(950).sourceStation("CSMT").destinationStation("PUNE").build();

        Train t7 = Train.builder().trainNumber("20901").trainName("Gandhinagar Capital Vande Bharat").trainType("VANDE_BHARAT")
                .stationId(s2.getStationId()).departureTime("06:00").arrivalTime("05:25").platform(1)
                .totalCapacity(1128).sourceStation("MMCT").destinationStation("GNC").build();

        Train t8 = Train.builder().trainNumber("12622").trainName("Tamil Nadu Superfast Express").trainType("SUPERFAST")
                .stationId(s3.getStationId()).departureTime("22:00").arrivalTime("21:15").platform(1)
                .totalCapacity(1400).sourceStation("MAS").destinationStation("NDLS").build();

        Train t9 = Train.builder().trainNumber("12842").trainName("Coromandel Express").trainType("SUPERFAST")
                .stationId(s3.getStationId()).departureTime("07:00").arrivalTime("06:15").platform(3)
                .totalCapacity(1350).sourceStation("MAS").destinationStation("HWH").build();

        Train t10 = Train.builder().trainNumber("12301").trainName("Howrah Rajdhani Express").trainType("RAJDHANI")
                .stationId(s4.getStationId()).departureTime("16:50").arrivalTime("16:00").platform(9)
                .totalCapacity(1200).sourceStation("HWH").destinationStation("NDLS").build();

        Train t11 = Train.builder().trainNumber("12860").trainName("Gitanjali Superfast Express").trainType("SUPERFAST")
                .stationId(s4.getStationId()).departureTime("13:50").arrivalTime("13:00").platform(21)
                .totalCapacity(1450).sourceStation("HWH").destinationStation("CSMT").build();

        Train t12 = Train.builder().trainNumber("12839").trainName("Howrah Mail").trainType("MAIL_EXPRESS")
                .stationId(s4.getStationId()).departureTime("23:45").arrivalTime("22:50").platform(17)
                .totalCapacity(1300).sourceStation("HWH").destinationStation("MAS").build();

        Train t13 = Train.builder().trainNumber("20608").trainName("Mysuru Vande Bharat Express").trainType("VANDE_BHARAT")
                .stationId(s5.getStationId()).departureTime("14:50").arrivalTime("14:15").platform(1)
                .totalCapacity(1128).sourceStation("MAS").destinationStation("MYS").build();

        Train t14 = Train.builder().trainNumber("12658").trainName("Chennai Mail").trainType("MAIL_EXPRESS")
                .stationId(s5.getStationId()).departureTime("22:40").arrivalTime("21:50").platform(4)
                .totalCapacity(1200).sourceStation("SBC").destinationStation("MAS").build();

        Train t15 = Train.builder().trainNumber("12932").trainName("Ahmedabad Double Decker").trainType("SUPERFAST")
                .stationId(s6.getStationId()).departureTime("06:00").arrivalTime("05:30").platform(2)
                .totalCapacity(1500).sourceStation("ADI").destinationStation("MMCT").build();

        Train t16 = Train.builder().trainNumber("12986").trainName("Delhi Sarai Rohilla AC Double Decker").trainType("SUPERFAST")
                .stationId(s7.getStationId()).departureTime("06:00").arrivalTime("05:20").platform(1)
                .totalCapacity(1400).sourceStation("JP").destinationStation("DEE").build();

        Train t17 = Train.builder().trainNumber("12230").trainName("Lucknow Mail").trainType("SUPERFAST")
                .stationId(s8.getStationId()).departureTime("22:00").arrivalTime("21:10").platform(3)
                .totalCapacity(1300).sourceStation("LJN").destinationStation("NDLS").build();

        Train t18 = Train.builder().trainNumber("12723").trainName("Telangana Express").trainType("SUPERFAST")
                .stationId(s9.getStationId()).departureTime("06:00").arrivalTime("05:15").platform(5)
                .totalCapacity(1350).sourceStation("HYB").destinationStation("NDLS").build();

        Train t19 = Train.builder().trainNumber("12157").trainName("Hutatma Express").trainType("SUPERFAST")
                .stationId(s10.getStationId()).departureTime("17:55").arrivalTime("17:15").platform(3)
                .totalCapacity(1100).sourceStation("PUNE").destinationStation("SUR").build();

        // Extra trains to trigger peak 45-min overlapping rush at NDLS
        Train t20 = Train.builder().trainNumber("12004").trainName("Lucknow Swarna Shatabdi").trainType("SHATABDI")
                .stationId(s1.getStationId()).departureTime("06:10").arrivalTime("05:40").platform(3)
                .totalCapacity(1150).sourceStation("NDLS").destinationStation("LKO").build();

        Train t21 = Train.builder().trainNumber("14041").trainName("Mussoorie Express").trainType("MAIL_EXPRESS")
                .stationId(s1.getStationId()).departureTime("22:25").arrivalTime("21:40").platform(7)
                .totalCapacity(1000).sourceStation("DLI").destinationStation("DDN").build();

        List<Train> savedTrains = trainRepository.saveAll(List.of(
                t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21
        ));

        // 3. Realistic High-Density Reservations (35+ entries creating varied congestion)
        // High Congestion & Acute Bottleneck at NDLS (Peak Date 2026-04-27)
        Reservation r1 = Reservation.builder().pnrNumber("2458963214").trainId(savedTrains.get(0).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(850).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r2 = Reservation.builder().pnrNumber("2458963215").trainId(savedTrains.get(1).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(920).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r3 = Reservation.builder().pnrNumber("2458963216").trainId(savedTrains.get(19).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(780).coachType("EC").bookingStatus("CONFIRMED").build();

        Reservation r4 = Reservation.builder().pnrNumber("2458963217").trainId(savedTrains.get(2).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(650).coachType("2A").bookingStatus("CONFIRMED").build();

        Reservation r5 = Reservation.builder().pnrNumber("2458963218").trainId(savedTrains.get(3).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(520).coachType("3A").bookingStatus("RAC").build();

        // Legacy PNRs for backward compatibility (12345678, 12345679, etc.)
        Reservation r6 = Reservation.builder().pnrNumber("12345678").trainId(savedTrains.get(0).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(800).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r7 = Reservation.builder().pnrNumber("12345679").trainId(savedTrains.get(1).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(600).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r8 = Reservation.builder().pnrNumber("12345680").trainId(savedTrains.get(3).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(450).coachType("SL").bookingStatus("WAITLIST").build();

        // Mumbai Central (stationId=2) - MEDIUM Congestion
        Reservation r9 = Reservation.builder().pnrNumber("22345678").trainId(savedTrains.get(4).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(420).coachType("2A").bookingStatus("CONFIRMED").build();

        Reservation r10 = Reservation.builder().pnrNumber("22345679").trainId(savedTrains.get(5).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(380).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r11 = Reservation.builder().pnrNumber("8451239874").trainId(savedTrains.get(6).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(350).coachType("EC").bookingStatus("CONFIRMED").build();

        // Chennai Central (stationId=3) - LOW Congestion
        Reservation r12 = Reservation.builder().pnrNumber("32345678").trainId(savedTrains.get(7).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(160).coachType("3A").bookingStatus("CONFIRMED").build();

        Reservation r13 = Reservation.builder().pnrNumber("32345679").trainId(savedTrains.get(8).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(190).coachType("SL").bookingStatus("RAC").build();

        // Howrah Junction (stationId=4) - HIGH Congestion
        Reservation r14 = Reservation.builder().pnrNumber("42345678").trainId(savedTrains.get(9).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(950).coachType("1A").bookingStatus("CONFIRMED").build();

        Reservation r15 = Reservation.builder().pnrNumber("42345679").trainId(savedTrains.get(10).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(820).coachType("SL").bookingStatus("CONFIRMED").build();

        Reservation r16 = Reservation.builder().pnrNumber("9876543210").trainId(savedTrains.get(11).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(670).coachType("3A").bookingStatus("CONFIRMED").build();

        // Bangalore City (stationId=5) - MEDIUM Congestion
        Reservation r17 = Reservation.builder().pnrNumber("52345678").trainId(savedTrains.get(12).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(490).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r18 = Reservation.builder().pnrNumber("52345679").trainId(savedTrains.get(13).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(310).coachType("SL").bookingStatus("CONFIRMED").build();

        // Ahmedabad (stationId=6) - LOW
        Reservation r19 = Reservation.builder().pnrNumber("62345678").trainId(savedTrains.get(14).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(140).coachType("CC").bookingStatus("CONFIRMED").build();

        // Jaipur (stationId=7) - LOW
        Reservation r20 = Reservation.builder().pnrNumber("72345678").trainId(savedTrains.get(15).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(210).coachType("CC").bookingStatus("CONFIRMED").build();

        // Lucknow (stationId=8) - MEDIUM
        Reservation r21 = Reservation.builder().pnrNumber("82345678").trainId(savedTrains.get(16).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(680).coachType("SL").bookingStatus("CONFIRMED").build();

        // Hyderabad (stationId=9) - LOW
        Reservation r22 = Reservation.builder().pnrNumber("92345678").trainId(savedTrains.get(17).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(190).coachType("3A").bookingStatus("CONFIRMED").build();

        // Pune (stationId=10) - MEDIUM
        Reservation r23 = Reservation.builder().pnrNumber("10234567").trainId(savedTrains.get(18).getTrainId())
                .journeyDate("2026-04-27").reservedPassengers(540).coachType("CC").bookingStatus("CONFIRMED").build();

        // Second Date 2026-04-28 (Post-Rush Normalization)
        Reservation r24 = Reservation.builder().pnrNumber("12345681").trainId(savedTrains.get(0).getTrainId())
                .journeyDate("2026-04-28").reservedPassengers(220).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r25 = Reservation.builder().pnrNumber("12345682").trainId(savedTrains.get(1).getTrainId())
                .journeyDate("2026-04-28").reservedPassengers(170).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r26 = Reservation.builder().pnrNumber("22345680").trainId(savedTrains.get(4).getTrainId())
                .journeyDate("2026-04-28").reservedPassengers(110).coachType("2A").bookingStatus("CONFIRMED").build();

        Reservation r27 = Reservation.builder().pnrNumber("32345680").trainId(savedTrains.get(7).getTrainId())
                .journeyDate("2026-04-28").reservedPassengers(70).coachType("3A").bookingStatus("CONFIRMED").build();

        Reservation r28 = Reservation.builder().pnrNumber("42345680").trainId(savedTrains.get(9).getTrainId())
                .journeyDate("2026-04-28").reservedPassengers(380).coachType("1A").bookingStatus("CONFIRMED").build();

        // Third Date 2026-04-29 (Weekend Trends)
        Reservation r29 = Reservation.builder().pnrNumber("12345690").trainId(savedTrains.get(0).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(310).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r30 = Reservation.builder().pnrNumber("12345691").trainId(savedTrains.get(1).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(260).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r31 = Reservation.builder().pnrNumber("22345690").trainId(savedTrains.get(4).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(520).coachType("2A").bookingStatus("CONFIRMED").build();

        Reservation r32 = Reservation.builder().pnrNumber("42345690").trainId(savedTrains.get(9).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(410).coachType("1A").bookingStatus("CONFIRMED").build();

        Reservation r33 = Reservation.builder().pnrNumber("52345690").trainId(savedTrains.get(12).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(220).coachType("CC").bookingStatus("CONFIRMED").build();

        Reservation r34 = Reservation.builder().pnrNumber("32345690").trainId(savedTrains.get(7).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(110).coachType("3A").bookingStatus("CONFIRMED").build();

        Reservation r35 = Reservation.builder().pnrNumber("7412589630").trainId(savedTrains.get(19).getTrainId())
                .journeyDate("2026-04-29").reservedPassengers(450).coachType("EC").bookingStatus("CONFIRMED").build();

        reservationRepository.saveAll(List.of(
                r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20,
                r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34, r35
        ));
    }
}

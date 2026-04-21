package com.example.railway_congestion.model;

import jakarta.persistence.*;

    @Entity
    @Table(name = "station")
    public class Station {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int station_id;

        private String station_name;

        private String city;

        public int getStation_id() {
            return station_id;
        }

        public void setStation_id(int station_id) {
            this.station_id = station_id;
        }

        public String getStation_name() {
            return station_name;
        }

        public void setStation_name(String station_name) {
            this.station_name = station_name;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }
    }


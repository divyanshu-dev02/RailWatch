package com.example.railway_congestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RailwaycongestionApplication {

	public static void main(String[] args) {


            SpringApplication.run(RailwaycongestionApplication.class , args);
        }


}

package com.example.railway_congestion.controller;

import com.example.railway_congestion.service.CongestionService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController

public class CongestionController {

    private final CongestionService congestionService;

    public CongestionController(CongestionService congestionService) {
        this.congestionService = congestionService;
    }




    @GetMapping("/pnr/{pnr}")
    public String getStatusByPnr(@PathVariable String pnr){

        return congestionService.getStationStatusByPnr(pnr);
    }

}
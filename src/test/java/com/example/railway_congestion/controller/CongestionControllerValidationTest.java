package com.example.railway_congestion.controller;

import com.example.railway_congestion.config.GlobalExceptionHandler;
import com.example.railway_congestion.config.RequestCorrelationFilter;
import com.example.railway_congestion.config.SecurityHeadersFilter;
import com.example.railway_congestion.service.CongestionService;
import com.example.railway_congestion.repository.TrainRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CongestionControllerValidationTest {
    private final CongestionService service = mock(CongestionService.class);
    private final TrainRepository trainRepository = mock(TrainRepository.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new CongestionController(service, trainRepository))
            .setControllerAdvice(new GlobalExceptionHandler())
            .addFilters(new RequestCorrelationFilter(), new SecurityHeadersFilter())
            .build();

    @Test
    void rejectsMalformedDateWithStableError() throws Exception {
        mockMvc.perform(get("/api/dashboard").param("date", "not-a-date"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_DATE"))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.correlationId").isNotEmpty())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    void rejectsReversedHistoryRange() throws Exception {
        mockMvc.perform(get("/api/stations/1/history")
                        .param("from", "2026-04-28")
                        .param("to", "2026-04-27"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_DATE_RANGE"));
    }

    @Test
    void rejectsMalformedPnr() throws Exception {
        mockMvc.perform(get("/api/pnr/123%20bad"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_REQUEST"));
    }
}

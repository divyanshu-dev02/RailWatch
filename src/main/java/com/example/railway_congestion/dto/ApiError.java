package com.example.railway_congestion.dto;

import java.time.Instant;
import org.slf4j.MDC;

public record ApiError(String error, String message, int status, String timestamp, String correlationId) {
    public static ApiError of(String error, String message, int status) {
        return new ApiError(error, message, status, Instant.now().toString(), MDC.get("requestId"));
    }
}

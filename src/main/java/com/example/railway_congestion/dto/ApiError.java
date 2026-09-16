package com.example.railway_congestion.dto;

import java.time.Instant;

public record ApiError(String error, String message, int status, String timestamp) {
    public static ApiError of(String error, String message, int status) {
        return new ApiError(error, message, status, Instant.now().toString());
    }
}

package com.example.railway_congestion.importer;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Component
public class CsvPassengerObservationProvider implements PassengerObservationProvider {
    private static final String HEADER =
            "source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity";

    @Override
    public String sourceType() {
        return "CSV";
    }

    @Override
    public List<PassengerObservationRow> read(InputStream input) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            if (!HEADER.equals(header)) {
                throw new IllegalArgumentException("CSV header must be: " + HEADER);
            }

            List<PassengerObservationRow> rows = new ArrayList<>();
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.isBlank()) {
                    continue;
                }
                String[] values = line.split(",", -1);
                if (values.length != 7) {
                    throw new IllegalArgumentException("CSV line " + lineNumber + " must contain 7 columns");
                }
                try {
                    rows.add(new PassengerObservationRow(
                            required(values[0], "source_record_id", lineNumber),
                            Integer.parseInt(required(values[1], "station_id", lineNumber)),
                            optionalInteger(values[2], "train_id", lineNumber),
                            LocalDate.parse(required(values[3], "journey_date", lineNumber)),
                            Instant.parse(required(values[4], "observed_at", lineNumber)),
                            parseNonNegative(values[5], "passenger_count", lineNumber),
                            optionalNonNegative(values[6], "passenger_capacity", lineNumber)
                    ));
                } catch (NumberFormatException | DateTimeParseException exception) {
                    throw new IllegalArgumentException("CSV line " + lineNumber + " contains an invalid value", exception);
                }
            }
            return rows;
        }
    }

    private String required(String value, String field, int lineNumber) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("CSV line " + lineNumber + " is missing " + field);
        }
        return value.trim();
    }

    private Integer optionalInteger(String value, String field, int lineNumber) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("CSV line " + lineNumber + " contains an invalid " + field, exception);
        }
    }

    private int parseNonNegative(String value, String field, int lineNumber) {
        int parsed = Integer.parseInt(required(value, field, lineNumber));
        if (parsed < 0) {
            throw new IllegalArgumentException("CSV line " + lineNumber + " has a negative " + field);
        }
        return parsed;
    }

    private Integer optionalNonNegative(String value, String field, int lineNumber) {
        Integer parsed = optionalInteger(value, field, lineNumber);
        if (parsed != null && parsed < 0) {
            throw new IllegalArgumentException("CSV line " + lineNumber + " has a negative " + field);
        }
        return parsed;
    }
}

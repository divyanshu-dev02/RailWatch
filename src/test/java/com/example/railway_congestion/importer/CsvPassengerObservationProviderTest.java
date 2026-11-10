package com.example.railway_congestion.importer;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CsvPassengerObservationProviderTest {
    private final CsvPassengerObservationProvider provider = new CsvPassengerObservationProvider();

    @Test
    void parsesCanonicalCsvRows() throws Exception {
        String csv = """
                source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity
                obs-1,1,2,2026-04-27,2026-04-27T06:00:00Z,420,800
                """;

        var rows = provider.read(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)));

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).sourceRecordId()).isEqualTo("obs-1");
        assertThat(rows.get(0).passengerCount()).isEqualTo(420);
    }

    @Test
    void rejectsNegativePassengerCounts() {
        String csv = """
                source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity
                obs-1,1,2,2026-04-27,2026-04-27T06:00:00Z,-1,800
                """;

        assertThatThrownBy(() -> provider.read(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("negative passenger_count");
    }
}

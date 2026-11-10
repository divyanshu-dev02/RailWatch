package com.example.railway_congestion.service;

import com.example.railway_congestion.importer.CsvPassengerObservationProvider;
import com.example.railway_congestion.model.ImportRun;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.model.Train;
import com.example.railway_congestion.repository.ImportRunRepository;
import com.example.railway_congestion.repository.PassengerObservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ImportServiceTest {
    private final ImportRunRepository importRunRepository = mock(ImportRunRepository.class);
    private final PassengerObservationRepository observationRepository = mock(PassengerObservationRepository.class);
    private final StationRepository stationRepository = mock(StationRepository.class);
    private final TrainRepository trainRepository = mock(TrainRepository.class);
    private final ImportService service = new ImportService(importRunRepository, observationRepository,
            stationRepository, trainRepository, new CsvPassengerObservationProvider());

    @Test
    void importsValidRowsAndCountsDuplicates() {
        when(importRunRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(stationRepository.findById(1)).thenReturn(Optional.of(new Station(1, "New Delhi", "Delhi")));
        Train train = new Train();
        train.setTrainId(2);
        when(trainRepository.findById(2)).thenReturn(Optional.of(train));
        when(observationRepository.existsByProviderCodeAndSourceRecordIdAndObservedAt(
                eq("fixture"), eq("obs-1"), any(Instant.class))).thenReturn(false);
        when(observationRepository.existsByProviderCodeAndSourceRecordIdAndObservedAt(
                eq("fixture"), eq("obs-2"), any(Instant.class))).thenReturn(true);

        MockMultipartFile file = csv("""
                obs-1,1,2,2026-04-27,2026-04-27T06:00:00Z,420,800
                obs-2,1,2,2026-04-27,2026-04-27T06:05:00Z,430,800
                """);

        ImportRun result = service.importCsv("fixture", file);

        assertThat(result.getStatus()).isEqualTo("COMPLETED");
        assertThat(result.getRowsReceived()).isEqualTo(2);
        assertThat(result.getRowsAccepted()).isEqualTo(1);
        assertThat(result.getRowsDuplicate()).isEqualTo(1);
        verify(observationRepository).save(any());
    }

    @Test
    void rejectsRowsForUnknownStationsWithoutSavingObservation() {
        when(importRunRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(stationRepository.findById(99)).thenReturn(Optional.empty());

        ImportRun result = service.importCsv("fixture", csv("""
                obs-1,99,,2026-04-27,2026-04-27T06:00:00Z,420,
                """));

        assertThat(result.getStatus()).isEqualTo("COMPLETED_WITH_ERRORS");
        assertThat(result.getRowsRejected()).isEqualTo(1);
        verify(observationRepository, never()).save(any());
    }

    private MockMultipartFile csv(String rows) {
        String content = """
                source_record_id,station_id,train_id,journey_date,observed_at,passenger_count,passenger_capacity
                %s""".formatted(rows);
        return new MockMultipartFile("file", "observations.csv", "text/csv", content.getBytes());
    }
}

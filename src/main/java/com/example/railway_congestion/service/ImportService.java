package com.example.railway_congestion.service;

import com.example.railway_congestion.importer.PassengerObservationProvider;
import com.example.railway_congestion.importer.PassengerObservationRow;
import com.example.railway_congestion.model.ImportRun;
import com.example.railway_congestion.model.PassengerObservation;
import com.example.railway_congestion.repository.ImportRunRepository;
import com.example.railway_congestion.repository.PassengerObservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

@Service
public class ImportService {
    private final ImportRunRepository importRunRepository;
    private final PassengerObservationRepository observationRepository;
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final PassengerObservationProvider csvProvider;

    public ImportService(ImportRunRepository importRunRepository,
                         PassengerObservationRepository observationRepository,
                         StationRepository stationRepository,
                         TrainRepository trainRepository,
                         PassengerObservationProvider csvProvider) {
        this.importRunRepository = importRunRepository;
        this.observationRepository = observationRepository;
        this.stationRepository = stationRepository;
        this.trainRepository = trainRepository;
        this.csvProvider = csvProvider;
    }

    public ImportRun importCsv(String providerCode, MultipartFile file) {
        if (providerCode == null || !providerCode.matches("[A-Za-z0-9._-]{1,64}")) {
            throw new IllegalArgumentException("Provider code must contain 1-64 letters, numbers, dots, underscores, or hyphens");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("A non-empty CSV file is required");
        }

        ImportRun run = new ImportRun();
        run.setProviderCode(providerCode);
        run.setSourceType(csvProvider.sourceType());
        run.setStartedAt(Instant.now());
        run.setStatus("PROCESSING");
        run = importRunRepository.save(run);

        try {
            List<PassengerObservationRow> rows = csvProvider.read(file.getInputStream());
            run.setRowsReceived(rows.size());
            for (PassengerObservationRow row : rows) {
                processRow(providerCode, run, row);
            }
            run.setStatus(run.getRowsRejected() > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED");
        } catch (IOException | IllegalArgumentException exception) {
            run.setStatus("FAILED");
            run.setErrorMessage(safeMessage(exception));
        }
        run.setCompletedAt(Instant.now());
        return importRunRepository.save(run);
    }

    private void processRow(String providerCode, ImportRun run, PassengerObservationRow row) {
        if (row.passengerCapacity() != null && row.passengerCount() > row.passengerCapacity()) {
            reject(run);
            return;
        }
        if (stationRepository.findById(row.stationId()).isEmpty()
                || (row.trainId() != null && trainRepository.findById(row.trainId()).isEmpty())) {
            reject(run);
            return;
        }
        if (observationRepository.existsByProviderCodeAndSourceRecordIdAndObservedAt(
                providerCode, row.sourceRecordId(), row.observedAt())) {
            run.setRowsDuplicate(run.getRowsDuplicate() + 1);
            return;
        }

        PassengerObservation observation = new PassengerObservation();
        observation.setJourneyDate(row.journeyDate());
        observation.setObservedAt(row.observedAt());
        observation.setPassengerCount(row.passengerCount());
        observation.setPassengerCapacity(row.passengerCapacity());
        observation.setProviderCode(providerCode);
        observation.setSourceRecordId(row.sourceRecordId());
        observation.setQualityStatus("VALID");
        stationRepository.findById(row.stationId()).ifPresent(observation::setStation);
        if (row.trainId() != null) {
            trainRepository.findById(row.trainId()).ifPresent(observation::setTrain);
        }
        observation.setImportRun(run);
        observationRepository.save(observation);
        run.setRowsAccepted(run.getRowsAccepted() + 1);
    }

    private void reject(ImportRun run) {
        run.setRowsRejected(run.getRowsRejected() + 1);
    }

    private String safeMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? exception.getClass().getSimpleName() : message.substring(0, Math.min(message.length(), 1000));
    }
}

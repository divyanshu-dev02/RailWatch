package com.example.railway_congestion.dto;

import com.example.railway_congestion.model.ImportRun;

import java.time.Instant;

public record ImportRunResponse(
        long importRunId,
        String providerCode,
        String sourceType,
        Instant startedAt,
        Instant completedAt,
        Instant sourceObservedAt,
        String status,
        int rowsReceived,
        int rowsAccepted,
        int rowsRejected,
        int rowsDuplicate,
        String errorMessage
) {
    public static ImportRunResponse from(ImportRun run) {
        return new ImportRunResponse(run.getImportRunId(), run.getProviderCode(), run.getSourceType(),
                run.getStartedAt(), run.getCompletedAt(), run.getSourceObservedAt(), run.getStatus(),
                run.getRowsReceived(), run.getRowsAccepted(), run.getRowsRejected(), run.getRowsDuplicate(),
                run.getErrorMessage());
    }
}

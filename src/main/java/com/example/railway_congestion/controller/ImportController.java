package com.example.railway_congestion.controller;

import com.example.railway_congestion.dto.ImportRunResponse;
import com.example.railway_congestion.model.ImportRun;
import com.example.railway_congestion.repository.ImportRunRepository;
import com.example.railway_congestion.service.ImportService;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/imports")
public class ImportController {
    private final ImportService importService;
    private final ImportRunRepository importRunRepository;

    public ImportController(ImportService importService, ImportRunRepository importRunRepository) {
        this.importService = importService;
        this.importRunRepository = importRunRepository;
    }

    @PostMapping(value = "/csv/{providerCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportRunResponse> importCsv(
            @PathVariable @Pattern(regexp = "[A-Za-z0-9._-]{1,64}") String providerCode,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.accepted().body(ImportRunResponse.from(importService.importCsv(providerCode, file)));
    }

    @GetMapping("/{importRunId}")
    public ResponseEntity<ImportRunResponse> getImportRun(@PathVariable long importRunId) {
        return importRunRepository.findById(importRunId)
                .map(ImportRunResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

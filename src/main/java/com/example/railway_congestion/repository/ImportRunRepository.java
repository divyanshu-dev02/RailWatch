package com.example.railway_congestion.repository;

import com.example.railway_congestion.model.ImportRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImportRunRepository extends JpaRepository<ImportRun, Long> {
    Optional<ImportRun> findTopByProviderCodeOrderByStartedAtDesc(String providerCode);
}

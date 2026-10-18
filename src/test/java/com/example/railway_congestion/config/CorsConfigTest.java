package com.example.railway_congestion.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.junit.jupiter.api.Assertions.assertThrows;

class CorsConfigTest {
    @Test
    void rejectsWildcardOrigin() {
        CorsConfig config = new CorsConfig();
        org.springframework.test.util.ReflectionTestUtils.setField(config, "allowedOrigins", "*");
        CorsRegistry registry = new CorsRegistry();

        assertThrows(IllegalStateException.class, () -> config.corsConfigurer().addCorsMappings(registry));
    }
}

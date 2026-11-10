package com.example.railway_congestion.importer;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PassengerObservationProvider {
    String sourceType();

    List<PassengerObservationRow> read(InputStream input) throws IOException;
}

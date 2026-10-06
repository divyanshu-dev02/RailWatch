package com.example.railway_congestion.service;

import com.example.railway_congestion.dto.TrendPoint;
import com.example.railway_congestion.model.Station;
import com.example.railway_congestion.repository.ReservationRepository;
import com.example.railway_congestion.repository.StationRepository;
import com.example.railway_congestion.repository.TrainRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CongestionServiceTest {
    private final ReservationRepository reservationRepository = mock(ReservationRepository.class);
    private final TrainRepository trainRepository = mock(TrainRepository.class);
    private final StationRepository stationRepository = mock(StationRepository.class);
    private final CongestionService service = new CongestionService(
            reservationRepository, trainRepository, stationRepository);

    @Test
    void stationHistoryOnlyReturnsTheRequestedStationsTrend() {
        int stationId = 7;
        List<TrendPoint> expected = List.of(new TrendPoint("2026-04-27", 125));
        when(stationRepository.findById(stationId)).thenReturn(Optional.of(new Station(stationId, "Jaipur", "Jaipur")));
        when(reservationRepository.getPassengerTrend(stationId, "2026-04-27", "2026-04-29"))
                .thenReturn(expected);

        List<TrendPoint> actual = service.getStationHistory(stationId, "2026-04-27", "2026-04-29");

        assertThat(actual).isEqualTo(expected);
        verify(reservationRepository).getPassengerTrend(stationId, "2026-04-27", "2026-04-29");
        verifyNoMoreInteractions(reservationRepository);
    }

    @Test
    void stationHistoryReturnsNullForUnknownStationWithoutQueryingReservations() {
        int stationId = 99;
        when(stationRepository.findById(stationId)).thenReturn(Optional.empty());

        assertThat(service.getStationHistory(stationId, "2026-04-27", "2026-04-29")).isNull();

        verifyNoInteractions(reservationRepository);
    }
}

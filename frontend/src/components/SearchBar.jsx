import { useEffect, useState } from 'react';
import { getApiErrorMessage, getStations } from '../services/api';

const SearchBar = ({ onSearchPnr, onSearchStation, loading }) => {
  const [pnr, setPnr] = useState('');
  const [stationId, setStationId] = useState('');
  const [date, setDate] = useState('2026-04-27');
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('pnr');
  const [stationsLoading, setStationsLoading] = useState(true);
  const [stationsError, setStationsError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getStations({ signal: controller.signal }).then(setStations).catch((err) => {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') setStationsError(getApiErrorMessage(err, 'Stations are unavailable.'));
    }).finally(() => {
      if (!controller.signal.aborted) setStationsLoading(false);
    });
    return () => controller.abort();
  }, []);

  return (
    <div className="search-card">
      <div className="search-tabs" role="tablist" aria-label="Search type">
        <button className={activeTab === 'pnr' ? 'active' : ''} type="button" role="tab" aria-selected={activeTab === 'pnr'} aria-controls="pnr-panel" onClick={() => setActiveTab('pnr')}>PNR lookup <span>01</span></button>
        <button className={activeTab === 'station' ? 'active' : ''} type="button" role="tab" aria-selected={activeTab === 'station'} aria-controls="station-panel" onClick={() => setActiveTab('station')}>Station pulse <span>02</span></button>
      </div>
      {activeTab === 'pnr' ? (
        <form id="pnr-panel" className="search-form" role="tabpanel" onSubmit={(event) => { event.preventDefault(); if (pnr.trim()) onSearchPnr(pnr.trim()); }}>
          <label htmlFor="pnr-input">PNR number <span>8–20 characters</span></label>
          <div className="form-row"><input id="pnr-input" name="pnr" type="text" inputMode="numeric" autoComplete="off" spellCheck="false" maxLength="20" value={pnr} onChange={(event) => setPnr(event.target.value)} placeholder="e.g. 12345678…" required /><button className="primary-button" type="submit" disabled={loading || !pnr.trim()}>{loading ? 'Searching…' : 'Search PNR'} <span aria-hidden="true">↗</span></button></div>
          <p className="form-hint">Enter a booking reference to see its station congestion context.</p>
        </form>
      ) : (
        <form id="station-panel" className="search-form" role="tabpanel" onSubmit={(event) => { event.preventDefault(); if (stationId && date) onSearchStation(Number(stationId), date); }}>
          <div className="form-grid">
            <div><label htmlFor="station-select">Station</label><select id="station-select" name="station" value={stationId} onChange={(event) => setStationId(event.target.value)} required disabled={stationsLoading}><option value="">{stationsLoading ? 'Loading stations…' : 'Choose a station…'}</option>{stations.map((station) => <option key={station.stationId} value={station.stationId}>{station.stationName} · {station.city}</option>)}</select></div>
            <div><label htmlFor="date-input">Journey date</label><input id="date-input" name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div>
          </div>
          {stationsError && <p className="field-error" role="alert">{stationsError}</p>}
          <button className="primary-button full-button" type="submit" disabled={loading || !stationId || !date}>{loading ? 'Loading pulse…' : 'View station pulse'} <span aria-hidden="true">↗</span></button>
        </form>
      )}
    </div>
  );
};

export default SearchBar;

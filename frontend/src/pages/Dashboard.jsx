import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';
const CongestionChart = lazy(() => import('../components/CongestionChart'));
import {
  getApiErrorMessage,
  getCongestionByPnr,
  getDashboard,
  getDemoTick,
  getStreamUrl,
} from '../services/api';

const DEFAULT_DATE = '2026-04-27';
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
const emptyDashboard = { totalPassengers: 0, lowStations: 0, mediumStations: 0, highStations: 0, stations: [], trend: [], lastUpdated: null };

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [date, setDate] = useState(DEFAULT_DATE);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [resultData, setResultData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const requestRef = useRef(null);

  const loadDashboard = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setDashboardLoading(true);
    try {
      setDashboard(await getDashboard(date, { signal: controller.signal }));
      setError(null);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(getApiErrorMessage(err, 'Unable to load dashboard data. Check the connection and try again.'));
      }
    } finally {
      if (!controller.signal.aborted) setDashboardLoading(false);
    }
  }, [date]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadDashboard(); }, 0);
    return () => {
      window.clearTimeout(timer);
      requestRef.current?.abort();
    };
  }, [loadDashboard]);

  useEffect(() => {
    let source;
    let reconnectTimer;
    let attempts = 0;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      source = new EventSource(getStreamUrl());
      source.onopen = () => {
        attempts = 0;
        setLive(true);
      };
      source.onerror = () => {
        source.close();
        setLive(false);
        if (!stopped && attempts < 5) {
          attempts += 1;
          reconnectTimer = window.setTimeout(connect, Math.min(1000 * 2 ** attempts, 15000));
        }
      };
      source.addEventListener('congestion-update', (event) => {
        try {
          const update = JSON.parse(event.data);
          if (update.journeyDate !== date) return;
          setDashboard((current) => {
            const previous = current.stations.find((station) => station.stationId === update.stationId);
            const stations = current.stations.map((station) => station.stationId === update.stationId ? update : station);
            const totalPassengers = current.totalPassengers + update.totalPassengers - (previous?.totalPassengers || 0);
            return {
              ...current,
              stations,
              totalPassengers,
              lowStations: stations.filter((station) => station.congestionLevel === 'LOW').length,
              mediumStations: stations.filter((station) => station.congestionLevel === 'MEDIUM').length,
              highStations: stations.filter((station) => station.congestionLevel === 'HIGH').length,
              lastUpdated: update.eventTimestamp,
            };
          });
        } catch {
          setLive(false);
        }
      });
    };
    connect();
    return () => {
      stopped = true;
      window.clearTimeout(reconnectTimer);
      source?.close();
    };
  }, [date]);

  const handlePnrSearch = async (pnr) => {
    setSearchLoading(true);
    setError(null);
    setResultData(null);
    try {
      setResultData(await getCongestionByPnr(pnr));
    } catch (err) {
      setError(getApiErrorMessage(err, 'PNR not found. Check the number and try again.'));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStationSearch = (stationId, selectedDate) => {
    setDate(selectedDate);
    setResultData(null);
    document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDemoTick = async () => {
    setDemoLoading(true);
    try {
      await getDemoTick();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Demo update unavailable right now.'));
    } finally {
      setDemoLoading(false);
    }
  };

  const chartData = useMemo(() => (dashboard.stations || []).map((station) => ({
    name: station.stationName.replace(' Railway Station', '').replace(' Junction', ' Jn'),
    passengers: station.totalPassengers,
  })), [dashboard.stations]);

  const hasData = dashboard.stations.length > 0;

  return (
    <div className={`${darkMode ? 'theme-dark' : 'theme-light'} min-h-screen overflow-x-hidden`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main id="main-content" className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <header className="hero-shell">
          <div className="status-pill" role="status" aria-live="polite">
            <span className={`status-dot ${live ? 'status-dot-live' : ''}`} aria-hidden="true" />
            {live ? 'Live monitoring connected' : 'Live monitoring reconnecting'}
          </div>
          <p className="eyebrow">Railway intelligence platform</p>
          <h1>See the station ahead.<br /><span>Move with confidence.</span></h1>
          <p className="hero-copy">Real-time passenger analytics and congestion signals for calmer, better-informed journeys.</p>
        </header>

        <section aria-labelledby="overview-heading" className="mb-10">
          <div className="section-heading">
            <div><p className="eyebrow">Network overview</p><h2 id="overview-heading">Today at a glance</h2></div>
            <span className="date-chip">Data date · {date}</span>
          </div>
          <div className="kpi-grid">
            <Kpi label="Passengers tracked" value={dashboard.totalPassengers} tone="indigo" />
            <Kpi label="Low congestion" value={dashboard.lowStations} tone="green" />
            <Kpi label="Medium congestion" value={dashboard.mediumStations} tone="amber" />
            <Kpi label="High congestion" value={dashboard.highStations} tone="red" />
          </div>
        </section>

        <section aria-labelledby="search-heading" className="mb-10">
          <div className="section-heading compact"><div><p className="eyebrow">Explore the network</p><h2 id="search-heading">Find a station or PNR</h2></div></div>
          <SearchBar onSearchPnr={handlePnrSearch} onSearchStation={handleStationSearch} loading={searchLoading} />
          {error && <div className="alert alert-error" role="alert"><strong>Something went wrong.</strong><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label="Dismiss error">Dismiss</button></div>}
          {resultData && <ResultCard data={resultData} />}
        </section>

        <section id="analytics" aria-labelledby="analytics-heading" className="scroll-mt-24">
          <div className="section-heading"><div><p className="eyebrow">Live analytics</p><h2 id="analytics-heading">Congestion pulse</h2></div>{dashboard.lastUpdated && <span className="muted">Updated {new Date(dashboard.lastUpdated).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>}</div>
          {dashboardLoading && !hasData ? <DashboardSkeleton /> : hasData ? <Suspense fallback={<DashboardSkeleton />}><CongestionChart chartData={chartData} trendData={dashboard.trend} /></Suspense> : <EmptyState onRetry={loadDashboard} />}
        </section>
        {demoMode && <button className="demo-button" type="button" onClick={handleDemoTick} disabled={demoLoading}>{demoLoading ? 'Simulating…' : 'Simulate update'}</button>}
      </main>
      <footer className="site-footer"><span>RailWatch</span><span>Passenger intelligence, made visible.</span></footer>
    </div>
  );
};

const Kpi = ({ label, value, tone }) => <article className={`kpi-card kpi-${tone}`}><p>{label}</p><strong>{Number(value || 0).toLocaleString()}</strong><span className="kpi-line" aria-hidden="true" /></article>;
const DashboardSkeleton = () => <div className="chart-grid" aria-label="Loading analytics" role="status"><div className="chart-skeleton skeleton" /><div className="chart-skeleton skeleton" /></div>;
const EmptyState = ({ onRetry }) => <div className="empty-state"><div className="empty-icon" aria-hidden="true">◌</div><h3>No station data yet</h3><p>We couldn’t find live data for this date. Try again or choose another date.</p><button className="secondary-button" type="button" onClick={onRetry}>Retry loading</button></div>;

export default Dashboard;

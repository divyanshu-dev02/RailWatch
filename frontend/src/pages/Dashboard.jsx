import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';
import CongestionChart from '../components/CongestionChart';
import { getCongestionByPnr, getDashboard, getDemoTick, getStreamUrl } from '../services/api';

const DEFAULT_DATE = '2026-04-27';
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

const emptyDashboard = { totalPassengers: 0, lowStations: 0, mediumStations: 0, highStations: 0, stations: [], trend: [], lastUpdated: null };

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [date, setDate] = useState(DEFAULT_DATE);
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboard(date);
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load live dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadDashboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  useEffect(() => {
    const source = new EventSource(getStreamUrl());
    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);
    source.addEventListener('congestion-update', (event) => {
      const update = JSON.parse(event.data);
      if (update.journeyDate !== date) return;
      setDashboard((current) => {
        const previous = current.stations.find((station) => station.stationId === update.stationId);
        const stations = current.stations.map((station) => station.stationId === update.stationId ? update : station);
        const totalPassengers = current.totalPassengers + (update.totalPassengers - (previous?.totalPassengers || 0));
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
    });
    return () => source.close();
  }, [date]);

  const handlePnrSearch = async (pnr) => {
    setLoading(true); setError(null); setResultData(null);
    try { setResultData(await getCongestionByPnr(pnr)); }
    catch (err) { setError(err.response?.data?.message || err.response?.data?.error || 'PNR not found.'); }
    finally { setLoading(false); }
  };

  const handleStationSearch = async (stationId, selectedDate) => {
    setDate(selectedDate);
    setResultData(null);
  };

  const chartData = useMemo(() => (dashboard.stations || []).map((station) => ({
    name: station.stationName.replace(' Railway Station', '').replace(' Junction', ' Jn'),
    passengers: station.totalPassengers,
  })), [dashboard.stations]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {darkMode && <div className="fixed inset-0 z-0 bg-gradient-dark opacity-80" />}
      <div className="relative z-10 font-sans">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="dashboard" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 pt-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-6">
              <span className={`w-2 h-2 rounded-full ${live ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
              {live ? 'Live monitoring connected' : 'Connecting to live monitoring'}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">Smart Railway Station<br /><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Congestion Monitor</span></h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Real-time passenger analytics and congestion intelligence for railway operations.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
            <Kpi label="Passengers" value={dashboard.totalPassengers} tone="text-indigo-300" />
            <Kpi label="Low congestion" value={dashboard.lowStations} tone="text-emerald-400" />
            <Kpi label="Medium congestion" value={dashboard.mediumStations} tone="text-amber-400" />
            <Kpi label="High congestion" value={dashboard.highStations} tone="text-red-400" />
          </div>

          <SearchBar onSearchPnr={handlePnrSearch} onSearchStation={handleStationSearch} loading={loading} />
          {error && <div className="max-w-3xl mx-auto mt-6 glass border-red-500/30 bg-red-500/10 text-red-300 px-6 py-4 rounded-xl">{error}</div>}
          {loading && !dashboard.stations.length && <div className="max-w-3xl mx-auto mt-8 glass-card p-8 text-center text-gray-400">Loading live station data…</div>}
          {!loading && resultData && <ResultCard data={resultData} />}

          <CongestionChart chartData={chartData} trendData={dashboard.trend} />
          <div className="max-w-5xl mx-auto mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>Data date: {date}</span>
            <span>{dashboard.lastUpdated ? `Last updated ${new Date(dashboard.lastUpdated).toLocaleTimeString()}` : 'Waiting for update'}</span>
            {demoMode && <button onClick={() => getDemoTick()} className="text-indigo-300 hover:text-white">Simulate event</button>}
          </div>
        </main>
        <footer className="border-t border-white/5 py-8 mt-12"><p className="text-center text-gray-500 text-sm">RailWatch · Portfolio analytics showcase · Demo stream is simulated operational data</p></footer>
      </div>
    </div>
  );
};

const Kpi = ({ label, value, tone }) => <div className="glass-card p-4"><p className="text-xs uppercase tracking-wider text-gray-500">{label}</p><p className={`text-2xl font-bold mt-2 ${tone}`}>{Number(value || 0).toLocaleString()}</p></div>;

export default Dashboard;

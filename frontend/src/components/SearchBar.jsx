import { useState, useEffect } from 'react';
import { getStations } from '../services/api';

const SearchBar = ({ onSearchPnr, onSearchStation, loading }) => {
  const [pnr, setPnr] = useState('');
  const [stationId, setStationId] = useState('');
  const [date, setDate] = useState('2026-04-27');
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState('pnr');
  const [stationsLoading, setStationsLoading] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      setStationsLoading(true);
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        console.error('Failed to load stations:', err);
      } finally {
        setStationsLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handlePnrSearch = (e) => {
    e.preventDefault();
    if (pnr.trim()) {
      onSearchPnr(pnr.trim());
    }
  };

  const handleStationSearch = (e) => {
    e.preventDefault();
    if (stationId && date) {
      onSearchStation(parseInt(stationId), date);
    }
  };

  return (
    <div id="search" className="max-w-3xl mx-auto animate-fade-in-up delay-200">
      <div className="glass-card p-6 sm:p-8">
        {/* Tab Switcher */}
        <div className="flex rounded-xl overflow-hidden mb-6 glass">
          <button
            onClick={() => setActiveTab('pnr')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ${
              activeTab === 'pnr'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🔍 Search by PNR
          </button>
          <button
            onClick={() => setActiveTab('station')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ${
              activeTab === 'station'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🏢 Search by Station
          </button>
        </div>

        {/* PNR Search */}
        {activeTab === 'pnr' && (
          <form onSubmit={handlePnrSearch} className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter PNR Number
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  id="pnr-input"
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="e.g. 12345678"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !pnr.trim()}
                className="btn-primary px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: 12345678, 22345678, 42345678, 52345678
            </p>
          </form>
        )}

        {/* Station + Date Search */}
        {activeTab === 'station' && (
          <form onSubmit={handleStationSearch} className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Station
                </label>
                <select
                  id="station-select"
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-gray-900">
                    {stationsLoading ? 'Loading stations...' : '-- Choose a Station --'}
                  </option>
                  {stations.map((station) => (
                    <option
                      key={station.stationId}
                      value={station.stationId}
                      className="bg-gray-900"
                    >
                      {station.stationName} — {station.city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Journey Date
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !stationId || !date}
              className="w-full btn-primary py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Check Congestion
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

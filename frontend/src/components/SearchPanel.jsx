import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Train, Loader2, ArrowRight } from 'lucide-react';
import { getStations } from '../services/api';

const SearchPanel = ({ onSearchPnr, onSearchStation, loading }) => {
  const [activeTab, setActiveTab] = useState('pnr');
  const [pnr, setPnr] = useState('');
  const [stationId, setStationId] = useState('');
  const [date, setDate] = useState('2026-04-27');
  const [stations, setStations] = useState([]);
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
    if (pnr.trim()) onSearchPnr(pnr.trim());
  };

  const handleStationSearch = (e) => {
    e.preventDefault();
    if (stationId && date) onSearchStation(parseInt(stationId), date);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      id="search"
      className="max-w-4xl mx-auto relative z-20"
    >
      <div className="glass-panel p-2 rounded-3xl overflow-hidden relative">
        {/* Glow behind the panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
        
        {/* Modern Tab Switcher */}
        <div className="flex p-1 bg-black/40 rounded-2xl mb-4 relative z-10 w-fit mx-auto lg:mx-0">
          <TabButton 
            active={activeTab === 'pnr'} 
            onClick={() => setActiveTab('pnr')}
            icon={<Train className="w-4 h-4" />}
            label="PNR Prediction"
          />
          <TabButton 
            active={activeTab === 'station'} 
            onClick={() => setActiveTab('station')}
            icon={<MapPin className="w-4 h-4" />}
            label="Station Analytics"
          />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 relative z-10 transition-all duration-300">
          <AnimatePresence mode="wait">
            {activeTab === 'pnr' && (
              <motion.form 
                key="pnr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handlePnrSearch}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value)}
                      placeholder="Enter 10-digit PNR (e.g. 12345678)"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all duration-300 shadow-inner"
                    />
                  </div>
                  <SubmitButton loading={loading} disabled={!pnr.trim()} />
                </div>
              </motion.form>
            )}

            {activeTab === 'station' && (
              <motion.form 
                key="station"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleStationSearch}
                className="flex flex-col lg:flex-row gap-4"
              >
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all duration-300 appearance-none cursor-pointer glass-dropdown"
                  >
                    <option value="" disabled className="text-gray-500">
                      {stationsLoading ? 'Fetching Live Stations...' : 'Select Station Origin'}
                    </option>
                    {stations.map((s) => (
                      <option key={s.stationId} value={s.stationId} className="bg-[#13131c] text-white">
                        {s.stationName} - {s.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all duration-300"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <SubmitButton loading={loading} disabled={!stationId || !date} />
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative px-5 py-2.5 rounded-xl text-sm justify-center font-semibold flex items-center gap-2 transition-all duration-300 ${
      active ? 'text-white' : 'text-gray-400 hover:text-white'
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">{icon} {label}</span>
  </button>
);

const SubmitButton = ({ loading, disabled }) => (
  <button
    type="submit"
    disabled={disabled || loading}
    className="lg:w-auto w-full btn-premium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold flex justify-center items-center gap-2 tracking-wide shadow-lg shadow-indigo-500/25"
  >
    {loading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Analyzing...
      </>
    ) : (
      <>
        Execute Search <ArrowRight className="w-4 h-4 ml-1" />
      </>
    )}
  </button>
);

export default SearchPanel;

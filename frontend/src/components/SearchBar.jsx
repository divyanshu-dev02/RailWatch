import React, { useState, useEffect } from "react";
import { Search, Building2, Calendar, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { getStations } from "../services/api";

const SearchBar = ({ onSearchPnr, onSearchStation, loading }) => {
  const [pnr, setPnr] = useState("2458963214");
  const [stationId, setStationId] = useState("1");
  const [date, setDate] = useState("2026-04-27");
  const [stations, setStations] = useState([]);
  const [activeTab, setActiveTab] = useState("pnr");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        if (data && data.length > 0) {
          setStations(data);
          setStationId(String(data[0].stationId));
        }
      } catch (err) {
        console.error("Failed to load stations:", err);
      }
    };
    fetchStations();
  }, []);

  const handlePnrSubmit = (e) => {
    e?.preventDefault();
    if (pnr.trim()) {
      onSearchPnr(pnr.trim());
    }
  };

  const handleStationSubmit = (e) => {
    e?.preventDefault();
    if (stationId && date) {
      onSearchStation(parseInt(stationId, 10), date);
    }
  };

  const demoPnrs = [
    { label: "NDLS Peak (High)", pnr: "2458963214", type: "high" },
    { label: "NDLS Legacy", pnr: "12345678", type: "high" },
    { label: "Mumbai (Med)", pnr: "22345678", type: "med" },
    { label: "Howrah (High)", pnr: "42345678", type: "high" },
    { label: "Chennai (Low)", pnr: "32345678", type: "low" },
    { label: "Bangalore (Med)", pnr: "52345678", type: "med" },
  ];

  return (
    <div id="search" className="max-w-4xl mx-auto">
      <div className="glass-card p-6 sm:p-8 border border-white/10 shadow-2xl relative">
        {/* Tab Switcher */}
        <div className="flex rounded-xl overflow-hidden mb-6 bg-slate-900/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("pnr")}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "pnr"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            Search by PNR Number
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("station")}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "station"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Station & Date Explorer
          </button>
        </div>

        {/* PNR Search Tab */}
        {activeTab === "pnr" && (
          <div>
            <form onSubmit={handlePnrSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  10-Digit Indian Railways PNR Number
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      id="pnr-input"
                      type="text"
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value)}
                      placeholder="e.g. 2458963214 or 12345678"
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <Sparkles className="w-4 h-4 text-indigo-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !pnr.trim()}
                    className="py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {loading ? "Analyzing..." : "Analyze Congestion"}
                  </button>
                </div>
              </div>

              {/* Quick Demo Chips */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Quick Demo Scenarios (1-Click Test):
                </span>
                <div className="flex flex-wrap gap-2">
                  {demoPnrs.map((item) => (
                    <button
                      key={item.pnr}
                      type="button"
                      onClick={() => {
                        setPnr(item.pnr);
                        onSearchPnr(item.pnr);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.type === "high"
                            ? "bg-red-400"
                            : item.type === "med"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                      />
                      <span className="font-mono font-semibold">{item.pnr}</span>
                      <span className="text-slate-500 text-[10px]">({item.label})</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Station & Date Tab */}
        {activeTab === "station" && (
          <div>
            <form onSubmit={handleStationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Station Dropdown */}
                <div className="sm:col-span-7">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Railway Junction (10 Monitored)
                  </label>
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {stations.map((st) => (
                      <option key={st.stationId} value={st.stationId}>
                        {st.stationCode ? `[${st.stationCode}] ` : ""}{st.stationName} - {st.city} ({st.totalPlatforms || 10} Platforms)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Journey Date */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Date of Journey
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDate("2026-04-27")}
                    className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                      date === "2026-04-27"
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-900/50 border-slate-800 text-slate-400"
                    }`}
                  >
                    Peak Day (27 Apr)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate("2026-04-28")}
                    className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                      date === "2026-04-28"
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-900/50 border-slate-800 text-slate-400"
                    }`}
                  >
                    Post-Rush (28 Apr)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate("2026-04-29")}
                    className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                      date === "2026-04-29"
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-900/50 border-slate-800 text-slate-400"
                    }`}
                  >
                    Weekend (29 Apr)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {loading ? "Exploring..." : "Scan Station Heatmap"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

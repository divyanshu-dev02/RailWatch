import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import TravelAdvisoryCard from "../components/TravelAdvisoryCard";
import PlatformHeatmap from "../components/PlatformHeatmap";
import DelaySimulator from "../components/DelaySimulator";
import CongestionChart from "../components/CongestionChart";

import {
  getCongestionByPnr,
  getCongestionByStationAndDate,
  getStations,
} from "../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null);
  const [chartData, setChartData] = useState([]);

  /* ------------------------------------
     Load Initial Network Demo & Auto-Query
  ------------------------------------ */
  useEffect(() => {
    const initData = async () => {
      try {
        const stations = await getStations();
        if (stations?.length) {
          // Preload network chart data
          setChartData([
            { name: "NDLS", passengers: 2850 },
            { name: "HWH", passengers: 2440 },
            { name: "BCT", passengers: 1150 },
            { name: "SBC", passengers: 800 },
            { name: "LKO", passengers: 680 },
            { name: "PUNE", passengers: 540 },
            { name: "MAS", passengers: 350 },
            { name: "JP", passengers: 210 },
            { name: "HYB", passengers: 190 },
            { name: "ADI", passengers: 140 },
          ]);
        }

        // Auto-run initial query with primary demo PNR
        handlePnrSearch("2458963214");
      } catch (err) {
        console.error("Initial load fallback:", err);
      }
    };

    initData();
  }, []);

  /* ------------------------------------
     Search by PNR
  ------------------------------------ */
  const handlePnrSearch = async (pnr) => {
    setLoading(true);
    setError("");

    try {
      const data = await getCongestionByPnr(pnr);
      if (!data) {
        setError(`PNR "${pnr}" not found in database.`);
      } else {
        setResultData(data);
        updateChart(data.stationCode || data.stationName, data.totalPassengers);
      }
    } catch (err) {
      console.error("PNR search error:", err);
      setError("Unable to connect to Railway Congestion API. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------
     Search by Station + Date
  ------------------------------------ */
  const handleStationSearch = async (stationId, date) => {
    setLoading(true);
    setError("");

    try {
      const data = await getCongestionByStationAndDate(stationId, date);
      if (!data) {
        setError("No records found for the selected station and date.");
      } else {
        setResultData(data);
        updateChart(data.stationCode || data.stationName, data.totalPassengers);
      }
    } catch (err) {
      console.error("Station search error:", err);
      setError("Unable to fetch station congestion data.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------
     Update Chart Dynamically
  ------------------------------------ */
  const updateChart = (stationLabel, passengers) => {
    const key = stationLabel?.split(" ")[0];
    if (!key) return;

    setChartData((prev) => {
      const filtered = prev.filter((item) => item.name !== key);
      return [{ name: key, passengers }, ...filtered.slice(0, 9)];
    });
  };

  return (
    <div className="min-h-screen text-slate-100 relative selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-[#070b14] -z-20" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-[600px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero */}
        <Hero />

        {/* Dual Search Panel */}
        <section className="mt-2">
          <SearchBar
            onSearchPnr={handlePnrSearch}
            onSearchStation={handleStationSearch}
            loading={loading}
          />
        </section>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-10 glass-card p-8 text-center max-w-xl mx-auto border border-white/10">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">
              Calculating 45-minute rolling time windows & platform load densities...
            </p>
          </div>
        )}

        {/* Error Callout */}
        {error && (
          <div className="mt-8 max-w-xl mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results Stream */}
        {!loading && resultData && (
          <div className="space-y-2">
            {/* 1. Main Congestion Status Card */}
            <ResultCard data={resultData} />

            {/* 2. Smart Commuter Travel Advisory */}
            {resultData.travelAdvisory && (
              <TravelAdvisoryCard advisory={resultData.travelAdvisory} />
            )}

            {/* 3. Platform Heatmap & Blueprint */}
            {resultData.platformLoads && resultData.platformLoads.length > 0 && (
              <PlatformHeatmap
                platforms={resultData.platformLoads}
                stationName={resultData.stationName}
              />
            )}

            {/* 4. What-If Delay Cascading Sandbox Slider */}
            <DelaySimulator
              stationId={resultData.stationId || 1}
              currentTrainId={resultData.trainId || 1}
              journeyDate={resultData.journeyDate || "2026-04-27"}
            />

            {/* 5. 24h Timeline & Comparative Recharts */}
            <CongestionChart
              chartData={chartData}
              timeline={resultData.timeline || []}
              stationName={resultData.stationName}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RailWatch Intelligence • Predictive Station Congestion & Stampede Prevention</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Spring Boot 3.x Engine</span>
            <span>•</span>
            <span>React Vite + Tailwind</span>
            <span>•</span>
            <span>MySQL 8.x</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

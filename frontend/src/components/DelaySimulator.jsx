import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sliders, Clock, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { simulateDelay, getStationTrains } from "../services/api";

const DelaySimulator = ({ stationId = 1, currentTrainId, journeyDate = "2026-04-27" }) => {
  const [trains, setTrains] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState(currentTrainId || 1);
  const [delayMinutes, setDelayMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    if (currentTrainId) {
      setSelectedTrainId(currentTrainId);
    }
  }, [currentTrainId]);

  // Load trains for the station
  useEffect(() => {
    const loadTrains = async () => {
      try {
        const list = await getStationTrains(stationId);
        if (list && list.length > 0) {
          setTrains(list);
          if (!currentTrainId) {
            setSelectedTrainId(list[0].trainId);
          }
        }
      } catch (err) {
        console.error("Failed to load station trains for simulator", err);
      }
    };
    loadTrains();
  }, [stationId, currentTrainId]);

  const handleRunSimulation = async () => {
    if (!selectedTrainId) return;
    setLoading(true);
    try {
      const data = await simulateDelay(selectedTrainId, delayMinutes, journeyDate);
      setSimulationResult(data);
    } catch (err) {
      console.error("Simulation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const delayPresets = [15, 30, 45, 60, 90];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 sm:p-8 mt-8 border border-white/10 relative overflow-hidden"
    >
      {/* Background radial gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              "What-If" Delay Cascading Sandbox
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate departure delays to dynamically compute boarding window overlaps, acute passenger surges & platform collisions
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Predictive Overlap Engine
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        {/* Train Selector */}
        <div className="md:col-span-5">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Select Train to Delay
          </label>
          <select
            value={selectedTrainId}
            onChange={(e) => setSelectedTrainId(Number(e.target.value))}
            className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {trains.map((t) => (
              <option key={t.trainId} value={t.trainId}>
                {t.trainNumber ? `${t.trainNumber} - ` : ""}{t.trainName} (Dep: {t.departureTime}, P{t.platform})
              </option>
            ))}
          </select>
        </div>

        {/* Delay Minutes Slider + Presets */}
        <div className="md:col-span-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-slate-300">
              Incurred Delay
            </label>
            <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              +{delayMinutes} mins
            </span>
          </div>

          <div className="flex gap-1.5">
            {delayPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDelayMinutes(preset)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  delayMinutes === preset
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50"
                }`}
              >
                +{preset}m
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-3">
          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sliders className="w-4 h-4" />
            )}
            {loading ? "Computing Overlaps..." : "Run Delay Simulation"}
          </button>
        </div>
      </div>

      {/* Simulation Results Output */}
      {simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          {/* Top Collision / Stampede Banner */}
          {simulationResult.stampedeRiskEscalation ? (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 mb-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">
                  CRITICAL HAZARD: Delay Triggers Stampede Escalation
                </h4>
                <p className="text-xs text-rose-200/90 mt-1">
                  {simulationResult.narrative}
                </p>
              </div>
            </div>
          ) : simulationResult.platformCollision ? (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 mb-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  PLATFORM COLLISION DETECTED on Platform {simulationResult.collidingPlatform}
                </h4>
                <p className="text-xs text-amber-200/90 mt-1">
                  {simulationResult.narrative}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 mb-4 text-xs">
              {simulationResult.narrative}
            </div>
          )}

          {/* Before vs After Comparison Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Departure Shift</span>
              <div className="flex items-center gap-1.5 mt-1 text-sm font-mono font-bold text-white">
                <span className="text-slate-400">{simulationResult.originalDeparture}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">{simulationResult.simulatedDeparture}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Congestion Status</span>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {simulationResult.originalCongestionLevel}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className={`px-2 py-0.5 rounded ${
                  simulationResult.simulatedCongestionLevel.includes("CRITICAL")
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : simulationResult.simulatedCongestionLevel === "HIGH"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}>
                  {simulationResult.simulatedCongestionLevel}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">45-Min Window Load</span>
              <div className="flex items-baseline gap-1 mt-1 text-sm font-mono font-bold text-white">
                <span>{simulationResult.simulatedWindowPassengers.toLocaleString()}</span>
                <span className={`text-xs ${simulationResult.passengerDelta >= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  ({simulationResult.passengerDelta >= 0 ? "+" : ""}{simulationResult.passengerDelta} pax)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Colliding Trains</span>
              <span className="mt-1 text-sm font-bold text-indigo-300 block truncate">
                {simulationResult.collidingTrains?.length > 0
                  ? `${simulationResult.collidingTrains.length} Express Train(s)`
                  : "None (Clear)"}
              </span>
            </div>
          </div>

          {/* Mitigation Protocol */}
          {simulationResult.mitigationRecommendation && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-200">
                <span className="font-bold text-indigo-100">Recommended Dispatch Strategy: </span>
                {simulationResult.mitigationRecommendation}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DelaySimulator;

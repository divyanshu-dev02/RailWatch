import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Users, Train as TrainIcon, Info } from "lucide-react";

const getPlatformStatusBadge = (status) => {
  switch (status) {
    case "CRITICAL_STAMPEDE_RISK":
      return {
        bg: "bg-rose-500/20 border-rose-500/50 text-rose-300",
        bar: "bg-gradient-to-r from-rose-600 to-red-500",
        label: "STAMPEDE RISK",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />,
      };
    case "CROWDED":
      return {
        bg: "bg-amber-500/20 border-amber-500/50 text-amber-300",
        bar: "bg-gradient-to-r from-amber-500 to-orange-500",
        label: "HEAVY CROWD",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
      };
    case "MODERATE":
      return {
        bg: "bg-blue-500/20 border-blue-500/40 text-blue-300",
        bar: "bg-gradient-to-r from-blue-500 to-indigo-500",
        label: "MODERATE",
        icon: <Users className="w-3.5 h-3.5 text-blue-400" />,
      };
    default:
      return {
        bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
        bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
        label: "OPTIMAL",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      };
  }
};

const PlatformHeatmap = ({ platforms = [], stationName = "Station Blueprint" }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  if (!platforms || platforms.length === 0) {
    return null;
  }

  const criticalCount = platforms.filter(p => p.stampedeHazard).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 sm:p-8 mt-8 border border-white/10 relative overflow-hidden"
    >
      {/* Blueprint background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <TrainIcon className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Platform Density Blueprint & Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time per-platform concourse saturation & stampede hazard telemetry for {stationName}
          </p>
        </div>

        {criticalCount > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{criticalCount} Stampede Hazard Alert(s)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All Platforms Within Safe Limits</span>
          </div>
        )}
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {platforms.map((p) => {
          const badge = getPlatformStatusBadge(p.loadStatus);
          const isSelected = selectedPlatform?.platformNumber === p.platformNumber;

          return (
            <motion.div
              key={p.platformNumber}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPlatform(isSelected ? null : p)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                p.stampedeHazard
                  ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                  : isSelected
                  ? "bg-indigo-950/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-indigo-300">
                    P{p.platformNumber}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Platform {p.platformNumber}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Cap: {p.platformCapacity} pax
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                  {badge.icon}
                  {badge.label}
                </span>
              </div>

              {/* Passenger Volume & Density Bar */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Pax Volume</span>
                  <span className="text-slate-200 font-bold">
                    {p.platformPassengerVolume.toLocaleString()} / {p.platformCapacity}
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({p.densityPercentage}%)
                    </span>
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${badge.bar} transition-all duration-700`}
                    style={{ width: `${Math.min(100, p.densityPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Assigned Trains */}
              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                {p.assignedTrains && p.assignedTrains.length > 0 ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <TrainIcon className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate text-slate-300 font-medium">
                      {p.assignedTrains.join(" • ")}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">No scheduled departures in active window</span>
                )}
              </div>

              {/* Hazard Warning alert */}
              {p.hazardWarning && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] leading-tight">
                  {p.hazardWarning}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Platform Inspection Modal / Callout */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-200">
            <span className="font-bold text-white">Platform {selectedPlatform.platformNumber} Concourse Telemetry: </span>
            Current density is operating at {selectedPlatform.densityPercentage}% holding capacity with {selectedPlatform.platformPassengerVolume} passengers.
            {selectedPlatform.stampedeHazard
              ? " Emergency crowd gates and bypass FOBs are recommended for boarding commuters to avoid choke points."
              : " Commuter evacuation throughput and escalator clearances are normal."}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlatformHeatmap;

import React from "react";
import { motion } from "framer-motion";
import { Clock, Navigation, Luggage, ShieldAlert, Sparkles, Train } from "lucide-react";

const TravelAdvisoryCard = ({ advisory }) => {
  if (!advisory) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass-card p-6 sm:p-8 mt-8 border border-white/10 relative overflow-hidden"
    >
      {/* Glow accent */}
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Smart Commuter Travel Advisory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personalized guidance calculated from active rolling time-window congestion & station bottlenecks
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
          Optimal Route Recommended
        </span>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Recommended Arrival */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Recommended Arrival</span>
            </div>
            <h4 className="text-lg font-bold text-white font-mono">
              {advisory.recommendedArrivalTime}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Plan your transit to arrive at least {advisory.bufferMinutesBeforeDeparture} mins prior to avoid concourse queues.
          </p>
        </div>

        {/* Optimal Entry Gate */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Navigation className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Optimal Entry Gate</span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">
              {advisory.optimalEntryGate}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            <span className="text-indigo-300 font-semibold">FOB: </span>
            {advisory.recommendedFob}
          </p>
        </div>

        {/* Baggage & Mobility */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Luggage className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Luggage Guidance</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {advisory.baggageGuidance}
            </p>
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      {advisory.safetyAdvisory && (
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 mb-4 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Station Safety Advisory: </span>
            {advisory.safetyAdvisory}
          </div>
        </div>
      )}

      {/* Alternative Low-Crowd Trains */}
      {advisory.alternativeTrains && advisory.alternativeTrains.length > 0 && (
        <div className="pt-4 border-t border-white/5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-indigo-400" />
            Alternative Low-Congestion Departures
          </span>
          <div className="flex flex-wrap gap-2">
            {advisory.alternativeTrains.map((alt, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-indigo-200 font-medium"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TravelAdvisoryCard;

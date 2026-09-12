import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Clock, MapPin, Train as TrainIcon, Users, QrCode, Sparkles, Navigation } from "lucide-react";
import TravelPassModal from "./TravelPassModal";

const getLevelConfig = (level) => {
  switch (level?.toUpperCase()) {
    case "CRITICAL_STAMPEDE_RISK":
      return {
        badge: "badge-critical",
        text: "Critical Stampede Risk",
        icon: "🚨",
        description: "Severe overcrowding detected. Platform safety limits breached. Immediate crowd control in effect.",
        bgAccent: "from-rose-500/15 via-red-500/10 to-slate-900/50",
        borderAccent: "border-rose-500/50",
        textColor: "text-rose-400",
        progressWidth: "100%",
        progressColor: "bg-gradient-to-r from-red-600 to-rose-500",
      };
    case "HIGH":
      return {
        badge: "badge-high",
        text: "High Congestion",
        icon: "🔴",
        description: "Heavy boarding crowd anticipated. Acute concourse friction active. Arrive early.",
        bgAccent: "from-red-500/15 via-rose-500/10 to-slate-900/50",
        borderAccent: "border-red-500/40",
        textColor: "text-red-400",
        progressWidth: "85%",
        progressColor: "bg-gradient-to-r from-red-500 to-rose-500",
      };
    case "MEDIUM":
      return {
        badge: "badge-medium",
        text: "Medium Congestion",
        icon: "⚠️",
        description: "Moderate crowd expected across concourses. Standard boarding clearance.",
        bgAccent: "from-amber-500/15 via-yellow-500/10 to-slate-900/50",
        borderAccent: "border-amber-500/40",
        textColor: "text-amber-400",
        progressWidth: "50%",
        progressColor: "bg-gradient-to-r from-amber-500 to-yellow-400",
      };
    case "LOW":
    default:
      return {
        badge: "badge-low",
        text: "Low Congestion",
        icon: "✅",
        description: "Smooth station transit. Unimpeded access through gates and platforms.",
        bgAccent: "from-emerald-500/15 via-teal-500/10 to-slate-900/50",
        borderAccent: "border-emerald-500/40",
        textColor: "text-emerald-400",
        progressWidth: "25%",
        progressColor: "bg-gradient-to-r from-emerald-500 to-green-400",
      };
  }
};

const ResultCard = ({ data }) => {
  const [passModalOpen, setPassModalOpen] = useState(false);

  if (!data) return null;

  const config = getLevelConfig(data.congestionLevel);
  const timeWindow = data.timeWindowAnalysis;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mt-8"
      >
        {/* Main Card */}
        <div className={`glass-card p-6 sm:p-8 bg-gradient-to-br ${config.bgAccent} border ${config.borderAccent} relative overflow-hidden`}>
          {/* Top Row: Title, Status Badge & Pass Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {data.stationName}
                  {data.stationCode ? (
                    <span className="text-indigo-400 font-mono text-lg ml-2 font-normal">
                      [{data.stationCode}]
                    </span>
                  ) : null}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {config.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className={`${config.badge} px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg`}>
                {config.text}
              </span>

              {/* Boarding Pass Button */}
              <button
                type="button"
                onClick={() => setPassModalOpen(true)}
                className="px-3.5 py-2 rounded-full text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Travel Pass</span>
              </button>
            </div>
          </div>

          {/* Congestion Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Low (&lt;500 pax)</span>
              <span>Medium (500-1500)</span>
              <span>High (1500-2500)</span>
              <span className="text-rose-400 font-bold">Stampede Risk (&gt;2500)</span>
            </div>
            <div className="h-2.5 bg-slate-950/60 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full ${config.progressColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: config.progressWidth }}
              />
            </div>
          </div>

          {/* Station & Journey Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatBox
              label="Station Volume"
              value={`${data.totalPassengers?.toLocaleString() || "0"} pax`}
              sub="Cumulative on date"
              icon={<Users className="w-4 h-4 text-indigo-400" />}
            />
            <StatBox
              label="Assigned Platform"
              value={data.platform ? `Platform ${data.platform}` : "All Platforms"}
              sub={data.totalPlatforms ? `of ${data.totalPlatforms} total` : "Main Line"}
              icon={<TrainIcon className="w-4 h-4 text-indigo-400" />}
            />
            <StatBox
              label="Railway Zone"
              value={data.zone || data.city || "Indian Railways"}
              sub={data.city || "Network Junction"}
              icon={<MapPin className="w-4 h-4 text-indigo-400" />}
            />
            <StatBox
              label="Journey Date"
              value={data.journeyDate || "—"}
              sub={data.departureTime ? `Dep: ${data.departureTime}` : "Full Day"}
              icon={<Clock className="w-4 h-4 text-indigo-400" />}
            />
          </div>

          {/* Acute 45-Minute Rolling Window Callout */}
          {timeWindow && (
            <div className={`p-4 rounded-xl border mb-6 ${
              timeWindow.acuteBottleneck
                ? "bg-rose-950/30 border-rose-500/40"
                : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${timeWindow.acuteBottleneck ? "text-rose-400" : "text-indigo-400"}`} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    45-Minute Acute Rolling Window ({timeWindow.windowStart} - {timeWindow.windowEnd})
                  </h4>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  timeWindow.acuteBottleneck ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {timeWindow.acuteBottleneck ? "Acute Peak Rush" : "Flow Normal"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 mt-3 pt-3 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 block">Window Volume</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {timeWindow.windowPassengerVolume.toLocaleString()} pax
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Concurrent Departures</span>
                  <span className="font-bold text-indigo-300 text-sm">
                    {timeWindow.concurrentTrainsCount} Train(s)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Concourse Friction Factor</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {timeWindow.concourseCongestionFactor}x
                  </span>
                </div>
              </div>

              {timeWindow.acuteReason && (
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  {timeWindow.acuteReason}
                </p>
              )}
            </div>
          )}

          {/* Train & Passenger Specifics (from PNR Search) */}
          {data.trainName && (
            <div className="border-t border-white/10 pt-5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrainIcon className="w-3.5 h-3.5" />
                Train Reservation Details
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox
                  label="Train Name"
                  value={data.trainName}
                  sub={data.trainNumber ? `#${data.trainNumber}` : data.trainType}
                  icon={<TrainIcon className="w-4 h-4 text-slate-400" />}
                />
                <StatBox
                  label="PNR Number"
                  value={data.pnr || "—"}
                  sub={data.bookingStatus || "CONFIRMED"}
                  icon={<Sparkles className="w-4 h-4 text-slate-400" />}
                />
                <StatBox
                  label="Class / Coach"
                  value={data.coachType || "CC"}
                  sub={data.reservedPassengers ? `${data.reservedPassengers} Passengers` : "Reserved"}
                  icon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <StatBox
                  label="Route"
                  value={data.destinationStation ? `To ${data.destinationStation}` : "Direct"}
                  sub={data.sourceStation ? `From ${data.sourceStation}` : "Origin"}
                  icon={<Navigation className="w-4 h-4 text-slate-400" />}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Digital Travel Pass Modal */}
      <TravelPassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        data={data}
      />
    </>
  );
};

const StatBox = ({ label, value, sub, icon }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-left hover:border-slate-700 transition-all">
    <div className="flex items-center justify-between mb-1">
      <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      {icon}
    </div>
    <div className="text-white font-bold text-sm truncate">{value}</div>
    {sub && <div className="text-slate-400 text-[10px] mt-0.5 truncate">{sub}</div>}
  </div>
);

export default ResultCard;

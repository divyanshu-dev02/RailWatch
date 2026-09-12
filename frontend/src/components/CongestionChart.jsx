import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { BarChart3, TrendingUp, Sparkles, Clock } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    return (
      <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
        <p className="text-white font-bold text-sm mb-1">{label}</p>
        <p className="text-indigo-300 font-mono font-bold">
          {value.toLocaleString()} <span className="font-normal text-slate-400">passengers</span>
        </p>
        {data.trainNames && data.trainNames.length > 0 && (
          <p className="text-slate-400 text-[11px] mt-1 truncate max-w-xs">
            Departures: {data.trainNames.join(", ")}
          </p>
        )}
        {data.isPeakSlot && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
            Acute Peak Slot
          </span>
        )}
      </div>
    );
  }
  return null;
};

const CongestionChart = ({ chartData = [], timeline = [], stationName = "Network" }) => {
  const [viewMode, setViewMode] = useState(timeline && timeline.length > 0 ? "timeline" : "network");

  // Keep viewMode synced if timeline arrives
  React.useEffect(() => {
    if (timeline && timeline.length > 0) {
      setViewMode("timeline");
    }
  }, [timeline]);

  const hasTimeline = timeline && timeline.length > 0;

  return (
    <div id="analytics" className="max-w-4xl mx-auto mt-8">
      <div className="glass-card p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                {viewMode === "timeline" ? <TrendingUp className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {viewMode === "timeline" ? `24-Hour Passenger Flow Curve (${stationName})` : "Cross-Station Congestion Overview"}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {viewMode === "timeline"
                ? "45-Minute rolling departure density curve capturing acute commuter rush hours"
                : "Comparative cumulative passenger volumes across monitored Indian Railway junctions"}
            </p>
          </div>

          {/* Toggle Button */}
          {hasTimeline && (
            <div className="flex rounded-lg bg-slate-900/80 p-1 border border-slate-800 self-start sm:self-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === "timeline"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Hourly Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode("network")}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === "network"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Network Stations
              </button>
            </div>
          )}
        </div>

        {/* Charts Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "timeline" && hasTimeline ? (
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="timeSlot"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={800} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Bottleneck Threshold", fill: "#fb7185", fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="passengerCount"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPax)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="passengers" radius={[6, 6, 0, 0]} barSize={36}>
                  {chartData.map((entry, index) => {
                    const color =
                      entry.passengers >= 1500
                        ? "#ef4444"
                        : entry.passengers >= 500
                        ? "#f59e0b"
                        : "#10b981";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Low (&lt;500 pax)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Medium (500-1500)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              High / Acute Peak
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Updated via Spring Boot 3.x Engine
          </span>
        </div>
      </div>
    </div>
  );
};

export default CongestionChart;

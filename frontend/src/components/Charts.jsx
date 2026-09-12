import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingUp, HelpCircle } from 'lucide-react';

const COLORS = {
  LOW: '#10b981',    // Emerald
  MEDIUM: '#f59e0b', // Amber
  HIGH: '#ef4444',   // Red
};

const getColor = (passengers) => {
  if (passengers < 500) return COLORS.LOW;
  if (passengers <= 1500) return COLORS.MEDIUM;
  return COLORS.HIGH;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const passengers = payload[0].value;
    const level = passengers < 500 ? 'LOW' : passengers <= 1500 ? 'MEDIUM' : 'HIGH';
    return (
      <div className="glass-panel p-4 rounded-xl border-white/10 shadow-2xl">
        <p className="text-white font-bold text-sm mb-2">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold text-white leading-none">
            {passengers.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 uppercase font-semibold pb-0.5">Pax</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: COLORS[level] }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[level] }} />
          {level} Congestion
        </div>
      </div>
    );
  }
  return null;
};

const Charts = ({ chartData }) => {
  if (!chartData || chartData.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      id="analytics"
      className="mt-16 max-w-7xl mx-auto"
    >
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-white">Network Analytics</h2>
            </div>
            <p className="text-gray-400 text-sm">Real-time aggregate passenger volume across connected stations</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 bg-black/20 p-3 rounded-xl border border-white/5">
            <LegendItem color={COLORS.LOW} label="Low" />
            <LegendItem color={COLORS.MEDIUM} label="Medium" />
            <LegendItem color={COLORS.HIGH} label="High" />
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                tickLine={false}
                tickFormatter={(value) => `${value}p`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="passengers" 
                radius={[6, 6, 0, 0]} 
                barSize={48}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.passengers)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </motion.div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{label}</span>
  </div>
);

export default Charts;

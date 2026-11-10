import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';

const COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
const getColor = (passengers) => passengers < 500 ? COLORS.LOW : passengers <= 1500 ? COLORS.MEDIUM : COLORS.HIGH;

const CongestionChart = ({ chartData = [], trendData = [], stationHistory = [], selectedStationId, onSelectStation }) => {
  const [range, setRange] = useState('7d');
  const visibleTrend = useMemo(() => range === '7d' ? trendData.slice(-7) : trendData, [range, trendData]);
  const selectedStation = chartData.find((station) => station.stationId === selectedStationId);
  const projection = useMemo(() => {
    const history = stationHistory.map((point) => point.totalPassengers);
    return stationHistory.map((point, index) => {
      const window = history.slice(Math.max(0, index - 2), index + 1);
      return { ...point, baseline: Math.round(window.reduce((sum, value) => sum + value, 0) / window.length) };
    });
  }, [stationHistory]);

  return (
  <div className="chart-grid">
      <ChartCard title="Station ranking" subtitle="Click a station to inspect its history">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} angle={-15} height={45} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151538', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} />
            <Bar dataKey="passengers" name="Passengers" radius={[8, 8, 0, 0]} barSize={28}
              onClick={(entry) => onSelectStation?.(entry.stationId)}>
              {chartData.map((entry) => <Cell key={entry.stationId} fill={entry.stationId === selectedStationId ? '#8aa8ff' : getColor(entry.passengers)} cursor="pointer" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Network trend" subtitle="Database-backed reservation volume">
        <div className="chart-controls" role="group" aria-label="Trend range">
          {['7d', 'all'].map((option) => <button key={option} type="button" className={range === option ? 'active' : ''} onClick={() => setRange(option)}>{option === '7d' ? 'Last 7 days' : 'All available'}</button>)}
        </div>
        {visibleTrend.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151538', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} />
            <Line type="monotone" dataKey="totalPassengers" name="Passengers" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8', r: 4 }} />
          </LineChart>
        </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-gray-500 text-sm">No historical data for this range.</div>}
      </ChartCard>
      <ChartCard title={selectedStation ? `${selectedStation.name} detail` : 'Station detail'} subtitle={selectedStation ? 'Select a station above to load its history' : 'Choose a station from the ranking'}>
        {selectedStation && projection.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projection} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151538', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
            <ReferenceLine y={500} stroke="#10b981" strokeDasharray="4 4" />
            <ReferenceLine y={1500} stroke="#ef4444" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="totalPassengers" name="Actual" stroke="#8aa8ff" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="baseline" name="Baseline projection" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer> : <div className="chart-empty">{selectedStation ? 'No history available for this station and date.' : 'Click a station bar to inspect its history.'}</div>}
      </ChartCard>
      <ChartCard title="Congestion watchlist" subtitle="Stations that need attention first">
        <div className="watchlist">
          {chartData.filter((station) => station.congestionLevel !== 'LOW').sort((a, b) => b.passengers - a.passengers).map((station) => (
            <button type="button" className="watch-item" key={station.stationId} onClick={() => onSelectStation?.(station.stationId)}>
              <span><strong>{station.name}</strong><small>{station.congestionLevel} congestion</small></span>
              <b>{station.passengers.toLocaleString()}</b>
            </button>
          ))}
          {!chartData.some((station) => station.congestionLevel !== 'LOW') && <div className="chart-empty">All stations are currently below the medium threshold.</div>}
        </div>
      </ChartCard>
  </div>
  );
};

const ChartCard = ({ title, subtitle, children }) => <article className="chart-card p-6 sm:p-8"><div className="mb-5"><h3 className="text-lg font-bold text-white">📊 {title}</h3><p className="text-sm text-gray-400 mt-1">{subtitle}</p></div><div className="h-72">{children}</div></article>;

export default CongestionChart;

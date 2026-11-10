import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, AreaChart, Area, PieChart, Pie } from 'recharts';

const COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
const getColor = (level) => COLORS[level] || '#818cf8';
const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatAxisValue = (value) => value >= 1000 ? `${Math.round(value / 1000)}k` : value;
const getStationId = (entry) => entry?.stationId || entry?.payload?.stationId;

const CongestionChart = ({ chartData = [], trendData = [], stationHistory = [], selectedStationId, onSelectStation, darkMode }) => {
  const chartTheme = darkMode
    ? { text: '#aebbd0', grid: 'rgba(174,187,208,0.14)', tooltip: '#182230', tooltipBorder: '#33445a' }
    : { text: '#52627a', grid: 'rgba(82,98,122,0.18)', tooltip: '#ffffff', tooltipBorder: '#d6deea' };
  const [range, setRange] = useState('7d');
  const [stationChart, setStationChart] = useState('bar');
  const visibleTrend = useMemo(() => range === '7d' ? trendData.slice(-7) : trendData, [range, trendData]);
  const selectedStation = chartData.find((station) => station.stationId === selectedStationId);
  const passengerDistribution = useMemo(() => ['LOW', 'MEDIUM', 'HIGH'].map((level) => ({
    name: level,
    value: chartData.filter((station) => station.congestionLevel === level)
      .reduce((sum, station) => sum + station.passengers, 0),
    fill: COLORS[level],
  })).filter((item) => item.value > 0), [chartData]);
  const projection = useMemo(() => {
    const history = stationHistory.map((point) => point.totalPassengers);
    return stationHistory.map((point, index) => {
      const window = history.slice(Math.max(0, index - 2), index + 1);
      return { ...point, baseline: Math.round(window.reduce((sum, value) => sum + value, 0) / window.length) };
    });
  }, [stationHistory]);

  return (
  <div className="chart-grid">
      <ChartCard title="Station ranking" subtitle="Booked passengers ranked by station; color shows capacity utilization">
        <ChartViewSwitcher value={stationChart} onChange={setStationChart} options={[
          ['bar', 'Bars'],
          ['line', 'Line'],
          ['area', 'Area'],
          ['pie', 'Distribution'],
        ]} />
        <ResponsiveContainer width="100%" height="100%">
          {stationChart === 'pie' ? <PieChart>
            <Pie data={passengerDistribution} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={88} innerRadius={52} paddingAngle={4} label={({ name, value }) => `${name} ${formatAxisValue(value)}`}>
              {passengerDistribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
            </Pie>
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} formatter={(value) => [formatNumber(value), 'Passengers']} />
            <Legend wrapperStyle={{ color: chartTheme.text, fontSize: 11 }} />
          </PieChart> : stationChart === 'line' ? <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10 }} tickLine={false} angle={-15} height={45} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatAxisValue} />
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} formatter={(value, name, item) => [formatNumber(value), `${name} · ${item.payload.utilization}% utilized`]} />
            <Line type="monotone" dataKey="passengers" name="Passengers" stroke="#8aa8ff" strokeWidth={3} dot={{ fill: '#8aa8ff', r: 4 }} activeDot={{ r: 7 }}
              onClick={(entry) => onSelectStation?.(getStationId(entry))} />
          </LineChart> : stationChart === 'area' ? <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs><linearGradient id="passengerGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8aa8ff" stopOpacity={0.65} /><stop offset="95%" stopColor="#8aa8ff" stopOpacity={0.05} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10 }} tickLine={false} angle={-15} height={45} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatAxisValue} />
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} formatter={(value, name, item) => [formatNumber(value), `${name} · ${item.payload.utilization}% utilized`]} />
            <Area type="monotone" dataKey="passengers" name="Passengers" stroke="#8aa8ff" fill="url(#passengerGradient)" strokeWidth={3}
              onClick={(entry) => onSelectStation?.(getStationId(entry))} />
          </AreaChart> : <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: chartTheme.text, fontSize: 10 }} tickLine={false} angle={-15} height={45} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatAxisValue} />
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} formatter={(value, name, item) => [formatNumber(value), `${name} · ${item.payload.utilization}% utilized`]} />
            <Bar dataKey="passengers" name="Passengers" radius={[8, 8, 0, 0]} barSize={28}
              onClick={(entry) => onSelectStation?.(getStationId(entry))}>
              {chartData.map((entry) => <Cell key={entry.stationId} fill={entry.stationId === selectedStationId ? '#8aa8ff' : getColor(entry.congestionLevel)} cursor="pointer" />)}
            </Bar>
          </BarChart>}
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Network trend" subtitle="Database-backed reservation volume">
        <div className="chart-controls" role="group" aria-label="Trend range">
          {['7d', 'all'].map((option) => <button key={option} type="button" className={range === option ? 'active' : ''} onClick={() => setRange(option)}>{option === '7d' ? 'Last 7 days' : 'All available'}</button>)}
        </div>
        {visibleTrend.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: chartTheme.text, fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatAxisValue} />
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} />
            <Line type="monotone" dataKey="totalPassengers" name="Passengers" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8', r: 4 }} />
          </LineChart>
        </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-gray-500 text-sm">No historical data for this range.</div>}
      </ChartCard>
      <ChartCard title={selectedStation ? `${selectedStation.name} detail` : 'Station detail'} subtitle={selectedStation ? 'Selected station history · last 7 days' : 'Choose a station from the ranking or Find a station above'}>
        {selectedStation && projection.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projection} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: chartTheme.text, fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: chartTheme.tooltip, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: 12, color: chartTheme.text }} itemStyle={{ color: chartTheme.text }} labelStyle={{ color: chartTheme.text }} />
            <Legend wrapperStyle={{ color: chartTheme.text, fontSize: 11 }} />
            <Line type="monotone" dataKey="totalPassengers" name="Actual" stroke="#8aa8ff" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="baseline" name="Baseline projection" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer> : <div className="chart-empty">{selectedStation ? 'No history available for this station and date.' : 'Click a station bar to inspect its history.'}</div>}
      </ChartCard>
      <ChartCard title="Congestion watchlist" subtitle="Stations that need attention first">
        <div className="watchlist">
          {chartData.filter((station) => station.congestionLevel !== 'LOW').sort((a, b) => b.passengers - a.passengers).map((station) => (
            <button type="button" className="watch-item" key={station.stationId} onClick={() => onSelectStation?.(station.stationId)}>
              <span><strong>{station.name}</strong><small>{station.congestionLevel} · {station.utilization}% utilized</small></span>
              <b>{station.passengers.toLocaleString()}</b>
            </button>
          ))}
          {!chartData.some((station) => station.congestionLevel !== 'LOW') && <div className="chart-empty">All stations are currently below the medium threshold.</div>}
        </div>
      </ChartCard>
  </div>
  );
};

const ChartCard = ({ title, subtitle, children }) => <article className="chart-card p-6 sm:p-8"><div className="chart-card-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="chart-card-mark" aria-hidden="true">↗</span></div><div className="chart-body">{children}</div></article>;
const ChartViewSwitcher = ({ value, onChange, options }) => <div className="chart-view-switcher" role="group" aria-label="Chart view">{options.map(([option, label]) => <button key={option} type="button" className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{label}</button>)}</div>;

export default CongestionChart;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

const COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };
const getColor = (passengers) => passengers < 500 ? COLORS.LOW : passengers <= 1500 ? COLORS.MEDIUM : COLORS.HIGH;

const CongestionChart = ({ chartData = [], trendData = [] }) => (
  <div id="analytics" className="max-w-5xl mx-auto mt-8 animate-fade-in-up">
    <div className="grid lg:grid-cols-2 gap-6">
      <ChartCard title="Station ranking" subtitle="Current passenger volume">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} angle={-15} height={45} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151538', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} />
            <Bar dataKey="passengers" name="Passengers" radius={[8, 8, 0, 0]} barSize={28}>
              {chartData.map((entry) => <Cell key={entry.name} fill={getColor(entry.passengers)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Seven-day trend" subtitle="Database-backed reservation volume">
        {trendData.length ? <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#151538', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} />
            <Line type="monotone" dataKey="totalPassengers" name="Passengers" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8', r: 4 }} />
          </LineChart>
        </ResponsiveContainer> : <div className="h-full flex items-center justify-center text-gray-500 text-sm">No historical data for this range.</div>}
      </ChartCard>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => <div className="glass-card p-6 sm:p-8"><div className="mb-5"><h3 className="text-lg font-bold text-white">📊 {title}</h3><p className="text-sm text-gray-400 mt-1">{subtitle}</p></div><div className="h-72">{children}</div></div>;

export default CongestionChart;

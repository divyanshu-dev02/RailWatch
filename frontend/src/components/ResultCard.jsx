const getLevelConfig = (level) => {
  switch (level?.toUpperCase()) {
    case 'LOW':
      return {
        badge: 'badge-low',
        text: 'Low Congestion',
        icon: '✅',
        description: 'Station is relatively empty. Comfortable travel expected.',
        bgAccent: 'from-emerald-500/10 to-green-500/5',
        borderAccent: 'border-emerald-500/20',
        textColor: 'text-emerald-400',
        progressWidth: '33%',
        progressColor: 'bg-gradient-to-r from-emerald-500 to-green-400',
      };
    case 'MEDIUM':
      return {
        badge: 'badge-medium',
        text: 'Medium Congestion',
        icon: '⚠️',
        description: 'Moderate crowd expected. Plan accordingly.',
        bgAccent: 'from-amber-500/10 to-yellow-500/5',
        borderAccent: 'border-amber-500/20',
        textColor: 'text-amber-400',
        progressWidth: '66%',
        progressColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      };
    case 'HIGH':
      return {
        badge: 'badge-high',
        text: 'High Congestion',
        icon: '🔴',
        description: 'Heavy crowd expected. Arrive early and stay alert.',
        bgAccent: 'from-red-500/10 to-rose-500/5',
        borderAccent: 'border-red-500/20',
        textColor: 'text-red-400',
        progressWidth: '100%',
        progressColor: 'bg-gradient-to-r from-red-500 to-rose-400',
      };
    default:
      return {
        badge: 'bg-gray-600',
        text: 'Unknown',
        icon: '❓',
        description: '',
        bgAccent: 'from-gray-500/10 to-gray-500/5',
        borderAccent: 'border-gray-500/20',
        textColor: 'text-gray-400',
        progressWidth: '0%',
        progressColor: 'bg-gray-500',
      };
  }
};

const ResultCard = ({ data }) => {
  if (!data) return null;

  const config = getLevelConfig(data.congestionLevel);

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-fade-in-up delay-300">
      {/* Main Congestion Card */}
      <div className={`glass-card p-6 sm:p-8 bg-gradient-to-br ${config.bgAccent} border ${config.borderAccent}`}>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              Station Congestion Status
            </h3>
            <p className="text-sm text-gray-400 mt-1">{config.description}</p>
          </div>
          <span className={`${config.badge} px-5 py-2 rounded-full text-sm font-bold tracking-wider uppercase text-center`}>
            {config.text}
          </span>
        </div>

        {/* Congestion Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${config.progressColor} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: config.progressWidth }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatBox
            label="Total Passengers"
            value={data.totalPassengers?.toLocaleString() || '0'}
            icon="👥"
          />
          <StatBox
            label="Station"
            value={data.stationName || '—'}
            icon="🏢"
          />
          <StatBox
            label="City"
            value={data.city || '—'}
            icon="📍"
          />
          <StatBox
            label="Journey Date"
            value={data.journeyDate || '—'}
            icon="📅"
          />
        </div>

        {/* Train Details (if available from PNR search) */}
        {data.trainName && (
          <div className="border-t border-white/10 pt-5">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              🚂 Train Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatBox label="Train" value={data.trainName} icon="🚆" />
              <StatBox label="Departure" value={data.departureTime || '—'} icon="🕐" />
              <StatBox label="Platform" value={data.platform || '—'} icon="🔢" />
              <StatBox label="PNR" value={data.pnr || '—'} icon="🎫" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }) => (
  <div className="glass rounded-xl p-3 text-center hover:bg-white/5 transition-all duration-200">
    <div className="text-lg mb-1">{icon}</div>
    <div className="text-white font-semibold text-sm truncate">{value}</div>
    <div className="text-gray-500 text-xs mt-0.5">{label}</div>
  </div>
);

export default ResultCard;

import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, subtext, delay = 0, isHighlight = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative overflow-hidden rounded-2xl border ${
        isHighlight 
          ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30' 
          : 'glass-panel border-white/5'
      } p-6 group transition-all duration-300 hover:border-white/20`}
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${isHighlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-400 group-hover:text-white'} transition-colors`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <p className={`text-3xl font-bold tracking-tight mb-1 ${isHighlight ? 'text-white' : 'text-gray-100'}`}>
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-gray-500 font-medium">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;

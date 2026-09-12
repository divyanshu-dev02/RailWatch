import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Cpu, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative pt-28 pb-12 overflow-hidden text-center">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Network Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 shadow-inner"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span>INDIAN RAILWAYS LIVE MONITORING</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono">10 Major Junctions</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-5 leading-tight"
        >
          Predict Station Congestion. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Prevent Stampede Bottlenecks.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-8 leading-relaxed"
        >
          Engineered for high-density railway networks. Utilizes a <span className="text-indigo-300 font-medium">45-minute rolling time-window</span> around train departures, calculates <span className="text-indigo-300 font-medium">per-platform passenger density</span>, and runs <span className="text-indigo-300 font-medium">what-if delay cascading simulations</span> to safeguard commuters.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium"
        >
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>45-Min Rolling Window</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Platform Stampede Shield</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cascade Delay Sandbox</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>QR Digital Travel Pass</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

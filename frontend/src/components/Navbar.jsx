import React from "react";
import { Train, Shield, Activity, Github } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-sans">
                  Rail<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Watch</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wider uppercase font-semibold">
                Predictive Congestion & Stampede Prevention
              </p>
            </div>
          </div>

          {/* Center Live Network Telemetry Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white">LIVE TELEMETRY:</span>
            <span className="text-slate-400">10 Indian Rail Junctions Monitored</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-mono font-medium">45-Min Rolling Window Engine</span>
          </div>

          {/* Quick Links / Status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Systems Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

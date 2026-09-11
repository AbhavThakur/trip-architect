import React, { useState, useEffect } from "react";
import { Compass, AlertCircle, Lock, Download, ArrowLeft, Clock } from "lucide-react";

export default function Header({ currentTrip, onBack, onOpenSos, onLock, onInstallPrompt, canInstall }) {
  const [localTime, setLocalTime] = useState("");
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    function updateClocks() {
      const now = new Date();
      // IST (UTC+5:30)
      setIstTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));

      if (currentTrip?.category === "international" && currentTrip?.destination?.toLowerCase().includes("vietnam")) {
        // Vietnam (UTC+7:00)
        setLocalTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" }));
      } else {
        setLocalTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
      }
    }
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [currentTrip]);

  return (
    <header className="bg-slate-950/95 sticky top-0 z-40 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Branding or Back Button */}
        <div className="flex items-center gap-2.5">
          {currentTrip ? (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">All Expeditions</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase font-display leading-tight">
                {currentTrip ? currentTrip.title : "Travel Architect"}
              </h1>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-mono block">
                {currentTrip ? (currentTrip.flag + " " + currentTrip.dates) : "Master Multi-Trip System"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Dual Timezone Clocks (if international) */}
        {currentTrip?.category === "international" && localTime ? (
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Vietnam:</span>
            <strong className="text-amber-300 font-bold">{localTime}</strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">India:</span>
            <strong className="text-emerald-300 font-bold">{istTime}</strong>
          </div>
        ) : null}

        {/* Right: Actions (PWA Install, SOS, Lock) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {canInstall && (
            <button
              onClick={onInstallPrompt}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              title="Install Travel Architect App to Home Screen"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          <button
            onClick={onOpenSos}
            className="px-2.5 sm:px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            title="Emergency SOS & Medical ICE"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>SOS</span>
          </button>

          <button
            onClick={onLock}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Lock Vault"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import * as React from "react";
import {
  Compass,
  AlertCircle,
  Lock,
  Download,
  ArrowLeft,
  Clock,
  Cloud,
  CloudOff,
  Sun,
  Moon,
  Coins,
  Car,
  Shield,
  HeartPulse,
  UserCheck,
  Scale
} from "lucide-react";

export default function Header({
  currentTrip,
  onBack,
  onOpenSos,
  onLock,
  onInstallPrompt,
  canInstall,
  onOpenSyncModal,
  isCloudSynced,
  onOpenFx,
  onOpenTaxi,
  onOpenDocs, onOpenLostSos, onOpenLuggage,
  seniorMode,
  onToggleSeniorMode,
  theme,
  onToggleTheme
}) {
  const [localTime, setLocalTime] = React.useState("");
  const [istTime, setIstTime] = React.useState("");
  const [countdown, setCountdown] = React.useState("");

  React.useEffect(() => {
    function updateClocks() {
      const now = new Date();
      setIstTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));

      if (currentTrip?.category === "international" && currentTrip?.destination?.toLowerCase().includes("vietnam")) {
        setLocalTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" }));
      } else {
        setLocalTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
      }

      // Calculate countdown to Dec 3, 2026 (or trip startDate)
      const targetDate = new Date(currentTrip?.startDate || "2026-12-03T23:00:00");
      const diffMs = targetDate - now;
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        setCountdown(`⏳ Departs in ${days}d ${hours}h • ${currentTrip?.travelers || "5 Adults"}`);
      } else {
        setCountdown(`✈️ Expedition Underway • ${currentTrip?.dates || ""}`);
      }
    }

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [currentTrip]);

  return (
    <header className="bg-slate-950/95 dark:bg-slate-950/95 text-white sticky top-0 z-40 border-b border-slate-800 backdrop-blur-md transition-colors">
      {/* Top Bar with HUD Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs">
        {/* Left: Branding & Clocks */}
        <div className="flex items-center gap-2 shrink-0">
          {currentTrip && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800:bg-slate-200 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Back to Master Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Trip Hub</span>
            </button>
          )}

          {/* Dual Timezone Clocks */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            {currentTrip?.category === "international" && (
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400">🇻🇳</span>
                <strong className="text-amber-400 font-bold">{localTime}</strong>
              </div>
            )}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400">🇮🇳</span>
              <span className="text-slate-300 font-bold">{istTime}</span>
            </div>
          </div>
        </div>

        {/* Right: Instant Action Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* FX Converter */}
          {onOpenFx && (
            <button
              onClick={onOpenFx}
              className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] active:scale-95 transition-all shadow-sm"
              title="Live Currency FX Calculator"
            >
              <Coins className="w-3 h-3 text-amber-300" />
              <span className="hidden xs:inline">FX</span>
            </button>
          )}

          {/* Taxi Driver Address Card */}
          {onOpenTaxi && (
            <button
              onClick={onOpenTaxi}
              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg flex items-center gap-1 text-[11px] active:scale-95 transition-all shadow-sm"
              title="Show Taxi Driver Address in Vietnamese"
            >
              <Car className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Taxi</span>
            </button>
          )}

          {/* Senior Pace Toggle */}
          {onToggleSeniorMode && (
            <button
              onClick={onToggleSeniorMode}
              className={"px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all " + (
                seniorMode
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold"
                  : "bg-slate-900 text-slate-300 border-slate-800"
              )}
              title="Toggle Senior Pace Comfort Mode (for Senior Parents)"
            >
              <UserCheck className="w-3 h-3" />
              <span className="hidden md:inline">{seniorMode ? "Senior Pace ON" : "Senior Comfort"}</span>
            </button>
          )}

          {/* Emergency SOS */}
          <button
            onClick={onOpenSos}
            className="px-2 py-1 bg-rose-950/70 hover:bg-rose-900:bg-rose-200 text-rose-300 border border-rose-500/40 rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title="Emergency Medical ICE SOS"
          >
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>SOS</span>
          </button>

          {/* Docs Vault */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="px-2 py-1 bg-indigo-950/70 hover:bg-indigo-900:bg-indigo-200 text-indigo-300 border border-indigo-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
              title="Passports & E-Visas Vault"
            >
              <Shield className="w-3 h-3 text-indigo-400" />
              <span className="hidden md:inline">Docs</span>
            </button>
          )}

          {/* Supabase Cloud Sync */}
          <button
            onClick={onOpenSyncModal}
            className={"px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all " + (
              isCloudSynced
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800"
            )}
            title={isCloudSynced ? "Supabase Cloud Sync Active" : "Local Mode (Click to connect Cloud)"}
          >
            {isCloudSynced ? <Cloud className="w-3 h-3 text-emerald-400" /> : <CloudOff className="w-3 h-3 text-amber-400" />}
            <span className="hidden sm:inline">{isCloudSynced ? "Synced" : "Cloud"}</span>
          </button>

          {/* Lost SOS Beacon */}
          {onOpenLostSos && (
            <button
              onClick={onOpenLostSos}
              className="w-7 h-7 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg flex items-center justify-center text-xs active:scale-95 transition-all shadow-sm"
              title="Lost SOS Beacon (Show to locals & Share GPS)"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Luggage Weight Calculator */}
          {onOpenLuggage && (
            <button
              onClick={onOpenLuggage}
              className="px-2 py-1 bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
              title="Souvenir & Baggage Weight Estimator (25kg allowance)"
            >
              <Scale className="w-3 h-3 text-purple-400" />
              <span className="hidden lg:inline">Luggage</span>
            </button>
          )}

          {/* Lock Vault */}
          <button
            onClick={onLock}
            className="p-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 text-[11px]"
            title="Lock Vault"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-7 h-7 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 flex items-center justify-center text-xs hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Theme"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Subheader Banner with Countdown */}
      <div className="bg-slate-900/90 px-3.5 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-xs transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white text-xs shadow">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs truncate">
            {currentTrip ? currentTrip.title : "Travel Architect Master Hub"}
          </span>
        </div>

        <div className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1.5">
          <span>{countdown}</span>
        </div>
      </div>
    </header>
  );
}

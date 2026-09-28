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
  Scale,
  Ticket
} from "lucide-react";

export default function Header({
  currentTrip,
  activeView = "hub",
  onBack,
  onOpenSos,
  onLock,
  onInstallPrompt,
  canInstall,
  isStandalone = false,
  onOpenSyncModal,
  isCloudSynced,
  onOpenFx,
  onOpenTaxi,
  onOpenBookingDesk,
  onOpenDocs, onOpenLostSos, onOpenLuggage,
  seniorMode,
  onToggleSeniorMode,
  theme,
  onToggleTheme
}) {
  const [localTime, setLocalTime] = React.useState("");
  const [istTime, setIstTime] = React.useState("");
  const [countdown, setCountdown] = React.useState("");
  const [mobileCountdown, setMobileCountdown] = React.useState("");

  React.useEffect(() => {
    function updateClocks() {
      const now = new Date();
      setIstTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));

      if (currentTrip?.category === "international" && currentTrip?.destination?.toLowerCase().includes("vietnam")) {
        setLocalTime(now.toLocaleTimeString("en-US", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" }));
      } else {
        setLocalTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
      }

      if (activeView === "passport") {
        setCountdown("Level 4 Explorer • 6,000 XP");
        setMobileCountdown("Vol. 2026");
        return;
      }

      if (!currentTrip) {
        setCountdown("3 Active Expeditions");
        setMobileCountdown("3 Trips");
        return;
      }

      if (currentTrip.status === "past") {
        setCountdown("✓ Completed Expedition");
        setMobileCountdown("✓ Completed");
        return;
      }

      // Calculate countdown to trip startDate
      const targetDate = new Date(currentTrip?.startDate || "2026-12-03T23:00:00");
      const diffMs = targetDate - now;
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        
        // Compact for mobile screens to prevent clustering and line wraps
        setMobileCountdown(`⏳ In ${days}d ${hours}h`);
        
        // Clean summary for larger screens (e.g. "2 Travelers" instead of entire parenthesis list)
        const paxSummary = currentTrip.travelers ? currentTrip.travelers.split("(")[0].trim() : "Travelers";
        setCountdown(`⏳ Departs in ${days}d ${hours}h • ${paxSummary}`);
      } else {
        setCountdown(`✈️ Expedition Underway • ${currentTrip?.dates || ""}`);
        setMobileCountdown("✈️ Underway");
      }
    }

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [currentTrip, activeView]);

  return (
    <header className="bg-slate-950/95 dark:bg-slate-950/95 text-white sticky top-0 z-40 border-b border-slate-800 backdrop-blur-md transition-colors">
      {/* Top Bar with HUD Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs">
        {/* Left: Branding & Clocks */}
        <div className="flex items-center gap-2 shrink-0">
          {(currentTrip || activeView === "passport") && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"
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
          {/* Install App on Phone CTA */}
          {onInstallPrompt && !isStandalone && (
            <button
              onClick={onInstallPrompt}
              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-lg flex items-center gap-1 text-[11px] active:scale-95 transition-all shadow-sm ring-1 ring-emerald-400/60"
              title="Install Travel Architect App to Phone"
            >
              <Download className="w-3 h-3 text-emerald-200" />
              <span>Install App</span>
            </button>
          )}

          {/* FX Converter (Desktop / Tablet) */}
          {onOpenFx && (
            <button
              onClick={onOpenFx}
              className="hidden sm:flex px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-lg items-center gap-1 text-[11px] active:scale-95 transition-all shadow-sm"
              title="Live Currency FX Calculator"
            >
              <Coins className="w-3 h-3 text-amber-300" />
              <span>FX</span>
            </button>
          )}

          {/* Taxi Driver Address Card (Desktop / Tablet) */}
          {onOpenTaxi && (
            <button
              onClick={onOpenTaxi}
              className="hidden sm:flex px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg items-center gap-1 text-[11px] active:scale-95 transition-all shadow-sm"
              title="Show Taxi Driver Address in Local Language"
            >
              <Car className="w-3 h-3 text-amber-300" />
              <span>Taxi</span>
            </button>
          )}

          {/* Senior Pace Toggle (Desktop) */}
          {onToggleSeniorMode && (
            <button
              onClick={onToggleSeniorMode}
              className={"hidden md:flex px-2 py-1 rounded-lg border text-[11px] font-bold items-center gap-1 transition-all " + (
                seniorMode
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold"
                  : "bg-slate-900 text-slate-300 border-slate-800"
              )}
              title="Toggle Senior Pace Comfort Mode"
            >
              <UserCheck className="w-3 h-3" />
              <span>{seniorMode ? "Senior Pace ON" : "Senior Comfort"}</span>
            </button>
          )}

          {/* Emergency SOS (Always Visible for Safety) */}
          <button
            onClick={onOpenSos}
            className="px-2 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 rounded-lg text-[11px] font-black flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title="Emergency Medical ICE SOS"
          >
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <span>SOS</span>
          </button>

          {/* Docs Vault (Desktop) */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="hidden md:flex px-2 py-1 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 rounded-lg text-[11px] font-bold items-center gap-1 transition-all"
              title="Passports & E-Visas Vault"
            >
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>Docs</span>
            </button>
          )}

          {/* Supabase Cloud Sync (Desktop) */}
          <button
            onClick={onOpenSyncModal}
            className={"hidden md:flex px-2 py-1 rounded-lg border text-[11px] font-bold items-center gap-1 transition-all " + (
              isCloudSynced
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                : "bg-slate-900 text-slate-400 border-slate-800"
            )}
            title={isCloudSynced ? "Supabase Cloud Sync Active" : "Local Mode (Click to connect Cloud)"}
          >
            {isCloudSynced ? <Cloud className="w-3 h-3 text-emerald-400" /> : <CloudOff className="w-3 h-3 text-amber-400" />}
            <span>{isCloudSynced ? "Synced" : "Cloud"}</span>
          </button>

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

      {/* Subheader Banner with Title & Countdown */}
      <div className="bg-slate-900/95 px-3 sm:px-4 py-1.5 sm:py-2 border-t border-slate-800/80 flex items-center justify-between gap-2.5 text-xs transition-colors">
        {/* Left: Trip Title with Icon */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shrink-0 shadow">
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="font-bold text-white text-xs sm:text-sm truncate">
            {activeView === "passport"
              ? "Lifetime Travel Journey Book & Memoir"
              : currentTrip
              ? currentTrip.title
              : "Travel Architect Master Hub"}
          </span>
        </div>

        {/* Right: Clean, un-squished Countdown Badge */}
        <div className="shrink-0 flex items-center">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-sm">
            <span className="sm:hidden">{mobileCountdown}</span>
            <span className="hidden sm:inline">{countdown}</span>
          </span>
        </div>
      </div>
    </header>
  );
}

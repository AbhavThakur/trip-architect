import React, { useState, useEffect } from "react";
import { getRegisteredTrips, saveCustomTrip, deleteCustomTrip } from "./data/trips/registry";
import Header from "./components/Header";
import HubPage from "./pages/HubPage";
import TripDetailPage from "./pages/TripDetailPage";
import PinLockModal from "./components/PinLockModal";
import EmergencySosModal from "./components/EmergencySosModal";
import InstallPromptModal from "./components/InstallPromptModal";
import SupabaseSyncModal from "./components/SupabaseSyncModal";
import TaxiCardModal from "./components/TaxiCardModal";
import DocsVaultModal from "./components/DocsVaultModal";
import CurrencyConverter from "./components/CurrencyConverter";
import LuggageModal from "./components/LuggageModal";
import LostSosModal from "./components/LostSosModal";
import BookingDesk from "./components/BookingDesk";
import LifetimeJourneyBookPage from "./pages/LifetimeJourneyBookPage";
import { getSupabaseConfig } from "./services/supabase";
import { X, Coins, WifiOff, Smartphone, Download } from "lucide-react";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeView, setActiveView] = useState("hub"); // "hub" | "trip" | "passport"
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
  const [activeTaxiStop, setActiveTaxiStop] = useState(null);

  const handleOpenTaxi = (stop = null) => {
    setActiveTaxiStop(stop || null);
    setIsTaxiModalOpen(true);
  };
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);
  const [isLuggageModalOpen, setIsLuggageModalOpen] = useState(false);
  const [isLostSosModalOpen, setIsLostSosModalOpen] = useState(false);
  const [isBookingDeskOpen, setIsBookingDeskOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);
  const [theme, setTheme] = useState("light");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Initialize Theme and Senior Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("travel_theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    const savedSenior = localStorage.getItem("travel_senior_mode") === "true";
    setSeniorMode(savedSenior);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("travel_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const toggleSeniorMode = () => {
    const nextSenior = !seniorMode;
    setSeniorMode(nextSenior);
    localStorage.setItem("travel_senior_mode", nextSenior ? "true" : "false");
  };

  useEffect(() => {
    const loadedTrips = getRegisteredTrips();
    setTrips(loadedTrips);

    const cfg = getSupabaseConfig();
    setIsCloudSynced(cfg.enabled);

    function handleRoute() {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view") || params.get("page");
      if (viewParam === "passport" || viewParam === "memoir") {
        setActiveView("passport");
        setSelectedTripId(null);
        return;
      }

      const tripParam = params.get("trip");
      if (tripParam) {
        const paramLower = tripParam.toLowerCase();
        const match = loadedTrips.find((t) => {
          const idLower = t.id.toLowerCase();
          return (
            idLower === paramLower ||
            idLower.includes(paramLower) ||
            paramLower.includes(idLower) ||
            (paramLower.includes("vietnam") && idLower.includes("vietnam")) ||
            (paramLower.includes("hampi") && idLower.includes("hampi"))
          );
        });
        if (match) {
          setSelectedTripId(match.id);
          setActiveView("trip");
          return;
        }
      }

      setSelectedTripId(null);
      setActiveView("hub");
    }

    handleRoute();
    window.addEventListener("popstate", handleRoute);

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    // Detect if running in standalone mode (already installed as PWA)
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Show install banner if not standalone and not dismissed
    if (!standalone && sessionStorage.getItem("dismiss_install_banner") !== "true") {
      setShowInstallBanner(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!standalone) setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Network connectivity listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("popstate", handleRoute);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const navigateToTrip = (tripId) => {
    setSelectedTripId(tripId);
    setActiveView("trip");
    const newUrl = tripId ? "?trip=" + tripId : window.location.pathname;
    window.history.pushState({ tripId, view: "trip" }, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToPassport = () => {
    setSelectedTripId(null);
    setActiveView("passport");
    window.history.pushState({ view: "passport" }, "", "?view=passport");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateBack = () => {
    setSelectedTripId(null);
    setActiveView("hub");
    window.history.pushState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInstallClick = () => {
    setIsInstallModalOpen(true);
  };

  const handleNativePrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setIsInstallModalOpen(false);
      });
    }
  };

  const handleAddTrip = (newTrip, launchAfter = false) => {
    const updated = saveCustomTrip(newTrip);
    setTrips(updated);
    if (launchAfter) {
      navigateToTrip(newTrip.id);
    }
  };

  const handleDeleteTrip = (tripId) => {
    const updated = deleteCustomTrip(tripId);
    setTrips(updated);
  };

  const currentTrip = trips.find((t) => t.id === selectedTripId);

  return (
    <div className={"min-h-screen flex flex-col font-sans antialiased transition-colors " + (
      theme === "light"
        ? "bg-[#f8fafc] text-slate-900"
        : "bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-white"
    )}>
      {/* Network Offline Notification Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-between text-center sticky top-0 z-50 shadow-md">
          <span className="flex items-center justify-center gap-1.5 mx-auto">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            Offline Mode Active • Saved itineraries, passes &amp; taxi cards are ready
          </span>
        </div>
      )}

      {/* Smart Mobile App Install Banner */}
      {!isStandalone && showInstallBanner && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white border-b border-emerald-500/30 px-3 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs shadow-md sticky top-0 z-40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="font-extrabold text-emerald-300 block text-[11px] leading-tight">Install Travel Architect App</span>
              <span className="text-[10px] text-slate-300 truncate block">100% offline access &amp; fast full-screen phone mode</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>
            <button
              onClick={() => {
                setShowInstallBanner(false);
                sessionStorage.setItem("dismiss_install_banner", "true");
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top HUD Header with Full Controls */}
      <Header
        currentTrip={currentTrip}
        activeView={activeView}
        onBack={navigateBack}
        onOpenSos={() => setIsSosOpen(true)}
        onLock={() => {
          sessionStorage.removeItem("travel_architect_unlocked");
          window.location.reload();
        }}
        onInstallPrompt={handleInstallClick}
        canInstall={!isStandalone}
        isStandalone={isStandalone}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isCloudSynced={isCloudSynced}
        onOpenFx={() => setIsFxModalOpen(true)}
        onOpenTaxi={() => handleOpenTaxi(null)}
        onOpenBookingDesk={() => setIsBookingDeskOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenLostSos={() => setIsLostSosModalOpen(true)}
        onOpenLuggage={() => setIsLuggageModalOpen(true)}
        seniorMode={seniorMode}
        onToggleSeniorMode={toggleSeniorMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === "passport" ? (
          <LifetimeJourneyBookPage
            onBack={navigateBack}
            onSelectTrip={navigateToTrip}
            allTrips={trips}
          />
        ) : activeView === "trip" && currentTrip ? (
          <TripDetailPage
            trip={currentTrip}
            onBack={navigateBack}
            seniorMode={seniorMode}
            onOpenTaxi={() => handleOpenTaxi(null)}
            onOpenDocs={() => setIsDocsModalOpen(true)}
            onOpenLostSos={() => setIsLostSosModalOpen(true)}
            onOpenLuggage={() => setIsLuggageModalOpen(true)}
            onOpenFx={() => setIsFxModalOpen(true)}
          />
        ) : (
          <HubPage
            trips={trips}
            onSelectTrip={navigateToTrip}
            onOpenPassport={navigateToPassport}
            onAddTrip={handleAddTrip}
            onDeleteTrip={handleDeleteTrip}
            onInstallPrompt={handleInstallClick}
            isStandalone={isStandalone}
          />
        )}
      </main>

      {/* Supabase Cloud Sync Modal */}
      <SupabaseSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        allTrips={trips}
        onSyncSuccess={() => {
          const cfg = getSupabaseConfig();
          setIsCloudSynced(cfg.enabled);
        }}
      />

      {/* Taxi Driver Address Card Modal */}
      <TaxiCardModal
        isOpen={isTaxiModalOpen}
        onClose={() => {
          setIsTaxiModalOpen(false);
          setActiveTaxiStop(null);
        }}
        customStop={activeTaxiStop}
        currentTrip={currentTrip}
      />

      {/* Family Travel Docs Vault Modal */}
      <DocsVaultModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        docs={currentTrip?.familyDocs || []}
      />

      {/* Live FX Currency Modal */}
      {isFxModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                Live Currency FX Calculator
              </h4>
              <button
                onClick={() => setIsFxModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CurrencyConverter currency={currentTrip?.currency} />
          </div>
        </div>
      )}

      {/* PIN Security Overlay */}
      <PinLockModal />

      {/* Luggage Weight Estimator Modal */}
      <LuggageModal
        isOpen={isLuggageModalOpen}
        onClose={() => setIsLuggageModalOpen(false)}
      />

      {/* Lost SOS Beacon Modal */}
      <LostSosModal
        isOpen={isLostSosModalOpen}
        onClose={() => setIsLostSosModalOpen(false)}
        trip={currentTrip}
      />

      {/* Universal Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        trip={currentTrip}
      />

      {/* Universal Trip Booking Command Desk Modal */}
      <BookingDesk
        isOpen={isBookingDeskOpen}
        onClose={() => setIsBookingDeskOpen(false)}
        trip={currentTrip}
      />

      {/* PWA Install Guidance Modal */}
      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={handleNativePrompt}
        isIos={isIos}
        hasDeferredPrompt={!!deferredPrompt}
      />
    </div>
  );
}

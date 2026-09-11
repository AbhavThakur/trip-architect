import React, { useState, useEffect } from "react";
import { getRegisteredTrips } from "./data/trips/registry";
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
import { getSupabaseConfig } from "./services/supabase";
import { X, Coins } from "lucide-react";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isFxModalOpen, setIsFxModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);

  // Initialize Theme and Senior Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("travel_theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
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
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
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
            (paramLower.includes("chikmagalur") && idLower.includes("chikmagalur"))
          );
        });
        if (match) setSelectedTripId(match.id);
      } else {
        setSelectedTripId(null);
      }
    }

    handleRoute();
    window.addEventListener("popstate", handleRoute);

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("popstate", handleRoute);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const navigateToTrip = (tripId) => {
    setSelectedTripId(tripId);
    const newUrl = tripId ? "?trip=" + tripId : window.location.pathname;
    window.history.pushState({ tripId }, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateBack = () => {
    setSelectedTripId(null);
    window.history.pushState({}, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const currentTrip = trips.find((t) => t.id === selectedTripId);

  return (
    <div className={"min-h-screen flex flex-col font-sans antialiased transition-colors " + (
      theme === "light"
        ? "bg-[#f8fafc] text-slate-800"
        : "bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-white"
    )}>
      {/* Top HUD Header with Full Controls */}
      <Header
        currentTrip={currentTrip}
        onBack={navigateBack}
        onOpenSos={() => setIsSosOpen(true)}
        onLock={() => {
          sessionStorage.removeItem("travel_architect_unlocked");
          window.location.reload();
        }}
        onInstallPrompt={handleInstallClick}
        canInstall={true}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isCloudSynced={isCloudSynced}
        onOpenFx={() => setIsFxModalOpen(true)}
        onOpenTaxi={() => setIsTaxiModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        seniorMode={seniorMode}
        onToggleSeniorMode={toggleSeniorMode}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTrip ? (
          <TripDetailPage
            trip={currentTrip}
            onBack={navigateBack}
            seniorMode={seniorMode}
            onOpenTaxi={() => setIsTaxiModalOpen(true)}
            onOpenDocs={() => setIsDocsModalOpen(true)}
            onOpenFx={() => setIsFxModalOpen(true)}
          />
        ) : (
          <HubPage
            trips={trips}
            onSelectTrip={navigateToTrip}
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
        onClose={() => setIsTaxiModalOpen(false)}
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

      {/* Universal Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

      {/* PWA Install Guidance Modal */}
      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={handleInstallClick}
        isIos={isIos}
      />
    </div>
  );
}

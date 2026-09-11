import React, { useState, useEffect } from "react";
import { getRegisteredTrips } from "./data/trips/registry";
import Header from "./components/Header";
import HubPage from "./pages/HubPage";
import TripDetailPage from "./pages/TripDetailPage";
import PinLockModal from "./components/PinLockModal";
import EmergencySosModal from "./components/EmergencySosModal";
import InstallPromptModal from "./components/InstallPromptModal";
import SupabaseSyncModal from "./components/SupabaseSyncModal";
import { getSupabaseConfig } from "./services/supabase";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const loadedTrips = getRegisteredTrips();
    setTrips(loadedTrips);

    // Supabase config check
    const cfg = getSupabaseConfig();
    setIsCloudSynced(cfg.enabled);

    // Initial route check from URL query param ?trip=...
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

    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    // Capture beforeinstallprompt for Chrome/Edge/Android
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top HUD Header */}
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
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTrip ? (
          <TripDetailPage
            trip={currentTrip}
            onBack={navigateBack}
            onOpenSos={() => setIsSosOpen(true)}
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

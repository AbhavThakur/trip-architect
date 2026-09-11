import React, { useState, useEffect } from "react";
import {
  Calendar, MapPin, Users, Plane, Bus, Building,
  Calculator, ClipboardCheck, Volume2, ArrowLeft,
  Share2, Compass, AlertCircle, Cloud, CheckCircle,
  ShoppingBag, Shield, Coins, Sparkles, UserCheck
} from "lucide-react";

import ItineraryTimeline from "../components/ItineraryTimeline";
import FlightMatrix from "../components/FlightMatrix";
import TransitLogistics from "../components/TransitLogistics";
import StaysDirectory from "../components/StaysDirectory";
import SplitBudget from "../components/SplitBudget";
import PackingChecklist from "../components/PackingChecklist";
import VegDiningAudio from "../components/VegDiningAudio";
import CurrencyConverter from "../components/CurrencyConverter";
import LimousineHub from "../components/LimousineHub";
import ShoppingGuide from "../components/ShoppingGuide";
import BottomNav from "../components/BottomNav";
import { fetchTripFromCloud, saveTripToCloud, subscribeToTripUpdates } from "../services/supabase";

export default function TripDetailPage({
  trip: initialTrip,
  onBack,
  seniorMode = false,
  onOpenTaxi,
  onOpenDocs,
  onOpenFx
}) {
  const [trip, setTrip] = useState(initialTrip);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [syncStatus, setSyncStatus] = useState("loading");
  const [saveIndicator, setSaveIndicator] = useState("");

  // Load from Supabase or local cache
  useEffect(() => {
    let isMounted = true;
    fetchTripFromCloud(initialTrip.id, initialTrip).then((res) => {
      if (isMounted && res.data) {
        setTrip(res.data);
        setSyncStatus(res.source);
      }
    });

    const unsub = subscribeToTripUpdates(initialTrip.id, (freshData) => {
      if (isMounted && freshData) {
        setTrip(freshData);
        setSaveIndicator("Synced from Cloud!");
        setTimeout(() => setSaveIndicator(""), 3000);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [initialTrip.id]);

  const handleUpdateStop = async (dayIdx, stopIdx, updatedStop) => {
    const nextTrip = JSON.parse(JSON.stringify(trip));
    const targetDay = nextTrip.itinerary[dayIdx];
    if (!targetDay) return;

    if (targetDay.places && targetDay.places[stopIdx]) {
      targetDay.places[stopIdx] = { ...targetDay.places[stopIdx], ...updatedStop };
    } else if (targetDay.events && targetDay.events[stopIdx]) {
      targetDay.events[stopIdx] = {
        ...targetDay.events[stopIdx],
        ...updatedStop,
        title: updatedStop.name || updatedStop.title,
        name: updatedStop.name || updatedStop.title
      };
    } else if (targetDay.stops && targetDay.stops[stopIdx]) {
      targetDay.stops[stopIdx] = { ...targetDay.stops[stopIdx], ...updatedStop };
    }

    setTrip(nextTrip);
    setSaveIndicator("Saving to Cloud...");
    const res = await saveTripToCloud(nextTrip.id, nextTrip);
    setSaveIndicator(res.source === "cloud_saved" ? "Saved to Supabase!" : "Saved Locally");
    setTimeout(() => setSaveIndicator(""), 3000);
  };

  const handleSaveBudget = async (newBudget) => {
    const nextTrip = { ...trip, budget: newBudget };
    setTrip(nextTrip);
    setSaveIndicator("Saving Budget...");
    const res = await saveTripToCloud(nextTrip.id, nextTrip);
    setSaveIndicator(res.source === "cloud_saved" ? "Saved to Supabase!" : "Saved Locally");
    setTimeout(() => setSaveIndicator(""), 3000);
  };

  const hasFlights = trip.flights && trip.flights.length > 0;
  const hasTransit = !!trip.transit;
  const hasLimo = trip.limoTransfers && trip.limoTransfers.length > 0;
  const hasShopping = trip.shopping && trip.shopping.length > 0;
  const hasVegDining = !!trip.vegDining;
  const hasCurrency = !!trip.currency;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 pb-24 lg:pb-8">
      {/* Trip Hero Banner */}
      <div className={"relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 bg-gradient-to-br " + (trip.heroGradient || "from-slate-900 to-slate-950")}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl">{trip.flag}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-white/90 text-xs font-bold font-mono border border-white/10">
                {trip.badge || (trip.daysCount + " Days")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {trip.status === "upcoming" ? "Upcoming Expedition" : "Past Journey"}
              </span>

              {/* Cloud Sync Status Pill */}
              <span className={"px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 " + (
                syncStatus === "cloud"
                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-900/80 text-amber-300 border-slate-700"
              )}>
                <Cloud className="w-3 h-3" />
                <span>{syncStatus === "cloud" ? "Supabase Synced" : "Local Storage"}</span>
              </span>

              {seniorMode && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Senior Pace Active</span>
                </span>
              )}

              {saveIndicator && (
                <span className="text-xs font-mono font-bold text-amber-300 animate-pulse bg-black/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {saveIndicator}
                </span>
              )}
            </div>

            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Hub</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              {trip.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-2xl leading-relaxed">
              {trip.summary}
            </p>
          </div>

          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="bg-black/30 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Destination</span>
              <strong className="text-white text-xs block truncate mt-0.5">{trip.destination}</strong>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Travel Dates</span>
              <strong className="text-white text-xs block truncate mt-0.5">{trip.dates}</strong>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Travelers</span>
              <strong className="text-white text-xs block truncate mt-0.5">{trip.travelers}</strong>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Basecamp</span>
              <strong className="text-amber-300 text-xs block truncate mt-0.5">
                {trip.basecamp?.name ? trip.basecamp.name.split("(")[0] : "Confirmed Stay"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Tabs (All 9 Tabs) */}
      <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
            activeTab === "itinerary"
              ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Itinerary & Map</span>
        </button>

        {trip.checklist && (
          <button
            onClick={() => setActiveTab("checklist")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "checklist"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Pre-Departure Checklist</span>
          </button>
        )}

        {(trip.stays || trip.hotels) && (
          <button
            onClick={() => setActiveTab("stays")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "stays"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Hotels & Stays</span>
          </button>
        )}

        {(hasFlights || hasTransit) && (
          <button
            onClick={() => setActiveTab("mobility")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "mobility"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            {hasFlights ? <Plane className="w-3.5 h-3.5" /> : <Bus className="w-3.5 h-3.5" />}
            <span>{hasFlights ? "Flight Matrix & PNRs" : "Sleeper Bus & Transit"}</span>
          </button>
        )}

        {hasLimo && (
          <button
            onClick={() => setActiveTab("limo")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "limo"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Bus className="w-3.5 h-3.5 text-emerald-400" />
            <span>9-Seater Limousine Hub</span>
          </button>
        )}

        {hasVegDining && (
          <button
            onClick={() => setActiveTab("dining")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "dining"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Veg Dining & Audio</span>
          </button>
        )}

        {hasShopping && (
          <button
            onClick={() => setActiveTab("shopping")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "shopping"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
            <span>Shopping & 50% Bargaining</span>
          </button>
        )}

        {trip.budget && (
          <button
            onClick={() => setActiveTab("budget")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "budget"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Calculator className="w-3.5 h-3.5 text-purple-400" />
            <span>Split Budget</span>
          </button>
        )}

        {hasCurrency && (
          <button
            onClick={() => setActiveTab("tools")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "tools"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Coins className="w-3.5 h-3.5 text-gold-400" />
            <span>Tools & FX</span>
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === "itinerary" && (
          <ItineraryTimeline
            days={trip.itinerary}
            tripTitle={trip.title}
            onUpdateStop={handleUpdateStop}
            seniorMode={seniorMode}
            onOpenTaxi={onOpenTaxi}
          />
        )}

        {activeTab === "checklist" && (
          <PackingChecklist tripId={trip.id} checklist={trip.checklist} />
        )}

        {activeTab === "stays" && (
          <StaysDirectory stays={trip.stays} hotels={trip.hotels} />
        )}

        {activeTab === "mobility" && (
          <div className="space-y-6">
            {hasFlights && <FlightMatrix flights={trip.flights} />}
            {hasTransit && <TransitLogistics transit={trip.transit} />}
          </div>
        )}

        {activeTab === "limo" && (
          <LimousineHub limoTransfers={trip.limoTransfers} />
        )}

        {activeTab === "dining" && (
          <VegDiningAudio vegDining={trip.vegDining} />
        )}

        {activeTab === "shopping" && (
          <ShoppingGuide shopping={trip.shopping} />
        )}

        {activeTab === "budget" && (
          <SplitBudget budget={trip.budget} onSaveBudget={handleSaveBudget} />
        )}

        {activeTab === "tools" && (
          <div className="space-y-6">
            {hasCurrency && <CurrencyConverter currency={trip.currency} />}
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        hasMobility={hasFlights || hasTransit}
        isFlight={hasFlights}
        hasVegDining={hasVegDining}
        hasCurrency={hasCurrency}
      />
    </div>
  );
}

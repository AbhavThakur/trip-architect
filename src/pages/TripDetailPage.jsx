import React, { useState, useEffect, useRef } from "react";
import {
  Calendar, MapPin, Users, Plane, Bus, Building,
  Calculator, ClipboardCheck, Volume2, ArrowLeft,
  Share2, Compass, AlertCircle, Cloud, CheckCircle,
  ShoppingBag, Shield, Coins, Sparkles, UserCheck, ChevronLeft, ChevronRight, ArrowRight, RotateCcw
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
import TripAdvisorChat from "../components/TripAdvisorChat";
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
  const tabsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkTabsScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkTabsScroll();
    const handleResize = () => checkTabsScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -260 : 260,
        behavior: "smooth"
      });
      setTimeout(checkTabsScroll, 320);
    }
  };

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

  const handleForceRefresh = async () => {
    try {
      localStorage.removeItem("cached_trip_" + initialTrip.id);
      localStorage.removeItem("trip_architect_registry_custom");
    } catch (e) {}
    setTrip(initialTrip);
    setSaveIndicator("Reset to Latest 7-Day Blueprint!");
    await saveTripToCloud(initialTrip.id, initialTrip);
    setTimeout(() => setSaveIndicator(""), 3000);
  };

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

  const handleSaveHotels = async (newHotels) => {
    const nextTrip = { ...trip, hotels: newHotels, stays: newHotels };
    setTrip(nextTrip);
    setSaveIndicator("Saving Stays...");
    const res = await saveTripToCloud(nextTrip.id, nextTrip);
    setSaveIndicator(res.source === "cloud_saved" ? "Saved to Supabase!" : "Saved Locally");
    setTimeout(() => setSaveIndicator(""), 3000);
  };

  const handleSaveFlights = async (newFlights) => {
    const nextTrip = { ...trip, flights: newFlights };
    setTrip(nextTrip);
    setSaveIndicator("Saving Flights...");
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

              <button
                onClick={handleForceRefresh}
                title="Force refresh to latest official 7-day blueprint and clear stale cache"
                className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/60 flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sync Latest Blueprint</span>
              </button>

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

      {/* Navigation Tabs with Desktop & Mobile Scroll Arrows */}
      <div className="relative flex items-center bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder p-1.5 rounded-2xl shadow-sm group">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scrollTabs("left")}
          disabled={!canScrollLeft}
          title="Scroll Left"
          aria-label="Scroll Tabs Left"
          className={`flex-shrink-0 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            canScrollLeft
              ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
              : "opacity-25 cursor-not-allowed text-slate-400"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Tabs Track */}
        <nav
          ref={tabsContainerRef}
          onScroll={checkTabsScroll}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full px-1.5 py-0.5"
        >
          <button
            onClick={() => setActiveTab("itinerary")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "itinerary"
                ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Itinerary & Map</span>
          </button>

          {trip.checklist && (
            <button
              onClick={() => setActiveTab("checklist")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "checklist"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Pre-Departure Checklist</span>
            </button>
          )}

          {(trip.stays || trip.hotels) && (
            <button
              onClick={() => setActiveTab("stays")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "stays"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Hotels & Stays</span>
            </button>
          )}

          {(hasFlights || hasTransit) && (
            <button
              onClick={() => setActiveTab("mobility")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "mobility"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              {hasFlights ? <Plane className="w-3.5 h-3.5" /> : <Bus className="w-3.5 h-3.5 text-sky-400" />}
              <span>{hasFlights ? "Flight Matrix & PNRs" : "Sleeper Bus & Transit"}</span>
            </button>
          )}

          {hasLimo && (
            <button
              onClick={() => setActiveTab("limo")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "limo"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <Bus className="w-3.5 h-3.5 text-emerald-400" />
              <span>9-Seater Limousine Hub</span>
            </button>
          )}

          {hasVegDining && (
            <button
              onClick={() => setActiveTab("dining")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "dining"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Veg Dining & Audio</span>
            </button>
          )}

          {hasShopping && (
            <button
              onClick={() => setActiveTab("shopping")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "shopping"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
              <span>Shopping & Bargaining</span>
            </button>
          )}

          {(trip.budget || initialTrip.budget) && (
            <button
              onClick={() => setActiveTab("budget")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "budget"
                  ? "bg-purple-600 text-white shadow-md font-bold ring-2 ring-purple-400/40"
                  : "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-bold border border-purple-200 dark:border-purple-800/60"
              )}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Budget & Expenses</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ₹4.06L
              </span>
            </button>
          )}

          {hasCurrency && (
            <button
              onClick={() => setActiveTab("tools")}
              className={"px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
                activeTab === "tools"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
              )}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Tools & FX</span>
            </button>
          )}
        </nav>

        {/* Right Scroll Arrow with 'More' Hint */}
        <button
          onClick={() => scrollTabs("right")}
          disabled={!canScrollRight}
          title="Scroll right for Budget, Tools & more"
          aria-label="Scroll Tabs Right"
          className={`flex-shrink-0 z-10 h-8 px-2 sm:px-2.5 rounded-xl flex items-center justify-center gap-1 transition-all ${
            canScrollRight
              ? "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 dark:hover:bg-purple-900/90 text-purple-700 dark:text-purple-300 shadow-sm cursor-pointer font-bold text-xs"
              : "opacity-25 cursor-not-allowed text-slate-400"
          }`}
        >
          {canScrollRight && (
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              More
            </span>
          )}
          <ChevronRight className={`w-4 h-4 ${canScrollRight ? "animate-pulse" : ""}`} />
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === "itinerary" && (
          <ItineraryTimeline
            onOpenBudget={() => setActiveTab("budget")}
            days={trip.itinerary}
            tripTitle={trip.title}
            onUpdateStop={handleUpdateStop}
            seniorMode={seniorMode}
            onOpenTaxi={onOpenTaxi}
            hotels={trip.hotels || trip.stays}
            flights={trip.flights}
            onOpenHotelCard={onOpenTaxi}
            onSaveHotels={handleSaveHotels}
            onSaveFlights={handleSaveFlights}
          />
        )}

        {activeTab === "checklist" && (
          <PackingChecklist tripId={trip.id} checklist={trip.checklist} />
        )}

        {activeTab === "stays" && (
          <StaysDirectory stays={trip.stays} hotels={trip.hotels} onSaveHotels={handleSaveHotels} tripId={trip.id} />
        )}

        {activeTab === "mobility" && (
          <div className="space-y-6">
            {hasFlights && <FlightMatrix flights={trip.flights} onSaveFlights={handleSaveFlights} tripId={trip.id} />}
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
          <SplitBudget budget={trip.budget || initialTrip.budget} onSaveBudget={handleSaveBudget} />
        )}

        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-bold font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Trip Tools & Utilities
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Instant access to VIP limousine transfers, shopping bargaining guides, currency converters, and emergency services.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setActiveTab("limo")}
                className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-emerald-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-sm mb-2">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">9-Seater Limousine</strong>
                  <span className="text-slate-400 text-[10px]">9 Private legs & quote</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("shopping")}
                className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-pink-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center text-sm mb-2">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">Shopping & Bargaining</strong>
                  <span className="text-slate-400 text-[10px]">50% Rule & Markets</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("checklist")}
                className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-amber-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-sm mb-2">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">Phased Checklist</strong>
                  <span className="text-slate-400 text-[10px]">5 Readiness Phases</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("mobility")}
                className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-indigo-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-sm mb-2">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">Flight Matrix & PNRs</strong>
                  <span className="text-slate-400 text-[10px]">Inbound, DAD & Return</span>
                </div>
              </button>

              {onOpenTaxi && (
                <button
                  onClick={onOpenTaxi}
                  className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-rose-500 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-sm mb-2">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900 dark:text-white">Taxi Driver Card</strong>
                    <span className="text-slate-400 text-[10px]">Vietnamese Address & Phone</span>
                  </div>
                </button>
              )}

              {onOpenDocs && (
                <button
                  onClick={onOpenDocs}
                  className="bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-left flex flex-col justify-between hover:border-indigo-500 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-sm mb-2">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block font-bold text-slate-900 dark:text-white">Family Docs Vault</strong>
                    <span className="text-slate-400 text-[10px]">Passports & E-Visas PIN Safe</span>
                  </div>
                </button>
              )}
            </div>

            {hasCurrency && <CurrencyConverter currency={trip.currency} />}
          </div>
        )}
      </div>

      {/* Floating On-Ground Advisor Chat */}
      <TripAdvisorChat currentTrip={trip} />

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

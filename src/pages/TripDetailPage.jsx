import React, { useState } from "react";
import {
  Calendar, MapPin, Users, Plane, Bus, Building,
  Calculator, ClipboardCheck, Volume2, Shield, ArrowLeft,
  Share2, Compass, AlertCircle
} from "lucide-react";

import ItineraryTimeline from "../components/ItineraryTimeline";
import FlightMatrix from "../components/FlightMatrix";
import TransitLogistics from "../components/TransitLogistics";
import StaysDirectory from "../components/StaysDirectory";
import SplitBudget from "../components/SplitBudget";
import PackingChecklist from "../components/PackingChecklist";
import VegDiningAudio from "../components/VegDiningAudio";
import CurrencyConverter from "../components/CurrencyConverter";

export default function TripDetailPage({ trip, onBack, onOpenSos }) {
  if (!trip) return null;

  const [activeTab, setActiveTab] = useState("itinerary");

  const hasFlights = trip.flights && trip.flights.length > 0;
  const hasTransit = !!trip.transit;
  const hasVegDining = !!trip.vegDining;
  const hasCurrency = !!trip.currency;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full px-4 py-6">
      {/* Trip Hero Banner */}
      <div className={"relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 bg-gradient-to-br " + (trip.heroGradient || "from-slate-900 to-slate-950")}>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{trip.flag}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-white/90 text-xs font-bold font-mono border border-white/10">
                {trip.badge || (trip.daysCount + " Days")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {trip.status === "upcoming" ? "Upcoming Expedition" : "Past Journey"}
              </span>
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

      {/* Navigation Tab Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
            activeTab === "itinerary"
              ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Itinerary ({trip.itinerary ? trip.itinerary.length : 0} Days)</span>
        </button>

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
            <span>{hasFlights ? "Flights & PNRs" : "Sleeper Bus & Transit"}</span>
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
            <span>Stays & Vouchers</span>
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
            <Calculator className="w-3.5 h-3.5" />
            <span>Split Budget</span>
          </button>
        )}

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
            <span>Packing Checklist</span>
          </button>
        )}

        {(hasVegDining || hasCurrency) && (
          <button
            onClick={() => setActiveTab("veg_fx")}
            className={"px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all " + (
              activeTab === "veg_fx"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Veg Audio & FX</span>
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === "itinerary" && (
          <ItineraryTimeline days={trip.itinerary} tripTitle={trip.title} />
        )}

        {activeTab === "mobility" && (
          <div className="space-y-6">
            {hasFlights && <FlightMatrix flights={trip.flights} />}
            {hasTransit && <TransitLogistics transit={trip.transit} />}
          </div>
        )}

        {activeTab === "stays" && (
          <StaysDirectory stays={trip.stays} hotels={trip.hotels} />
        )}

        {activeTab === "budget" && (
          <SplitBudget budget={trip.budget} />
        )}

        {activeTab === "checklist" && (
          <PackingChecklist tripId={trip.id} checklist={trip.checklist} />
        )}

        {activeTab === "veg_fx" && (
          <div className="space-y-6">
            {hasCurrency && <CurrencyConverter currency={trip.currency} />}
            {hasVegDining && <VegDiningAudio vegDining={trip.vegDining} />}
          </div>
        )}
      </div>
    </div>
  );
}

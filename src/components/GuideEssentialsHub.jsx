import React, { useState } from "react";
import {
  ClipboardCheck, Volume2, ShoppingBag, Bus, Plane, Coins,
  Shield, Building2, ChevronDown, ChevronUp, Sparkles, ExternalLink,
  PhoneCall, HeartHandshake, FileCheck, ArrowRight
} from "lucide-react";

import PackingChecklist from "./PackingChecklist";
import VegDiningAudio from "./VegDiningAudio";
import ShoppingGuide from "./ShoppingGuide";
import LimousineHub from "./LimousineHub";
import FlightMatrix from "./FlightMatrix";
import TransitLogistics from "./TransitLogistics";
import CurrencyConverter from "./CurrencyConverter";

export default function GuideEssentialsHub({
  trip,
  onOpenTaxi,
  onOpenDocs,
  onOpenFx,
  onSwitchToProTab,
  onSaveFlights
}) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionKey) => {
    setExpandedSection(prev => prev === sectionKey ? null : sectionKey);
  };

  const hasChecklist = trip?.checklist || trip?.packingList;
  const hasVeg = !!trip?.vegDining;
  const hasShopping = trip?.shopping && trip?.shopping.length > 0;
  const hasLimo = trip?.limoTransfers && trip?.limoTransfers.length > 0;
  const hasFlights = trip?.flights && trip?.flights.length > 0;
  const hasTransit = !!trip?.transit;
  const hasCurrency = !!trip?.currency;

  return (
    <div className="space-y-6">
      {/* Essentials Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                ⚡ Simple View • Essentials Hub
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Curated Field Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              On-Ground Guides, Audio & Utilities
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Consolidated preparation checklists, gourmet pure-veg dining phrases, local bargaining rules, and emergency tools — all accessible in 1 tap without tab overload.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            {onOpenTaxi && (
              <button
                onClick={onOpenTaxi}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Show Taxi Driver Card</span>
              </button>
            )}
            {onOpenDocs && (
              <button
                onClick={onOpenDocs}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Passport & Visa Safe</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Pre-Departure & Packing Checklist */}
        {hasChecklist && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pre-Departure & Packing</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Phased readiness, documents & gear</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("checklist")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "checklist" ? "Collapse" : "Open Checklist"}</span>
                  {expandedSection === "checklist" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "checklist" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <PackingChecklist
                  tripId={trip.id}
                  checklist={trip.checklist || trip.packingList || []}
                />
              </div>
            )}
          </div>
        )}

        {/* 2. Pure Veg Dining & Audio Phrases */}
        {hasVeg && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gourmet Veg Dining & Audio</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Curated restaurants & voice phrases</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("dining")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "dining" ? "Collapse" : "Explore Dining"}</span>
                  {expandedSection === "dining" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "dining" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <VegDiningAudio vegDining={trip.vegDining} />
              </div>
            )}
          </div>
        )}

        {/* 3. Shopping & Bargaining Guide */}
        {hasShopping && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Shopping, Night Markets & VAT</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">50% bargaining rule, silk & coffee</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("shopping")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "shopping" ? "Collapse" : "Open Guide"}</span>
                  {expandedSection === "shopping" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "shopping" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <ShoppingGuide shopping={trip.shopping} />
              </div>
            )}
          </div>
        )}

        {/* 4. Limousines / Private Transit */}
        {hasLimo && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Private Limousine Hub</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">9-Seater DCar transit legs & drivers</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("limo")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "limo" ? "Collapse" : "View Legs"}</span>
                  {expandedSection === "limo" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "limo" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <LimousineHub limoTransfers={trip.limoTransfers} />
              </div>
            )}
          </div>
        )}

        {/* 5. Transit & Flight Matrix (if domestic or flight without limo) */}
        {!hasLimo && (hasFlights || hasTransit) && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {hasFlights ? <Plane className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {hasFlights ? "Flight Matrix & PNRs" : "Transit Logistics & Sleeper Bus"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Boarding points, seat layout & timings</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("mobility")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "mobility" ? "Collapse" : "View Details"}</span>
                  {expandedSection === "mobility" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "mobility" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                {hasFlights && <FlightMatrix flights={trip.flights} onSaveFlights={onSaveFlights} tripId={trip.id} />}
                {hasTransit && <TransitLogistics transit={trip.transit} />}
              </div>
            )}
          </div>
        )}

        {/* 6. FX Calculator & Currency Tools */}
        {hasCurrency && (
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder rounded-3xl p-5 shadow-sm space-y-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Currency Converter & FX</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Live conversion & cash budgeting</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleSection("currency")}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>{expandedSection === "currency" ? "Collapse" : "Calculator"}</span>
                  {expandedSection === "currency" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {expandedSection === "currency" && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <CurrencyConverter currency={trip.currency} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pro Mode Promotion Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-white text-xs block font-bold">Need Deep Granular Control?</strong>
            <span className="text-[11px] text-slate-400 block">Switch to 🛠️ Pro Planner Mode at the top to access dedicated full-screen workspaces for each category.</span>
          </div>
        </div>
        {onSwitchToProTab && (
          <button
            onClick={() => onSwitchToProTab("tools")}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <span>Open Pro Workspaces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Compass, Search, Plus, Sparkles, MapPin, Calendar, Users,
  Navigation, Download, Smartphone, CheckCircle, Globe, Trophy,
  Archive, History, Award, ArrowRight
} from "lucide-react";
import TripCard from "../components/TripCard";
import CreateTripModal from "../components/CreateTripModal";
import { isCustomTrip } from "../data/trips/registry";

export default function HubPage({ trips = [], onSelectTrip, onOpenPassport, onAddTrip, onDeleteTrip, onInstallPrompt, isStandalone = false }) {
  const [filter, setFilter] = useState("all"); // "all" | "upcoming" | "past" | "domestic" | "international"
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const upcomingTrips = trips.filter((t) => t.status === "upcoming" || !t.status);
  const pastTrips = trips.filter((t) => t.status === "past" || t.status === "archived");
  const domesticTrips = trips.filter((t) => t.category === "domestic");
  const internationalTrips = trips.filter((t) => t.category === "international");

  const filteredTrips = trips
    .filter((t) => {
      if (filter === "upcoming") return t.status === "upcoming" || !t.status;
      if (filter === "past") return t.status === "past" || t.status === "archived";
      if (filter === "domestic") return t.category === "domestic";
      if (filter === "international") return t.category === "international";
      return true;
    })
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        (t.summary && t.summary.toLowerCase().includes(q))
      );
    });

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full px-4 py-6">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lifetime Travel Architecture • 100% Offline PWA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Personal Travel Architect
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Curated master itineraries, connecting flight matrices, sleeper bus transits, dynamic split budgets, and dietary audio survival cards for all your expeditions.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Architect New Trip</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPassport ? onOpenPassport() : setIsPassportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-slate-950" />
                <span>Lifetime Journey Book & Memoir</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Trips</span>
              <strong className="text-xl font-black text-white font-mono mt-0.5 block">{trips.length}</strong>
            </div>
            <div className="bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Upcoming</span>
              <strong className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">
                {upcomingTrips.length}
              </strong>
            </div>
            <div className="bg-amber-950/20 p-3.5 rounded-2xl border border-amber-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Archives</span>
              <strong className="text-xl font-black text-amber-300 font-mono mt-0.5 block">
                {pastTrips.length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 🌍 Lifetime Traveler Journey Book & Scratch Map Banner */}
      <div
        onClick={() => onOpenPassport ? onOpenPassport() : setIsPassportModalOpen(true)}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-amber-400/60 transition group"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Trophy className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white font-display">
                Lifetime Travel Passport & World Scratch Map
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Explore Journey
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Track places you've visited, unlock UNESCO milestone badges, and import your Google Maps Timeline to build your life's travel legacy.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
            <span>Open Passport & Map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </span>
        </div>
      </div>

      {/* Universal PWA Mobile App Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white font-display">
                Install Travel Architect as Phone App
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {isStandalone
                ? "✅ App is installed! Enjoy full-screen native performance, instant offline access & zero data usage."
                : "Add to your iPhone or Android home screen. Works 100% offline in flights and remote hills with zero roaming data."}
            </p>
          </div>
        </div>

        {!isStandalone && onInstallPrompt && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onInstallPrompt}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install on Phone</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
              filter === "all"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            All Expeditions ({trips.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
              filter === "upcoming"
                ? "bg-emerald-600 text-white border border-emerald-500 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            🚀 Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setFilter("past")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
              filter === "past"
                ? "bg-amber-600 text-white border border-amber-500 shadow-sm"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            🏛️ Archives ({pastTrips.length})
          </button>
          <button
            onClick={() => setFilter("domestic")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
              filter === "domestic"
                ? "bg-slate-800 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            🇮🇳 Domestic ({domesticTrips.length})
          </button>
          <button
            onClick={() => setFilter("international")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer " + (
              filter === "international"
                ? "bg-slate-800 text-indigo-400 border border-indigo-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            🌐 International ({internationalTrips.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expeditions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grouped Section View: Active Upcoming vs Past Archives */}
      {filter === "all" && !search ? (
        <div className="space-y-10">
          {/* Section 1: Active & Upcoming Expeditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30">
                  🚀
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                      Active & Upcoming Expeditions
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {upcomingTrips.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live blueprints with departure countdowns, confirmed booking links, and day-by-day maps
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  isCustom={isCustomTrip(trip.id)}
                  onDelete={onDeleteTrip}
                  onPreview={() => onSelectTrip(trip.id)}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Completed Expeditions & Travel Archives */}
          {pastTrips.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/30">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                        Travel Archives & Completed Expeditions
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {pastTrips.length} Archived
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Previous completed journeys preserved for travel memories, expense history, and route references
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastTrips.map((trip) => (
                  <div key={trip.id} className="relative">
                    {/* Retro Travel Archive Stamp */}
                    <div className="absolute -top-2.5 -right-2.5 z-20 px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md transform rotate-2">
                      ✓ Completed
                    </div>
                    <TripCard
                      trip={trip}
                      isCustom={isCustomTrip(trip.id)}
                      onDelete={onDeleteTrip}
                      onPreview={() => onSelectTrip(trip.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isCustom={isCustomTrip(trip.id)}
              onDelete={onDeleteTrip}
              onPreview={() => onSelectTrip(trip.id)}
            />
          ))}
        </div>
      )}

      {/* Interactive Trip Creation & Import Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveTrip={(newTrip, launchAfter) => {
          if (onAddTrip) {
            onAddTrip(newTrip, launchAfter);
          }
        }}
      />

    </div>
  );
}

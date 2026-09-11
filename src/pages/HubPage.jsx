import React, { useState } from "react";
import { Compass, Search, Plus, Sparkles, MapPin, Calendar, Users, Navigation } from "lucide-react";
import TripCard from "../components/TripCard";

export default function HubPage({ trips = [], onSelectTrip, onAddTrip }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const domesticTrips = trips.filter((t) => t.category === "domestic");
  const internationalTrips = trips.filter((t) => t.category === "international");

  const filteredTrips = trips
    .filter((t) => {
      if (filter === "domestic") return t.category === "domestic";
      if (filter === "international") return t.category === "international";
      if (filter === "upcoming") return t.status === "upcoming";
      if (filter === "past") return t.status === "past";
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
              <span>Multi-Trip Travel Architecture • 100% Offline PWA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Personal Travel Architect
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Curated master itineraries, connecting flight matrices, sleeper bus transits, dynamic split budgets, and dietary audio survival cards for all your expeditions.
            </p>
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
                {trips.filter((t) => t.status === "upcoming").length}
              </strong>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Archived</span>
              <strong className="text-xl font-black text-amber-300 font-mono mt-0.5 block">
                {trips.filter((t) => t.status === "past").length}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter("all")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all " + (
              filter === "all"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            All Expeditions ({trips.length})
          </button>
          <button
            onClick={() => setFilter("domestic")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all " + (
              filter === "domestic"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            🇮🇳 Domestic ({domesticTrips.length})
          </button>
          <button
            onClick={() => setFilter("international")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all " + (
              filter === "international"
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
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

      {/* Grouped Section View or Filtered Grid */}
      {filter === "all" && !search ? (
        <div className="space-y-10">
          {/* Section 1: Domestic Expeditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30">
                  🇮🇳
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                    Domestic Expeditions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Western Ghats, hill retreats, bus/train transits, and road trips
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {domesticTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPreview={() => onSelectTrip(trip.id)}
                />
              ))}
            </div>
          </div>

          {/* Section 2: International Passports */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg border border-indigo-500/30">
                  🌐
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                    International Passports
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Global voyages, multi-leg connecting flights & foreign companions
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internationalTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPreview={() => onSelectTrip(trip.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onPreview={() => onSelectTrip(trip.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

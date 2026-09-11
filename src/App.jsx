import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Compass, Search, Plus, Moon, Sun, Lock } from 'lucide-react';
import { STATIC_TRIPS, getRegisteredTrips } from './data/trips/registry';
import TripCard from './components/TripCard';
import PinLockModal from './components/PinLockModal';
import EmergencySosModal from './components/EmergencySosModal';
import FlightMatrix from './components/FlightMatrix';
import TransitLogistics from './components/TransitLogistics';
import SplitBudget from './components/SplitBudget';

export default function App() {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    setTrips(getRegisteredTrips());
  }, []);

  const domesticTrips = trips.filter(t => t.category === 'domestic');
  const internationalTrips = trips.filter(t => t.category === 'international');

  const filteredTrips = trips.filter(t => {
    if (filter === 'domestic') return t.category === 'domestic';
    if (filter === 'international') return t.category === 'international';
    if (filter === 'upcoming') return t.status === 'upcoming';
    if (filter === 'past') return t.status === 'past';
    return true;
  }).filter(t => {
    if (!search) return true;
    return t.title.toLowerCase().includes(search.toLowerCase()) ||
           t.destination.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* PIN Security Overlay */}
      <PinLockModal onUnlock={() => setIsLocked(false)} />

      {/* Emergency SOS Modal */}
      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Top HUD Header */}
      <header className="bg-slate-950/90 sticky top-0 z-40 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-wider uppercase font-display">Travel Architect</h1>
              <span className="text-[11px] text-emerald-400 font-mono">Modern Vite + React Multi-Trip Architecture</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSosOpen(true)}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>SOS</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('travel_architect_unlocked');
                window.location.reload();
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 space-y-8">
        {/* Filter Navigation Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'all' ? 'bg-slate-800 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Expeditions ({trips.length})
            </button>
            <button
              onClick={() => setFilter('domestic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'domestic' ? 'bg-slate-800 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              🇮🇳 Domestic ({domesticTrips.length})
            </button>
            <button
              onClick={() => setFilter('international')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'international' ? 'bg-slate-800 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              🌐 International ({internationalTrips.length})
            </button>
          </div>

          <div className="relative w-64">
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

        {/* Expeditions Grid View */}
        {filter === 'all' && !search ? (
          <div className="space-y-10">
            {/* Section 1: Domestic Expeditions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg border border-emerald-500/30">
                    🇮🇳
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white font-display">Domestic Expeditions</h2>
                    <p className="text-xs text-slate-400">Western Ghats, hill retreats, bus/train transits, and road trips</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {domesticTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onPreview={(t) => setSelectedTrip(t)} />
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
                    <h2 className="text-lg font-black text-white font-display">International Passports</h2>
                    <p className="text-xs text-slate-400">Global voyages, multi-leg connecting flights & foreign companions</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internationalTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onPreview={(t) => setSelectedTrip(t)} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} onPreview={(t) => setSelectedTrip(t)} />
            ))}
          </div>
        )}

        {/* Selected Trip Details Drawer / Inspector */}
        {selectedTrip && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono">Trip Component Inspector</span>
                <h3 className="text-xl font-black text-white mt-0.5">{selectedTrip.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-3 py-1 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

            {selectedTrip.flights && <FlightMatrix flights={selectedTrip.flights} />}
            {selectedTrip.transit && <TransitLogistics transit={selectedTrip.transit} />}
            {selectedTrip.budget && <SplitBudget budget={selectedTrip.budget} />}
          </div>
        )}
      </main>
    </div>
  );
}

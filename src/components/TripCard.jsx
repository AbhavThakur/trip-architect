import React from 'react';
import { MapPin, ArrowUpRight, Calendar, Users, Eye } from 'lucide-react';

export default function TripCard({ trip, onPreview, onLaunch }) {
  const isDomestic = trip.category === 'domestic';

  return (
    <div className="bg-slate-900/80 rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all duration-300">
      <div className={`bg-gradient-to-r ${trip.heroGradient || 'from-slate-900 to-indigo-950'} p-6 relative`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              isDomestic ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            } backdrop-blur-md`}>
              {isDomestic ? '🇮🇳 Domestic Expedition' : '🌐 International Passport'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              trip.status === 'upcoming' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-black/30 text-slate-400 border border-white/10'
            }`}>
              {trip.badge || (trip.status === 'upcoming' ? 'Upcoming' : 'Archived')}
            </span>
          </div>
          <span className="text-3xl filter drop-shadow-md">{trip.flag}</span>
        </div>

        <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
          {trip.title}
        </h3>
        <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
          <MapPin className={`w-3.5 h-3.5 ${isDomestic ? 'text-emerald-400' : 'text-red-400'}`} />
          {trip.destination}
        </p>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Travel Dates</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{trip.dates}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Travelers</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{trip.travelers}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {trip.summary}
          </p>

          {/* Architectural Feature Badges */}
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-500 block">Architectural Modules</span>
            <div className="flex flex-wrap gap-1.5">
              {trip.features?.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
          {onPreview && (
            <button
              onClick={() => onPreview(trip)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              Preview
            </button>
          )}
          <button
            type="button"
            onClick={() => onPreview ? onPreview(trip) : null}
            className={`flex-1 py-2 px-4 bg-gradient-to-r ${
              isDomestic ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' : 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            } text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all`}
          >
            <span>Launch Companion</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

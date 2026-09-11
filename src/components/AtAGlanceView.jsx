import React from "react";
import { Calendar, MapPin, Hotel, Utensils, Compass, CheckCircle2, ChevronRight } from "lucide-react";

export default function AtAGlanceView({ days = [], onSelectDay }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 shadow-xl">
        <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          At-A-Glance Master Expedition Matrix (8 Days)
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          High-level executive overview of regions, hotel basecamps, core highlights, and designated pure-veg dining.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {days.map((day, idx) => {
          const dayNum = idx + 1;
          const places = day.places || day.events || day.stops || [];
          const highlights = day.atAGlanceHighlights || places.slice(0, 3).map(p => p.name || p.title);
          const hotel = day.hotelName || "Confirmed Hotel Stay";
          const vegMeal = day.keyVegMeal || "Verified Pure Veg Restaurant";

          return (
            <div
              key={idx}
              onClick={() => onSelectDay && onSelectDay(idx)}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 p-4 rounded-2xl space-y-3 cursor-pointer transition-all shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-mono text-[11px] font-extrabold border border-amber-500/30">
                    DAY {dayNum}
                  </span>
                  {day.region && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">
                      {day.region}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                  {day.title}
                </h4>

                {/* Hotel Basecamp */}
                <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 bg-indigo-950/30 border border-indigo-500/20 px-2 py-1 rounded-lg">
                  <Hotel className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{hotel}</span>
                </div>

                {/* Highlights */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold block">
                    Key Highlights:
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 pl-1">
                    {highlights.slice(0, 3).map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-1.5 leading-tight truncate">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Veg Meal & Click CTA */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-emerald-400 truncate pr-2">
                  <Utensils className="w-3 h-3 shrink-0" />
                  <span className="truncate">{vegMeal}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

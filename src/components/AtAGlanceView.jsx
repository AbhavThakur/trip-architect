import React from "react";
import { ArrowRight, Calculator, Hotel, Utensils, UserCheck, Car, Compass } from "lucide-react";

export default function AtAGlanceView({ days = [], onSelectDay, onOpenBudget, trip }) {
  const isVietnam = trip?.id?.includes("vietnam");

  const getRegionBadgeStyles = (code, day, dayNum) => {
    if (isVietnam && code === "north") {
      return {
        className: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
        label: "🏔️ North Vietnam"
      };
    }
    if (isVietnam && code === "central") {
      return {
        className: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
        label: "🌊 Central Vietnam"
      };
    }
    if (day?.transportBadge) {
      return {
        className: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
        label: `🚗 ${day.transportBadge}`
      };
    }
    return {
      className: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
      label: `📍 Day ${dayNum} Explorer`
    };
  };

  return (
    <div className="space-y-4">
      {/* 2-Column Responsive Matrix matching archive companion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {days.map((day, idx) => {
          const dayNum = day.day || day.dayNum || (idx + 1);
          const region = getRegionBadgeStyles(day.regionCode, day, dayNum);
          const dateParts = (day.date || "").split(",");
          const dayWeekday = dateParts[0]?.trim() || `Day ${dayNum}`;
          const dayMonthDate = dateParts[1]?.trim() || "";

          const dayStops = (day.places && day.places.length > 0)
            ? day.places
            : (day.events && day.events.length > 0)
            ? day.events
            : [];

          const highlights = day.atAGlanceHighlights && day.atAGlanceHighlights.length > 0
            ? day.atAGlanceHighlights
            : dayStops.slice(0, 4).map(p => p.name || p.title);

          const stayInfo = day.hotelName
            ? `🏨 Stay: ${day.hotelName}`
            : (trip?.basecamp?.name ? `🏨 Stay: ${trip.basecamp.name}` : `🏨 Confirmed Stay`);

          return (
            <div
              key={idx}
              className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-indigo-500/60 transition-all group"
            >
              <div>
                {/* Header with Day, Date & Region */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-darkborder">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-brand-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                      D{dayNum}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                        {dayWeekday} {dayMonthDate ? `• ${dayMonthDate}` : ""}
                      </span>
                      {day.weather && (
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {day.weather}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border shrink-0 ${region.className}`}>
                    {region.label}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="mt-3">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {day.title}
                  </h3>
                  {day.subtitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {day.subtitle}
                    </p>
                  )}
                </div>

                {/* Full Day Chronological Itinerary (Compact, All Together) */}
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/60 dark:border-darkborder space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <span>📋 Full Day Itinerary</span>
                      <span className="text-slate-400 font-normal">({dayStops.length || highlights.length} stops)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      All Together
                    </span>
                  </div>

                  {dayStops.length > 0 ? (
                    <div className="space-y-1.5 pt-0.5 max-h-72 overflow-y-auto no-scrollbar">
                      {dayStops.map((stop, sIdx) => {
                        const name = stop.name || stop.title || `Stop ${sIdx + 1}`;
                        const time = stop.time || "";
                        const cat = (stop.category || "").toLowerCase();

                        const catEmoji = cat.includes("flight") || cat.includes("transit") ? "✈️" :
                                         cat.includes("hotel") || cat.includes("stay") ? "🏨" :
                                         cat.includes("food") || cat.includes("dining") || cat.includes("cafe") ? "🍜" :
                                         cat.includes("shop") || cat.includes("market") ? "🛍️" :
                                         cat.includes("cruise") || cat.includes("boat") ? "⛵" :
                                         cat.includes("mountain") || cat.includes("hill") || cat.includes("peak") ? "⛰️" :
                                         cat.includes("temple") || cat.includes("culture") ? "🛕" : "📍";

                        return (
                          <div key={sIdx} className="flex items-start gap-2 text-xs leading-snug">
                            {time ? (
                              <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                                {time}
                              </span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 truncate">
                                <span className="text-xs shrink-0">{catEmoji}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {name}
                                </span>
                              </div>
                              {stop.desc && (
                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {stop.desc}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      {highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-indigo-500 font-bold shrink-0">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Stay, Veg Meals, and Senior Mobility Badges */}
                <div className="mt-3 grid grid-cols-1 gap-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 flex items-center gap-1.5">
                    <Hotel className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate font-semibold">{stayInfo}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold leading-tight">
                      🥗 <strong>Veg Meals:</strong> {day.keyVegMeal || (isVietnam ? "Gourmet Indian / Buddhist Chay" : "Pure Vegetarian South Indian / Local Thali")}
                    </span>
                  </div>
                  {day.seniorTip && (
                    <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40 flex items-start gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-tight font-medium">
                        👴 <strong>Senior Mobility:</strong> {day.seniorTip}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action to jump to Detailed View */}
              <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-darkborder flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Car className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[200px]">{day.limoLeg || day.transportBadge || (isVietnam ? "Private DCar Limousine" : "Transit & Mobility")}</span>
                </span>
                <button
                  onClick={() => onSelectDay && onSelectDay(idx)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <span>View Hourly Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Executive Trip Budget & Split Blueprint Card */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-3xl p-4 sm:p-5 border border-purple-800/70 shadow-xl space-y-3 mt-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-purple-500/30">
              {isVietnam
                ? "5 Pax Group Split Blueprint (3 BLR + 2 DEL)"
                : `${trip?.travelers || "Group"} Split Blueprint`}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display mt-1 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              {trip?.title ? `${trip.title.split(" ")[0]} Trip Budget Blueprint` : "Trip Budget & Split Blueprint"}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {isVietnam
                ? "All 7 days estimated: flights, stays, Ba Na Hills, Aqua Cruise & dining"
                : `Comprehensive budget estimate for ${trip?.daysCount || days.length} days: transit, stays, activities & dining`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {trip?.budget?.totalEstimate || (trip?.budget?.total ? `₹${trip.budget.total.toLocaleString("en-IN")}` : "Planned")}
            </span>
            <span className="block text-[11px] text-slate-300 font-medium">
              {trip?.budget?.perPersonSplit || (trip?.travelers ? `Per traveler (${trip.travelers})` : "Per traveler split")}
            </span>
          </div>
        </div>

        {isVietnam ? (
          <>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-900/50 text-[11px]">
              <div className="bg-purple-900/30 rounded-xl p-2.5 border border-purple-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Confirmed / Paid</span>
                <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm">₹1,65,000</span>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-2.5 border border-purple-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated</span>
                <span className="text-amber-400 font-bold font-mono text-xs sm:text-sm">₹4,06,000</span>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-2.5 border border-purple-800/40">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Per Head Split</span>
                <span className="text-purple-300 font-bold font-mono text-xs sm:text-sm">₹81,200 / Pax</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-purple-900/40 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-300 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">🤝 Shared (5 Pax): ₹1.74L</span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300">🧑 BLR (3 Pax): ₹1.45L</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-300">👨 DEL (2 Pax): ₹87K</span>
              </div>
              {onOpenBudget && (
                <button
                  onClick={onOpenBudget}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <span>Open Full Budget & Expenses Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="pt-2 flex justify-between items-center border-t border-purple-900/40 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono">
                Total: <strong className="text-amber-400">{trip?.budget?.totalEstimate || (trip?.budget?.total ? `₹${trip.budget.total.toLocaleString("en-IN")}` : "Planned")}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 font-mono">
                Split: <strong className="text-white">{trip?.budget?.perPersonSplit || (trip?.travelers ? `Per traveler (${trip.travelers})` : "Per head split")}</strong>
              </span>
            </div>
            {onOpenBudget && (
              <button
                onClick={onOpenBudget}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <span>Open Full Budget & Expenses Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
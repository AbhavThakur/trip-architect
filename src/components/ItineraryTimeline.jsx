import React, { useState } from "react";
import { Calendar, MapPin, Share2, Navigation, ExternalLink, Clock, Tag, CheckCircle } from "lucide-react";

export default function ItineraryTimeline({ days = [], tripTitle = "Expedition Plan" }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!days || days.length === 0) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
        No itinerary days scheduled yet.
      </div>
    );
  }

  const currentDay = days[activeDayIdx] || days[0];

  const shareDayOnWhatsApp = () => {
    let text = "*" + tripTitle + " — Day " + currentDay.day + ": " + currentDay.title + "*\n";
    if (currentDay.date) text += "📅 Date: " + currentDay.date + "\n\n";
    if (currentDay.places && currentDay.places.length > 0) {
      currentDay.places.forEach((p, idx) => {
        text += (idx + 1) + ". " + (p.time ? "[" + p.time + "] " : "") + p.name;
        if (p.notes) text += " — " + p.notes;
        text += "\n";
      });
    }
    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Day Selector Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5">
          {days.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIdx(idx)}
              className={"px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all " + (
                activeDayIdx === idx
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              )}
            >
              Day {d.day}
            </button>
          ))}
        </div>

        {/* WhatsApp Share Button */}
        <button
          onClick={shareDayOnWhatsApp}
          className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          title="Share Day Plan via WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">WhatsApp Plan</span>
        </button>
      </div>

      {/* Active Day Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-4 rounded-2xl border border-slate-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 font-mono">
            Day {currentDay.day} • {currentDay.date || "Timeline Overview"}
          </span>
          {currentDay.weather && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {currentDay.weather}
            </span>
          )}
        </div>
        <h3 className="text-sm sm:text-base font-black text-white">{currentDay.title}</h3>
        {currentDay.summary && (
          <p className="text-xs text-slate-400 leading-relaxed pt-0.5">{currentDay.summary}</p>
        )}
      </div>

      {/* Places & Hourly Stops Timeline */}
      <div className="space-y-3">
        {currentDay.places && currentDay.places.map((place, pIdx) => (
          <div
            key={pIdx}
            className="bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-slate-850 hover:border-slate-750 transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {pIdx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {place.time && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        {place.time}
                      </span>
                    )}
                    {place.category && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {place.category}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white mt-1">{place.name}</h4>
                </div>
              </div>

              {place.mapsUrl || (place.lat && place.lng) ? (
                <a
                  href={place.mapsUrl || ("https://maps.google.com/?q=" + place.lat + "," + place.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all shrink-0"
                  title="Open in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              ) : null}
            </div>

            {place.notes && (
              <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                {place.notes}
              </p>
            )}

            {place.mobility && (
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 font-mono bg-indigo-950/30 px-2 py-1 rounded-lg border border-indigo-500/20">
                <Navigation className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>Transit: {place.mobility}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

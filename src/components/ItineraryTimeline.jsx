import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Compass,
  Lightbulb,
  ExternalLink,
  Share2,
  Edit3,
  Map as MapIcon,
  List,
  Check,
  X,
  Sun,
  CloudSun,
  Coffee,
  Camera,
  Utensils,
  Hotel,
  Bus,
  Plane
} from "lucide-react";
import InteractiveMap from "./InteractiveMap";

export default function ItineraryTimeline({
  days = [],
  tripTitle = "Expedition",
  onUpdateStop
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [activeStopId, setActiveStopId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "map"
  const [editingStop, setEditingStop] = useState(null); // { dayIdx, stopIdx, stop }

  // Normalize days & places
  const normalizedDays = useMemo(() => {
    return days.map((day, dIdx) => {
      const rawPlaces = day.places || day.events || day.stops || [];
      const places = rawPlaces.map((p, pIdx) => ({
        id: p.id || `d${dIdx + 1}_s${pIdx + 1}`,
        orderNum: pIdx + 1,
        day: dIdx + 1,
        time: p.time || "",
        name: p.name || p.title || "Stop " + (pIdx + 1),
        category: p.category || "attraction",
        desc: p.desc || p.description || "",
        tip: p.tip || p.seniorTip || p.notes || "",
        price: p.price || p.fee || "",
        coords: p.coords || null,
        tags: p.tags || [],
        seniorFriendly: !!p.seniorFriendly
      }));

      return {
        ...day,
        dayNum: dIdx + 1,
        places
      };
    });
  }, [days]);

  const activeDay = normalizedDays[selectedDayIdx] || normalizedDays[0];

  // Stops to plot on map
  const mapStops = useMemo(() => {
    if (selectedDayIdx === "all") {
      return normalizedDays.flatMap((d) => d.places);
    }
    return activeDay?.places || [];
  }, [normalizedDays, selectedDayIdx, activeDay]);

  // Share day plan via WhatsApp
  const shareWhatsAppPlan = () => {
    if (!activeDay) return;
    let text = `*${tripTitle} — Day ${activeDay.dayNum}: ${activeDay.title}*
`;
    if (activeDay.date) text += `📅 Date: ${activeDay.date}
`;
    if (activeDay.weather) text += `⛅ Weather: ${activeDay.weather}
`;
    text += `
`;

    activeDay.places.forEach((s) => {
      text += `${s.orderNum}. [${s.time}] ${s.name}
`;
      if (s.desc) text += `   ${s.desc}
`;
    });

    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };

  // Category visual helpers
  const getCategoryBadge = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("food") || c.includes("dining") || c.includes("cafe")) {
      return { label: "Food & Dining", bg: "bg-rose-500/15 text-rose-300 border-rose-500/30", icon: Utensils };
    }
    if (c.includes("hotel") || c.includes("stay") || c.includes("basecamp")) {
      return { label: "Stay / Hotel", bg: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: Hotel };
    }
    if (c.includes("transit") || c.includes("flight") || c.includes("transport")) {
      return { label: "Transit", bg: "bg-blue-500/15 text-blue-300 border-blue-500/30", icon: Plane };
    }
    if (c.includes("nature") || c.includes("peak") || c.includes("scenic")) {
      return { label: "Nature & Peak", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: Compass };
    }
    return { label: cat || "Attraction", bg: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Camera };
  };

  // Inline stop edit handler
  const handleSaveEdit = () => {
    if (!editingStop || !onUpdateStop) return;
    onUpdateStop(editingStop.dayIdx, editingStop.stopIdx, editingStop.stop);
    setEditingStop(null);
  };

  return (
    <div className="space-y-4">
      {/* Day Selector Pill Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {normalizedDays.map((d, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedDayIdx(idx);
                setActiveStopId(null);
              }}
              className={"px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 " + (
                selectedDayIdx === idx
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black scale-105"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              )}
            >
              <span>Day {d.dayNum}</span>
              {d.date && (
                <span className={"text-[10px] opacity-75 hidden sm:inline " + (selectedDayIdx === idx ? "text-slate-950" : "text-slate-400")}>
                  • {d.date.split(",")[0]}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedDayIdx("all");
              setActiveStopId(null);
            }}
            className={"px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all " + (
              selectedDayIdx === "all"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black"
                : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
            )}
          >
            All Route
          </button>
        </div>

        {/* Mobile View Toggle Button (List vs Map) */}
        <div className="lg:hidden shrink-0">
          <button
            onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow"
          >
            {mobileView === "list" ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span>{mobileView === "list" ? "Show Map" : "Show List"}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split Screen on Desktop (Timeline Left, Sticky Interactive Map Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Day Itinerary Cards (7 Cols on desktop) */}
        <div className={"space-y-4 lg:col-span-7 " + (mobileView === "map" ? "hidden lg:block" : "block")}>
          {activeDay && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              {/* Day Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-black font-mono border border-amber-500/30">
                      DAY {activeDay.dayNum}
                    </span>
                    {activeDay.date && (
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {activeDay.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                    {activeDay.title}
                  </h3>
                </div>

                {/* WhatsApp Plan Share Button */}
                <button
                  onClick={shareWhatsAppPlan}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
                  title="Share formatted day plan to WhatsApp group"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Plan</span>
                </button>
              </div>

              {/* Weather & Highlights Banner */}
              {activeDay.weather && (
                <div className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800/80 rounded-2xl px-3.5 py-2.5 text-slate-300 font-mono">
                  <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{activeDay.weather}</span>
                </div>
              )}

              {/* Stops Timeline */}
              <div className="space-y-3 pt-2">
                {activeDay.places.map((stop, sIdx) => {
                  const catMeta = getCategoryBadge(stop.category);
                  const CatIcon = catMeta.icon;
                  const isActive = activeStopId === stop.id;

                  return (
                    <div
                      key={stop.id}
                      onClick={() => setActiveStopId(stop.id)}
                      className={"group rounded-2xl border p-4 transition-all cursor-pointer relative " + (
                        isActive
                          ? "bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                          : "bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60"
                      )}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Stop Number Circle */}
                        <div className={"w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border " + (
                          isActive
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow"
                            : "bg-slate-800 text-slate-300 border-slate-700 group-hover:border-slate-600"
                        )}>
                          {stop.orderNum}
                        </div>

                        {/* Stop Details */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              {stop.time && (
                                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                  {stop.time}
                                </span>
                              )}
                              <span className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 " + catMeta.bg}>
                                <CatIcon className="w-3 h-3" />
                                <span>{catMeta.label}</span>
                              </span>
                              {stop.price && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                                  {stop.price}
                                </span>
                              )}
                            </div>

                            {/* Actions: Edit & Map */}
                            <div className="flex items-center gap-1.5">
                              {onUpdateStop && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingStop({
                                      dayIdx: selectedDayIdx === "all" ? 0 : selectedDayIdx,
                                      stopIdx: sIdx,
                                      stop: { ...stop }
                                    });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Edit Stop Details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {stop.coords && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${stop.coords[0]},${stop.coords[1]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px] font-bold"
                                  title="Open Google Maps Navigation"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                            {stop.name}
                          </h4>

                          {stop.desc && (
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {stop.desc}
                            </p>
                          )}

                          {/* Senior Tip / Travel Pro-Tip Callout */}
                          {stop.tip && (
                            <div className="mt-2 text-xs bg-amber-950/25 border border-amber-500/30 rounded-xl p-2.5 text-amber-200/90 flex items-start gap-2 font-sans">
                              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{stop.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Interactive Leaflet Map (5 Cols on desktop) */}
        <div className={"lg:col-span-5 " + (mobileView === "list" ? "hidden lg:block" : "block")}>
          <div className="sticky top-24">
            <InteractiveMap
              stops={mapStops}
              activeStopId={activeStopId}
              onSelectStop={(id) => setActiveStopId(id)}
              dayFilter={selectedDayIdx}
            />
          </div>
        </div>
      </div>

      {/* Inline Edit Stop Modal */}
      {editingStop && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Edit Stop Details
              </h4>
              <button
                onClick={() => setEditingStop(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Time</label>
                <input
                  type="text"
                  value={editingStop.stop.time}
                  onChange={(e) =>
                    setEditingStop({
                      ...editingStop,
                      stop: { ...editingStop.stop, time: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Stop Name / Attraction</label>
                <input
                  type="text"
                  value={editingStop.stop.name}
                  onChange={(e) =>
                    setEditingStop({
                      ...editingStop,
                      stop: { ...editingStop.stop, name: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description & Logistics</label>
                <textarea
                  rows={3}
                  value={editingStop.stop.desc}
                  onChange={(e) =>
                    setEditingStop({
                      ...editingStop,
                      stop: { ...editingStop.stop, desc: e.target.value }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Travel Pro-Tip (Yellow Bulb)</label>
                <input
                  type="text"
                  value={editingStop.stop.tip}
                  onChange={(e) =>
                    setEditingStop({
                      ...editingStop,
                      stop: { ...editingStop.stop, tip: e.target.value }
                    })
                  }
                  placeholder="e.g. Best photo angle from north pagoda..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingStop(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
                >
                  Save & Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

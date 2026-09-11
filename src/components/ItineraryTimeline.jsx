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
  Plane,
  Grid,
  Volume2,
  Car,
  UserCheck
} from "lucide-react";
import InteractiveMap from "./InteractiveMap";
import AtAGlanceView from "./AtAGlanceView";

export default function ItineraryTimeline({
  days = [],
  tripTitle = "Expedition",
  onUpdateStop,
  seniorMode = false,
  onOpenTaxi
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [activeStopId, setActiveStopId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "map"
  const [viewMode, setViewMode] = useState("detailed"); // "detailed" | "glance"
  const [editingStop, setEditingStop] = useState(null);

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

  // Up Next Stop (first stop of active day or active stop)
  const upNextStop = activeDay?.places[0] || null;

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

  const handleSaveEdit = () => {
    if (!editingStop || !onUpdateStop) return;
    onUpdateStop(editingStop.dayIdx, editingStop.stopIdx, editingStop.stop);
    setEditingStop(null);
  };

  const speakStop = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-4">
      {/* View Toggle Bar (Detailed Timeline vs At-a-Glance) */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/90 light-mode:bg-white p-2 rounded-2xl border border-slate-800 light-mode:border-slate-200">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode("detailed")}
            className={"px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 " + (
              viewMode === "detailed"
                ? "bg-amber-500 text-slate-950 font-black shadow"
                : "text-slate-400 hover:text-white light-mode:hover:text-slate-900"
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>Detailed Timeline & Map</span>
          </button>
          <button
            onClick={() => setViewMode("glance")}
            className={"px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 " + (
              viewMode === "glance"
                ? "bg-amber-500 text-slate-950 font-black shadow"
                : "text-slate-400 hover:text-white light-mode:hover:text-slate-900"
            )}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>At-A-Glance (8 Days)</span>
          </button>
        </div>

        {seniorMode && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Senior Comfort Enabled</span>
          </div>
        )}
      </div>

      {/* Render At-a-Glance View if toggled */}
      {viewMode === "glance" ? (
        <AtAGlanceView
          days={normalizedDays}
          onSelectDay={(dayIdx) => {
            setSelectedDayIdx(dayIdx);
            setViewMode("detailed");
          }}
        />
      ) : (
        <>
          {/* Live Up Next Hero Card */}
          {upNextStop && (
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                    Live Up Next (Day {activeDay.dayNum})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">⏰ {upNextStop.time}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {upNextStop.name}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  {upNextStop.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onOpenTaxi && (
                  <button
                    onClick={onOpenTaxi}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Car className="w-3.5 h-3.5 text-amber-300" />
                    <span>Taxi Card</span>
                  </button>
                )}
                <button
                  onClick={() => speakStop(upNextStop.name)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                  title="Speak Vietnamese address"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pronounce</span>
                </button>
              </div>
            </div>
          )}

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
                      : "bg-slate-900 light-mode:bg-white hover:bg-slate-800 text-slate-300 light-mode:text-slate-700 border border-slate-800 light-mode:border-slate-200"
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
                    : "bg-slate-900 light-mode:bg-white hover:bg-slate-800 text-slate-400 border border-slate-800 light-mode:border-slate-200"
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
                <div className="bg-slate-900/90 light-mode:bg-white border border-slate-800 light-mode:border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  {/* Day Header */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[11px] font-black border border-amber-500/30">
                          DAY {activeDay.dayNum}
                        </span>
                        {activeDay.date && (
                          <span className="text-xs text-slate-400 font-mono font-medium">
                            {activeDay.date}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white light-mode:text-slate-900 font-display tracking-tight">
                        {activeDay.title}
                      </h3>
                    </div>

                    <button
                      onClick={shareWhatsAppPlan}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
                      title="Share formatted day plan to WhatsApp group"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Plan</span>
                    </button>
                  </div>

                  {/* Weather Banner */}
                  {activeDay.weather && (
                    <div className="flex items-center gap-2 text-xs bg-slate-950/70 light-mode:bg-slate-50 border border-slate-800/80 light-mode:border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-300 light-mode:text-slate-700 font-mono">
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
                              ? "bg-slate-800/90 light-mode:bg-amber-50/70 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                              : "bg-slate-950/70 light-mode:bg-slate-50 border-slate-800/90 light-mode:border-slate-200 hover:border-slate-700 hover:bg-slate-900/60"
                          )}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={"w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border " + (
                              isActive
                                ? "bg-amber-500 text-slate-950 border-amber-400 shadow"
                                : "bg-slate-800 light-mode:bg-slate-200 text-slate-300 light-mode:text-slate-800 border-slate-700 light-mode:border-slate-300"
                            )}>
                              {stop.orderNum}
                            </div>

                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {stop.time && (
                                    <span className="text-[11px] font-mono font-bold text-amber-400 light-mode:text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                                      {stop.time}
                                    </span>
                                  )}
                                  <span className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 " + catMeta.bg}>
                                    <CatIcon className="w-3 h-3" />
                                    <span>{catMeta.label}</span>
                                  </span>
                                  {stop.price && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 light-mode:bg-slate-200 text-emerald-400 light-mode:text-emerald-700 border border-slate-700 light-mode:border-slate-300">
                                      {stop.price}
                                    </span>
                                  )}
                                </div>

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
                                      className="p-1.5 text-slate-400 hover:text-white light-mode:hover:text-slate-900 rounded-lg"
                                      title="Edit Stop"
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
                                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                                      title="Open Google Maps"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-white light-mode:text-slate-900">
                                {stop.name}
                              </h4>

                              {stop.desc && (
                                <p className="text-xs text-slate-300 light-mode:text-slate-600 leading-relaxed">
                                  {stop.desc}
                                </p>
                              )}

                              {/* Travel Tip / Senior Advice */}
                              {stop.tip && (
                                <div className="mt-2 text-xs bg-amber-950/25 light-mode:bg-amber-50 border border-amber-500/30 rounded-xl p-2.5 text-amber-200/90 light-mode:text-amber-800 flex items-start gap-2 font-sans">
                                  <Lightbulb className="w-4 h-4 text-amber-400 light-mode:text-amber-600 shrink-0 mt-0.5" />
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

            {/* Right Column: Sticky Leaflet Map */}
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
        </>
      )}

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

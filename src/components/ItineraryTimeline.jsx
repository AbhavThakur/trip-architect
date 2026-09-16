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
  UserCheck,
  PlaneTakeoff,
  PlaneLanding,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Copy,
  Layers,
  Sparkles,
  ShoppingBag,
  Calculator,
  ArrowRight
} from "lucide-react";
import InteractiveMap from "./InteractiveMap";
import AtAGlanceView from "./AtAGlanceView";

// Dual-Leg Flight Banner Component
const FlightBanner = ({ flight, onEdit }) => {
  const [copied, setCopied] = useState(false);
  if (!flight) return null;

  const copyPnr = (pnr) => {
    if (!pnr) return;
    navigator.clipboard.writeText(pnr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl p-3 mt-2.5 flex flex-col gap-2 relative shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plane className="w-3.5 h-3.5" />
          <span>{flight.sector || flight.passengers || "Connecting Flight"}</span>
        </div>
        {flight.pnr && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyPnr(flight.pnr);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 transition"
            title="Click to copy PNR"
          >
            <span>{flight.pnr}</span>
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{flight.airline}</span>
          <span className="text-slate-400 font-mono ml-1.5 font-semibold">{flight.flightNo}</span>
        </div>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-300 transition"
          >
            Edit
          </button>
        )}
      </div>

      {flight.isConnecting && flight.layover && (
        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Layover: {flight.layover.airport || flight.layover.city} ({flight.layover.duration}) • {flight.layover.note || "Baggage through-checked"}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
        <span className="text-slate-600 dark:text-slate-400 font-mono">
          Dept: <strong className="text-slate-900 dark:text-white">{flight.dept}</strong>
        </span>
        <span className="text-slate-600 dark:text-slate-400 font-mono">
          Arr: <strong className="text-emerald-600 dark:text-emerald-400">{flight.arr}</strong>
        </span>
      </div>
    </div>
  );
};

export default function ItineraryTimeline({
  days = [],
  tripTitle = "Expedition",
  onUpdateStop,
  seniorMode = false,
  onOpenTaxi,
  hotels = {},
  flights = [],
  onOpenHotelCard,
  onSaveHotels,
  onSaveFlights,
  onOpenBudget
}) {
  const [selectedDayIdx, setSelectedDayIdx] = useState("all");
  const [activeStopId, setActiveStopId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "map"
  const [viewMode, setViewMode] = useState("glance"); // "glance" | "detailed"
  const [editingStop, setEditingStop] = useState(null);
  const [globalStopIndex, setGlobalStopIndex] = useState(0);

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
        desc: p.notes || p.desc || p.description || "",
        tip: p.insiderTip || p.tip || p.seniorTip || p.notes || "",
        price: p.price || p.fee || "",
        coords: p.coords || (p.lat && p.lng ? [p.lat, p.lng] : null),
        lat: p.lat,
        lng: p.lng,
        address: p.address || "",
        vietnamese: p.vietnamese || "",
        shoppingGem: p.shoppingGem || null,
        insiderTip: p.insiderTip || null,
        seniorTip: p.seniorTip || null,
        photoOp: p.photoOp || null,
        tags: p.tags || [],
        seniorFriendly: !!(p.seniorFriendly || p.seniorTip),
        flightKey: p.flightKey || null,
        hotelKey: p.hotelKey || null,
        transitToNext: p.transitToNext || null,
        ticketLink: p.ticketLink || null,
        color: p.color || (p.category === "shopping" ? "pink" : p.category === "dining" ? "emerald" : p.category === "stay" ? "blue" : p.category === "flight" ? "indigo" : "amber"),
        icon: p.icon || (p.category === "shopping" ? "fa-bag-shopping" : p.category === "dining" ? "fa-utensils" : p.category === "stay" ? "fa-hotel" : p.category === "flight" ? "fa-plane" : "fa-location-dot")
      }));

      return {
        ...day,
        dayNum: dIdx + 1,
        places
      };
    });
  }, [days]);

  const activeDay = selectedDayIdx === "all" ? null : (normalizedDays[selectedDayIdx] || normalizedDays[0]);

  // Flatten all stops for HUD Carousel
  const allStops = useMemo(() => {
    return normalizedDays.flatMap((day, dIdx) =>
      day.places.map((place, pIdx) => ({
        ...place,
        dayNum: day.dayNum,
        dayIdx: dIdx,
        stopIdx: pIdx
      }))
    );
  }, [normalizedDays]);

  const upNextStop = allStops[globalStopIndex] || allStops[0] || null;

  const cycleNextStop = (dir) => {
    if (allStops.length === 0) return;
    let nextIdx = (globalStopIndex + dir + allStops.length) % allStops.length;
    setGlobalStopIndex(nextIdx);
  };

  // Stops to plot on map
  const mapStops = useMemo(() => {
    if (selectedDayIdx === "all") {
      return normalizedDays.flatMap((d) => d.places);
    }
    return activeDay?.places || [];
  }, [normalizedDays, selectedDayIdx, activeDay]);

  const shareWhatsAppPlan = (day) => {
    if (!day) return;
    let text = `🇻🇳 *Vietnam Master Plan — Day ${day.dayNum}: ${day.title}*\n`;
    if (day.date) text += `📅 Date: ${day.date}\n`;
    if (day.weather) text += `⛅ Weather: ${day.weather}\n\n`;

    day.places.forEach((s) => {
      text += `• *${s.time}*: ${s.name}\n`;
      if (s.desc) text += `   ${s.desc}\n`;
    });

    if (day.hotelName) text += `\n🏨 Stay: ${day.hotelName}`;
    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };

  const speakVietnamese = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "vi-VN";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const getCategoryBadge = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("food") || c.includes("dining") || c.includes("cafe") || c.includes("restaurant")) {
      return { label: "Food & Dining", bg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30", icon: Utensils };
    }
    if (c.includes("hotel") || c.includes("stay") || c.includes("basecamp")) {
      return { label: "Stay / Hotel", bg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30", icon: Hotel };
    }
    if (c.includes("transit") || c.includes("flight") || c.includes("transport")) {
      return { label: "Transit", bg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30", icon: Plane };
    }
    if (c.includes("shop") || c.includes("market")) {
      return { label: "Shopping", bg: "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30", icon: ShoppingBag,
  Calculator,
  ArrowRight };
    }
    return { label: "Sightseeing", bg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30", icon: Camera };
  };

  const getRegionBadgeStyles = (code) => {
    if (code === "north") return { bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30", icon: "🏔️", label: "North Vietnam" };
    if (code === "central") return { bg: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30", icon: "🌊", label: "Central Vietnam" };
    return { bg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30", icon: "✈️", label: "North ➔ Central" };
  };

  const handleSaveEdit = () => {
    if (!editingStop || !onUpdateStop) return;
    onUpdateStop(editingStop.dayIdx, editingStop.stopIdx, editingStop.stop);
    setEditingStop(null);
  };

  // Render a Single Day Card in Detailed Timeline
  const renderDay = (dayObj, idx) => {
    const region = getRegionBadgeStyles(dayObj.regionCode);

    return (
      <div key={`day-${idx}`} className="bg-white dark:bg-darkcard rounded-3xl border border-slate-200 dark:border-darkborder p-4 sm:p-5 shadow-sm mb-4 space-y-4">
        {/* Day Header */}
        <div className="mb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 dark:bg-brand-600 text-white font-extrabold text-xs uppercase tracking-wider">
                DAY {dayObj.dayNum}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {dayObj.date}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase flex items-center gap-1 ${region.bg}`}>
                {region.icon} {region.label}
              </span>
              {dayObj.weather && (
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-lg font-semibold whitespace-nowrap">
                  {dayObj.weather}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-base sm:text-xl font-bold font-display text-slate-900 dark:text-white leading-tight mt-1">
            {dayObj.title}
          </h2>
          {dayObj.subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {dayObj.subtitle}
            </p>
          )}

          {/* Hotel quick badge pill */}
          {dayObj.hotelName && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={onOpenHotelCard || onOpenTaxi}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <Hotel className="w-3.5 h-3.5 text-blue-500" />
                <span>{dayObj.hotelName}</span>
              </button>
            </div>
          )}
        </div>

        {/* Places List */}
        <div className="space-y-0">
          {dayObj.places.map((stop, sIdx) => {
            const catMeta = getCategoryBadge(stop.category);
            const CatIcon = catMeta.icon;
            const isActive = activeStopId === stop.id;

            return (
              <React.Fragment key={stop.id}>
                {/* Place Card */}
                <div
                  onClick={() => {
                    setActiveStopId(stop.id);
                    if (mobileView === "list" && window.innerWidth < 1024) {
                      // Optional: pulse on map
                    }
                  }}
                  className={"bg-white dark:bg-darkcard rounded-2xl border p-4 shadow-sm relative cursor-pointer active:scale-[0.99] transition-all " + (
                    isActive
                      ? "border-amber-500 ring-2 ring-amber-400/50 dark:ring-amber-500/40 shadow-md"
                      : "border-slate-200 dark:border-darkborder hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-2xl bg-${stop.color}-50 dark:bg-${stop.color}-950/60 text-${stop.color}-600 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-sm`}>
                        <i className={`fa-solid ${stop.icon}`}></i>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                            {stop.time}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${catMeta.bg}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{catMeta.label}</span>
                          </span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1 leading-snug">
                          {stop.name}
                        </h3>

                        {stop.vietnamese && (
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                            {stop.vietnamese}
                          </span>
                        )}

                        {stop.address && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{stop.address}</span>
                          </span>
                        )}

                        {stop.desc && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                            {stop.desc}
                          </p>
                        )}

                        {/* Must-Buy Gem & Bargaining Box */}
                        {stop.shoppingGem && (
                          <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/30 border border-pink-200/80 dark:border-pink-800/60 text-xs shadow-2xs">
                            <div className="flex items-center gap-1.5 font-bold text-pink-700 dark:text-pink-300 text-[11px]">
                              <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                              <span>Must-Buy Gem & Bargaining Guidance</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 text-xs mt-1 leading-relaxed font-medium">
                              {stop.shoppingGem}
                            </p>
                          </div>
                        )}

                        {/* Insider Pro Tip Box */}
                        {stop.insiderTip && (
                          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                              <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Insider Pro Tip</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                              {stop.insiderTip}
                            </p>
                          </div>
                        )}

                        {/* Senior Mobility & Comfort Advisory */}
                        {(stop.seniorTip || (seniorMode && stop.seniorFriendly)) && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px]">
                              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                              <span>Senior Mobility Advisory</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                              {stop.seniorTip || "Level terrain, wheelchair accessible or elevator available."}
                            </p>
                          </div>
                        )}

                        {/* Photo Op Badge */}
                        {stop.photoOp && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-300 font-semibold bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-xl border border-sky-200/80 dark:border-sky-800/60 w-fit">
                            <Camera className="w-3.5 h-3.5 text-sky-500" />
                            <span>Photo Op: {stop.photoOp}</span>
                          </div>
                        )}

                        {/* Inline Connecting Flight Banners */}
                        {stop.flightKey && (
                          <div className="mt-2.5 space-y-2">
                            {(stop.flightKey === "del_han" || stop.flightKey === "han_del") ? (
                              flights
                                .filter((f) =>
                                  stop.flightKey === "del_han"
                                    ? f.key === "del_han" || f.key === "blr_han"
                                    : f.key === "han_del" || f.key === "han_blr"
                                )
                                .map((f) => (
                                  <FlightBanner key={f.key || f.sector} flight={f} />
                                ))
                            ) : (
                              <FlightBanner flight={flights.find((f) => f.key === stop.flightKey)} />
                            )}
                          </div>
                        )}

                        {/* Deep Action Buttons, Tags & Senior Comfort */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {stop.hotelKey && hotels[stop.hotelKey] && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const h = hotels[stop.hotelKey];
                                if (onOpenTaxi) {
                                  onOpenTaxi({
                                    name: h.name,
                                    vietnamese: h.name,
                                    address: h.addressVi || h.address,
                                    city: h.city,
                                    phone: h.phone,
                                    coords: h.coords
                                  });
                                } else if (onOpenHotelCard) {
                                  onOpenHotelCard();
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 active:scale-95 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                            >
                              <Hotel className="w-3 h-3 text-blue-500" />
                              <span>Stay Card [{hotels[stop.hotelKey].pnr || "CONFIRMED"}]</span>
                            </button>
                          )}

                          {stop.address && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenTaxi) onOpenTaxi(stop);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center gap-1 active:scale-95"
                              title="Show Taxi Driver Card with Vietnamese address"
                            >
                              <Car className="w-3 h-3 text-sky-500" />
                              <span>Taxi Card</span>
                            </button>
                          )}

                          {stop.ticketLink && (
                            <a
                              href={stop.ticketLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 active:scale-95"
                            >
                              <Ticket className="w-3 h-3" />
                              <span>Tickets</span>
                            </a>
                          )}

                          {stop.tags && stop.tags.map((t, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                              {t}
                            </span>
                          ))}

                          {seniorMode && stop.seniorFriendly && (
                            <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                              <UserCheck className="w-3 h-3" /> Senior Comfort
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Audio Pronunciation Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakVietnamese(stop.vietnamese || stop.name);
                        }}
                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition"
                        title="Pronounce in Vietnamese"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-500" />
                      </button>

                      {/* Map Locate Button */}
                      {stop.coords && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveStopId(stop.id);
                            if (mobileView === "list" && window.innerWidth < 1024) {
                              setMobileView("map");
                              setTimeout(() => window.dispatchEvent(new Event("resize")), 80);
                            }
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition"
                          title="Locate and zoom on Map"
                        >
                          <Compass className="w-4 h-4 text-blue-500" />
                        </button>
                      )}

                      {/* Google Maps External */}
                      {stop.coords && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${stop.coords[0]},${stop.coords[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition"
                          title="Open Google Maps app"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Gap Connector */}
                {stop.transitToNext && sIdx < dayObj.places.length - 1 && (
                  <div className="py-2.5 px-3 flex items-center gap-3 relative">
                    <div className="w-10 flex justify-center shrink-0">
                      <div className="h-8 border-l-2 border-dashed border-slate-300 dark:border-slate-700"></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 dark:bg-slate-900/60 px-3 py-1 rounded-full border border-slate-200/80 dark:border-darkborder shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">
                        <i className={`fa-solid ${stop.transitToNext.icon || "fa-car-side"}`}></i>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {stop.transitToNext.time}
                      </span>
                      <span>•</span>
                      <span>{stop.transitToNext.desc}</span>
                      {stop.transitToNext.dist && (
                        <span className="text-slate-400 font-normal">({stop.transitToNext.dist})</span>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dedicated Day Shopping & Must-Buy Gems Box */}
        {dayObj.shoppingGems && dayObj.shoppingGems.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-pink-50/80 via-purple-50/50 to-pink-50/80 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-2xl p-3.5 border border-pink-200/80 dark:border-pink-900/50">
            <div className="flex items-center justify-between pb-2 border-b border-pink-200/50 dark:border-pink-900/50 mb-2.5">
              <span className="font-bold text-xs text-pink-900 dark:text-pink-300 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-pink-600" />
                <span>Day {dayObj.dayNum} Shopping & Must-Buy Gems</span>
              </span>
              <span className="text-[10px] font-bold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full">
                On-Ground Haul
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dayObj.shoppingGems.map((gem, gIdx) => (
                <div key={gIdx} className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-pink-100 dark:border-pink-900/30 text-xs">
                  <div className="flex justify-between items-start">
                    <strong className="text-pink-950 dark:text-pink-200 font-bold">{gem.place}</strong>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">{gem.price}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5 font-medium">{gem.items}</p>
                  <p className="text-pink-600 dark:text-pink-400 text-[10px] mt-1 italic">💡 Tip: {gem.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ⚡ LIVE "UP NEXT" HERO CARD CAROUSEL */}
      {upNextStop && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-4 border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => cycleNextStop(-1)}
                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs border border-slate-700 active:scale-95 transition"
                title="Previous Stop"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Scheduled Stop <span className="font-mono text-white">({globalStopIndex + 1}/{allStops.length})</span>
              </span>
              <button
                onClick={() => cycleNextStop(1)}
                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs border border-slate-700 active:scale-95 transition"
                title="Next Stop"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => shareWhatsAppPlan(normalizedDays.find((d) => d.dayNum === upNextStop.dayNum))}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow transition"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Day Plan</span>
            </button>
          </div>

          <div className="mt-2.5 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {upNextStop.time || "Scheduled"} (Day {upNextStop.dayNum})
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
                {upNextStop.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {upNextStop.desc}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={onOpenTaxi || onOpenHotelCard}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow active:scale-95 transition"
              >
                <Car className="w-3.5 h-3.5 text-amber-300" />
                <span>Taxi</span>
              </button>
              <button
                onClick={() => speakVietnamese(upNextStop.name)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ VIEW MODE SWITCHER: AT A GLANCE vs DETAILED HOURLY */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-3.5 sm:p-4 border border-indigo-800/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/40 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-sm shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold font-display leading-tight">
                Master Blueprint: North & Central Vietnam
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase">
                No South / No Cruise
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              7 Days (Dec 3–10, 2026) • 5 Adults • Hanoi, Ninh Binh, Hoi An & Da Nang
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode("glance")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 " + (
              viewMode === "glance"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ At A Glance</span>
          </button>
          <button
            onClick={() => setViewMode("detailed")}
            className={"px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 " + (
              viewMode === "detailed"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-slate-400 hover:text-white"
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>📋 Detailed Hourly</span>
          </button>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {viewMode === "glance" ? (
        <div id="at-a-glance-view-container" className="space-y-3.5">
          <AtAGlanceView
            days={normalizedDays}
            onOpenBudget={onOpenBudget}
            onSelectDay={(dayIdx) => {
              setSelectedDayIdx(dayIdx);
              setViewMode("detailed");
              window.scrollTo({ top: 150, behavior: "smooth" });
            }}
          />
        </div>
      ) : (
        <div id="detailed-timeline-view-wrapper" className="space-y-3.5">
          {/* Day Selector Pills Bar */}
          <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder p-2 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setSelectedDayIdx("all");
                setActiveStopId(null);
              }}
              className={"px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-sm transition-all " + (
                selectedDayIdx === "all"
                  ? "bg-slate-900 text-white dark:bg-brand-600"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              )}
            >
              All 7 Days
            </button>

            {normalizedDays.map((d, idx) => {
              const region = getRegionBadgeStyles(d.regionCode);
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDayIdx(idx);
                    setActiveStopId(null);
                  }}
                  className={"px-2.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1 " + (
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm font-bold"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  )}
                >
                  <span>D{d.dayNum} {d.title?.split(" ")[0]} {region.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Map / Timeline View Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white dark:bg-darkcard p-2 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-600" />
              <span>{mobileView === "map" ? "Interactive Route Map" : "Detailed Timeline List"}</span>
            </span>
            <button
              onClick={() => {
                setMobileView(mobileView === "list" ? "map" : "list");
                setTimeout(() => window.dispatchEvent(new Event("resize")), 80);
              }}
              className="px-3 py-1 bg-slate-900 dark:bg-brand-600 text-white font-bold rounded-xl shadow flex items-center gap-1.5 active:scale-95"
            >
              {mobileView === "list" ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              <span>{mobileView === "list" ? "Show Map" : "Show Timeline"}</span>
            </button>
          </div>

          {/* 2-Column Split: Timeline Cards (Left 7 Cols) & Sticky Leaflet Map (Right 5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Column: Timeline List */}
            <div className={"space-y-4 lg:col-span-7 " + (mobileView === "map" ? "hidden lg:block" : "block")}>
              {selectedDayIdx === "all" ? (
                normalizedDays.map((d, i) => renderDay(d, i))
              ) : (
                activeDay && renderDay(activeDay, selectedDayIdx)
              )}
            </div>

            {/* Right Column: Enhanced Map */}
            <div className={"lg:col-span-5 " + (mobileView === "list" ? "hidden lg:block" : "block")}>
              <div className="sticky top-[80px]">
                <InteractiveMap
                  stops={mapStops}
                  activeStopId={activeStopId}
                  onSelectStop={(id) => setActiveStopId(id)}
                  dayFilter={selectedDayIdx}
                  onOpenTaxi={onOpenTaxi}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stop Modal if triggered */}
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

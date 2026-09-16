import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, MapPin, Navigation, Compass, RotateCcw, ExternalLink, Car, Maximize2 } from "lucide-react";

export default function InteractiveMap({
  stops = [],
  activeStopId,
  onSelectStop,
  dayFilter = "all",
  className = "",
  onOpenTaxi
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const [mapLayerType, setMapLayerType] = useState("street"); // "street" (Esri Street) | "satellite" (Esri Sat) | "osm" (OpenStreetMap) | "dark" (Carto Dark)
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tilesLoading, setTilesLoading] = useState(true);

  // Category Icon & Color Metadata
  const getCategoryMeta = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("food") || c.includes("dining") || c.includes("restaurant") || c.includes("cafe")) {
      return { icon: "fa-utensils", color: "pin-emerald", bg: "bg-emerald-600 border-emerald-400" };
    }
    if (c.includes("hotel") || c.includes("stay") || c.includes("cruise") || c.includes("resort")) {
      return { icon: "fa-hotel", color: "pin-blue", bg: "bg-blue-600 border-blue-400" };
    }
    if (c.includes("attraction") || c.includes("sight") || c.includes("temple") || c.includes("pagoda")) {
      return { icon: "fa-camera", color: "pin-amber", bg: "bg-amber-500 border-amber-300" };
    }
    if (c.includes("shop") || c.includes("market")) {
      return { icon: "fa-cart-shopping", color: "pin-pink", bg: "bg-pink-600 border-pink-400" };
    }
    if (c.includes("scenic") || c.includes("mountain") || c.includes("fall") || c.includes("peak")) {
      return { icon: "fa-mountain", color: "pin-emerald", bg: "bg-emerald-600 border-emerald-400" };
    }
    return { icon: "fa-location-dot", color: "pin-purple", bg: "bg-indigo-600 border-indigo-400" };
  };

  // Filter stops by selected category
  const filteredStops = useMemo(() => {
    if (categoryFilter === "all") return stops;
    return stops.filter((s) => {
      const cat = (s.category || "").toLowerCase();
      if (categoryFilter === "food") return cat.includes("food") || cat.includes("dining") || cat.includes("cafe");
      if (categoryFilter === "hotel") return cat.includes("hotel") || cat.includes("stay") || cat.includes("basecamp");
      if (categoryFilter === "attraction") return cat.includes("attraction") || cat.includes("sight") || cat.includes("temple") || cat.includes("pagoda") || cat.includes("scenic");
      if (categoryFilter === "shop") return cat.includes("shop") || cat.includes("market");
      return true;
    });
  }, [stops, categoryFilter]);

  // High-reliability, 100% Free Tile Layers with ZERO API Keys required and NO watermarks
  const getTileLayer = (layerType) => {
    if (layerType === "satellite") {
      // 100% Free Esri World Imagery (High-res satellite, zero API keys required)
      return L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "&copy; Esri World Imagery"
        }
      );
    }

    if (layerType === "osm") {
      // 100% Free OpenStreetMap Standard Tiles (Universal open mapping, zero API keys)
      return L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors"
        }
      );
    }

    if (layerType === "dark") {
      // High-speed CDN CartoDB Dark Matter
      return L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          subdomains: ["a", "b", "c", "d"],
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap &copy; CARTO"
        }
      );
    }

    // Default: 100% Free Esri World Street Map (Crisp roads, topography, English & VN labels, ZERO API Key)
    return L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution: "&copy; Esri World Street Map"
      }
    );
  };

  // Recenter / Fit bounds to show WHOLE Vietnam Map or active cluster
  const fitMapBounds = (forceWholeVietnam = false) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    const stopsToFit = forceWholeVietnam ? stops : filteredStops;
    const latLngs = stopsToFit
      .filter((s) => s.coords && Array.isArray(s.coords) && s.coords.length === 2 && !isNaN(s.coords[0]))
      .map((s) => s.coords);

    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      // Zoom out to comfortably show whole Vietnam route without clipping
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: forceWholeVietnam ? 7 : 13
      });
    } else {
      // Geographic midpoint of Vietnam spanning Hanoi to Da Nang
      map.setView([18.2, 107.0], 5.8);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // By default, initialize view centered over the whole Vietnam territory (spanning Hanoi to Da Nang/Hoi An)
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      minZoom: 4,
      maxZoom: 19
    }).setView([18.2, 107.0], 5.8);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const layer = getTileLayer(mapLayerType);
    layer.on("load", () => setTilesLoading(false));
    layer.addTo(map);

    tileLayerRef.current = layer;
    mapInstanceRef.current = map;

    // Viewport size invalidation triggers
    const invalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ debounceMoveEnd: true });
      }
    };

    requestAnimationFrame(invalidate);
    const t1 = setTimeout(invalidate, 50);
    const t2 = setTimeout(invalidate, 200);
    const t3 = setTimeout(() => {
      invalidate();
      // On initial load, fit the bounds of the WHOLE Vietnam route
      fitMapBounds(true);
    }, 400);

    // Attach ResizeObserver to container
    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        invalidate();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Toggle
  const switchLayer = (type) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setMapLayerType(type);
    setTilesLoading(true);

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const nextLayer = getTileLayer(type);
    nextLayer.on("load", () => setTilesLoading(false));
    nextLayer.addTo(map);
    tileLayerRef.current = nextLayer;

    if (type === "satellite") {
      mapContainerRef.current?.classList.add("satellite-mode");
    } else {
      mapContainerRef.current?.classList.remove("satellite-mode");
    }
  };

  // Plot and update markers & polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.invalidateSize();

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Remove existing polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const validStops = filteredStops.filter(
      (s) => s.coords && Array.isArray(s.coords) && s.coords.length === 2 && !isNaN(s.coords[0])
    );

    if (validStops.length === 0) return;

    const latLngs = [];

    validStops.forEach((stop, idx) => {
      const { icon, color } = getCategoryMeta(stop.category);
      const dayNum = stop.day || stop.dayNum || (idx + 1);

      const html = `
        <div class="custom-map-pin ${color} ${activeStopId === stop.id ? "active-pin ring-4 ring-amber-400" : ""}">
          <i class="fa-solid ${icon} text-[13px]"></i>
          <span class="pin-badge">${dayNum}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });

      // Google Maps Direct Search URL & Navigation Directions URL
      const queryStr = encodeURIComponent(`${stop.name} ${stop.vietnamese || ""} ${stop.address || ""}`.trim());
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${queryStr}+@${stop.coords[0]},${stop.coords[1]}`;
      const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.coords[0]},${stop.coords[1]}`;

      // Native Leaflet Hover Tooltip
      const tooltipContent = `
        <div style="font-family:sans-serif;padding:3px 6px;text-align:left;line-height:1.3;">
          <div style="font-weight:800;font-size:11px;color:#0f172a;">${stop.name}</div>
          ${stop.vietnamese ? `<div style="font-size:10px;color:#059669;font-weight:700;font-family:monospace;">🇻🇳 ${stop.vietnamese}</div>` : ""}
          <div style="font-size:9.5px;color:#2563eb;font-weight:700;margin-top:2px;">
            🗺️ Click for Google Maps & Directions
          </div>
        </div>
      `;

      // Rich Click Popup Card
      const popupContent = `
        <div style="min-width:240px;max-width:300px;background:#0f172a;color:#fff;border-radius:18px;padding:13px;font-family:sans-serif;box-shadow:0 12px 30px rgba(0,0,0,0.6);border:1px solid #1e293b;">
          <div style="display:flex;align-items:center;justify-content:between;gap:6px;margin-bottom:4px;">
            <span style="font-size:10px;font-weight:900;color:#fbbf24;text-transform:uppercase;letter-spacing:0.5px;">
              Day ${dayNum} • ${stop.category || "Stop"}
            </span>
          </div>
          
          <div style="font-size:13.5px;font-weight:900;color:#fff;margin:2px 0 2px 0;line-height:1.25;">
            ${stop.name}
          </div>
          
          ${stop.vietnamese ? `<div style="font-size:11px;font-weight:700;color:#34d399;font-family:monospace;margin-bottom:4px;">🇻🇳 ${stop.vietnamese}</div>` : ""}
          ${stop.time ? `<div style="font-size:10.5px;color:#94a3b8;margin-bottom:5px;font-family:monospace;">⏰ ${stop.time}</div>` : ""}
          
          ${stop.shoppingGem ? `<div style="font-size:10px;font-weight:bold;color:#f472b6;background:rgba(131,24,67,0.3);border:1px solid rgba(219,39,119,0.4);padding:3px 7px;border-radius:7px;margin-bottom:6px;line-height:1.3;">🛍️ ${stop.shoppingGem}</div>` : ""}
          ${stop.insiderTip ? `<div style="font-size:10px;color:#fde047;background:rgba(113,63,18,0.3);border:1px solid rgba(202,138,4,0.3);padding:3px 7px;border-radius:7px;margin-bottom:6px;line-height:1.3;">💡 ${stop.insiderTip}</div>` : ""}
          ${stop.desc ? `<div style="font-size:10.5px;color:#cbd5e1;line-height:1.35;margin-bottom:8px;">${stop.desc}</div>` : ""}
          
          <!-- Primary Actions with Google Maps Options -->
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid #1e293b;">
            <!-- Prominent Open with Google Maps Button -->
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
               style="display:flex;align-items:center;justify-content:center;gap:6px;background:#1a73e8;color:#fff;font-size:11.5px;font-weight:bold;padding:7px 10px;border-radius:10px;text-decoration:none;box-shadow:0 3px 8px rgba(26,115,232,0.4);transition:all 0.2s;">
              <span>🗺️ Open with Google Maps</span> ↗
            </a>

            <!-- Sub-actions: Directions + Taxi Driver Card -->
            <div style="display:flex;gap:5px;">
              <a href="${googleDirectionsUrl}" target="_blank" rel="noopener noreferrer"
                 style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;background:#10b981;color:#fff;font-size:10.5px;font-weight:bold;padding:6px 6px;border-radius:8px;text-decoration:none;box-shadow:0 2px 6px rgba(16,185,129,0.3);">
                <span>🚗 Directions</span> ↗
              </a>
              <button onclick="window.dispatchEvent(new CustomEvent('trigger-taxi-card', { detail: '${stop.id}' }))"
                 style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;background:#f59e0b;color:#0f172a;font-size:10.5px;font-weight:bold;padding:6px 6px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 2px 6px rgba(245,158,11,0.3);">
                <span>🚕 Taxi Card</span>
              </button>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker(stop.coords, { icon: customIcon })
        .bindPopup(popupContent)
        .bindTooltip(tooltipContent, {
          direction: "top",
          offset: [0, -20],
          opacity: 0.95
        })
        .addTo(map);

      marker.on("click", () => {
        if (onSelectStop) onSelectStop(stop.id);
      });

      markersRef.current[stop.id] = marker;
      latLngs.push(stop.coords);
    });

    // Draw route polyline connecting the day stops
    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: "#fbbf24",
        weight: 3.5,
        opacity: 0.85,
        dashArray: "6, 8",
        lineCap: "round"
      }).addTo(map);
    }

    // By default on initial load or when showing all stops, frame the whole Vietnam route
    if (!activeStopId && latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: dayFilter === "all" ? 7 : 13
      });
    }
  }, [filteredStops, mapLayerType]);

  // Handle activeStopId Fly-To
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeStopId) return;

    map.invalidateSize();

    const targetMarker = markersRef.current[activeStopId];
    if (targetMarker) {
      map.flyTo(targetMarker.getLatLng(), 14, { duration: 0.75 });
      setTimeout(() => {
        targetMarker.openPopup();
      }, 750);
    }
  }, [activeStopId]);

  // Listen for Taxi Driver Card button clicks from inside the popup
  useEffect(() => {
    const handleTaxiEvent = (e) => {
      const stopId = e.detail;
      const found = stops.find((s) => s.id === stopId);
      if (found && onOpenTaxi) {
        onOpenTaxi(found);
      }
    };
    window.addEventListener("trigger-taxi-card", handleTaxiEvent);
    return () => window.removeEventListener("trigger-taxi-card", handleTaxiEvent);
  }, [stops, onOpenTaxi]);

  return (
    <div id="map-container" className={"relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-darkborder shadow-lg bg-slate-900 " + className}>
      {/* Floating Interactive Map Controls Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[400] bg-white/95 dark:bg-darkcard/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-darkborder flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: "10s" }} />
            <span className="font-black text-[11px] text-slate-900 dark:text-white">
              Live Vietnam Route Map
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold font-mono">
              Free • Zero API Key
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Whole Vietnam Zoom Out Button */}
            <button
              onClick={() => fitMapBounds(true)}
              className="px-2 py-0.5 rounded-lg font-bold bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-[10px] border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 active:scale-95 transition cursor-pointer"
              title="Show the whole Vietnam country route zoomed out"
            >
              <Maximize2 className="w-3 h-3 text-indigo-500" />
              <span>Whole Vietnam</span>
            </button>

            {/* Recenter Current Day Cluster */}
            <button
              onClick={() => fitMapBounds(false)}
              className="px-2 py-0.5 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-300 dark:border-slate-700 flex items-center gap-1 active:scale-95 transition cursor-pointer"
              title="Fit currently visible pins in view"
            >
              <RotateCcw className="w-3 h-3 text-amber-500" />
              <span>Recenter</span>
            </button>
          </div>
        </div>

        {/* Layer Switcher & Category Filter Row */}
        <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5 border-t border-slate-100 dark:border-darkborder">
          {/* Layer Switcher Pills */}
          <div className="flex items-center gap-1 text-[10px] font-bold font-mono">
            <button
              onClick={() => switchLayer("street")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                mapLayerType === "street"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Street (Esri)
            </button>
            <button
              onClick={() => switchLayer("satellite")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                mapLayerType === "satellite"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => switchLayer("osm")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                mapLayerType === "osm"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => switchLayer("dark")}
              className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                mapLayerType === "dark"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Dark
            </button>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCategoryFilter("all")}
              className={"px-2 py-0.5 rounded-md font-bold text-[9.5px] shrink-0 transition-all cursor-pointer " + (
                categoryFilter === "all"
                  ? "bg-slate-900 text-white dark:bg-brand-600 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              )}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter("food")}
              className={"px-2 py-0.5 rounded-md font-bold text-[9.5px] shrink-0 transition-all cursor-pointer " + (
                categoryFilter === "food"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
              )}
            >
              🍲 Veg
            </button>
            <button
              onClick={() => setCategoryFilter("hotel")}
              className={"px-2 py-0.5 rounded-md font-bold text-[9.5px] shrink-0 transition-all cursor-pointer " + (
                categoryFilter === "hotel"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
              )}
            >
              🏨 Stays
            </button>
            <button
              onClick={() => setCategoryFilter("attraction")}
              className={"px-2 py-0.5 rounded-md font-bold text-[9.5px] shrink-0 transition-all cursor-pointer " + (
                categoryFilter === "attraction"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
              )}
            >
              🏛️ Sights
            </button>
            <button
              onClick={() => setCategoryFilter("shop")}
              className={"px-2 py-0.5 rounded-md font-bold text-[9.5px] shrink-0 transition-all cursor-pointer " + (
                categoryFilter === "shop"
                  ? "bg-pink-600 text-white shadow-xs"
                  : "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300"
              )}
            >
              🛍️ Shop
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {tilesLoading && (
        <div className="absolute inset-0 z-[399] flex flex-col items-center justify-center bg-slate-900/75 backdrop-blur-xs text-white pointer-events-none transition-opacity duration-300">
          <Compass className="w-8 h-8 text-amber-400 animate-spin mb-2" />
          <span className="text-xs font-bold text-slate-200">Loading Vietnam Route Map...</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">High-speed global CDN (Zero API Key)</span>
        </div>
      )}

      {/* Map DOM Target */}
      <div
        ref={mapContainerRef}
        id="map"
        className="w-full h-[520px] lg:h-[calc(100vh-140px)] min-h-[420px] bg-slate-900"
      />
    </div>
  );
}

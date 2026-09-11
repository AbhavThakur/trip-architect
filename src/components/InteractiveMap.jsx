import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Layers, MapPin, Navigation, Eye } from "lucide-react";

export default function InteractiveMap({
  stops = [],
  activeStopId,
  onSelectStop,
  dayFilter = "all",
  className = ""
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const [mapType, setMapType] = useState("street"); // "street" | "satellite"

  // Get icon & color for stop
  const getCategoryMeta = (cat = "") => {
    const c = cat.toLowerCase();
    if (c.includes("food") || c.includes("dining") || c.includes("restaurant") || c.includes("cafe")) {
      return { icon: "fa-utensils", color: "bg-rose-600 border-rose-400" };
    }
    if (c.includes("hotel") || c.includes("stay") || c.includes("cruise") || c.includes("resort")) {
      return { icon: "fa-hotel", color: "bg-indigo-600 border-indigo-400" };
    }
    if (c.includes("attraction") || c.includes("sight") || c.includes("temple") || c.includes("pagoda")) {
      return { icon: "fa-camera", color: "bg-amber-500 border-amber-300" };
    }
    if (c.includes("scenic") || c.includes("mountain") || c.includes("fall") || c.includes("peak")) {
      return { icon: "fa-mountain", color: "bg-emerald-600 border-emerald-400" };
    }
    if (c.includes("transit") || c.includes("bus") || c.includes("flight") || c.includes("airport")) {
      return { icon: "fa-plane-departure", color: "bg-blue-600 border-blue-400" };
    }
    return { icon: "fa-map-pin", color: "bg-teal-600 border-teal-400" };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center (e.g. Vietnam Hanoi or Chikmagalur)
    const initialCoords = stops[0]?.coords || [16.0544, 108.2022];

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(initialCoords, 12);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial Street Tiles
    const streetTile = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    });
    streetTile.addTo(map);
    tileLayerRef.current = streetTile;
    mapInstanceRef.current = map;

    // Apply dark styling to container
    mapContainerRef.current.classList.add("dark-map");

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Toggle (Street / Satellite)
  const toggleMapLayer = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === "street") {
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      );
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;
      mapContainerRef.current?.classList.remove("dark-map");
      setMapType("satellite");
    } else {
      const streetLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      });
      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;
      mapContainerRef.current?.classList.add("dark-map");
      setMapType("street");
    }
  };

  // Plot and update markers & polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Remove existing polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const validStops = stops.filter(
      (s) => s.coords && Array.isArray(s.coords) && s.coords.length === 2 && !isNaN(s.coords[0])
    );

    if (validStops.length === 0) return;

    const latLngs = [];

    validStops.forEach((stop, idx) => {
      const { icon, color } = getCategoryMeta(stop.category);
      const dayNum = stop.day || (idx + 1);

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

      const navUrl = `https://www.google.com/maps/search/?api=1&query=${stop.coords[0]},${stop.coords[1]}`;

      const popupContent = `
        <div style="min-width:200px;max-width:260px;background:#0f172a;color:#fff;border-radius:12px;padding:12px;font-family:sans-serif;">
          <div style="font-size:10px;font-weight:bold;color:#fbbf24;text-transform:uppercase;letter-spacing:0.5px;">
            Day ${dayNum} • ${stop.category || "Stop"}
          </div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin:4px 0;">
            ${stop.name}
          </div>
          ${stop.time ? `<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">⏰ ${stop.time}</div>` : ""}
          ${stop.desc ? `<div style="font-size:11px;color:#cbd5e1;line-height:1.35;margin-bottom:8px;">${stop.desc}</div>` : ""}
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer"
             style="display:flex;align-items:center;justify-content:center;gap:4px;background:#10b981;color:#fff;font-size:11px;font-weight:bold;padding:6px 10px;border-radius:8px;text-decoration:none;">
            <span>Navigate in Maps</span> ↗
          </a>
        </div>
      `;

      const marker = L.marker(stop.coords, { icon: customIcon })
        .bindPopup(popupContent)
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
        opacity: 0.75,
        dashArray: "6, 8",
        lineCap: "round"
      }).addTo(map);
    }

    // Fit bounds if stops changed and not focusing a specific stop
    if (!activeStopId && latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [stops, mapType]);

  // Handle activeStopId Fly-To
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeStopId) return;

    const targetMarker = markersRef.current[activeStopId];
    if (targetMarker) {
      map.flyTo(targetMarker.getLatLng(), 15, { duration: 0.75 });
      setTimeout(() => {
        targetMarker.openPopup();
      }, 750);
    }
  }, [activeStopId]);

  return (
    <div id="map-container" className={"relative w-full " + className}>
      {/* Floating Layer Switcher Pill */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl">
        <button
          onClick={toggleMapLayer}
          className={"px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 " + (
            mapType === "satellite"
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-800 text-amber-400 hover:text-white"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapType === "satellite" ? "Satellite" : "Street"}</span>
        </button>
      </div>

      {/* Map DOM Target */}
      <div ref={mapContainerRef} id="map" className="w-full h-full" />
    </div>
  );
}

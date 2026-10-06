/**
 * WhatsApp Sharing Utilities for Trip Architect
 * Formats day-wise and full-trip data for WhatsApp with:
 * - Clean double-newline spacing between every point
 * - Direct, clickable Google Maps links for every stop and hotel
 * - Authentic local names, timings, shopping gems, senior mobility notes
 * - Emergency contacts & live web planner URL
 */

export function getGoogleMapsUrl(place) {
  if (!place) return null;
  if (place.mapsUrl) return place.mapsUrl;

  // Array coords [lat, lng]
  if (place.coords && Array.isArray(place.coords) && place.coords.length === 2) {
    const [lat, lng] = place.coords;
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      return `https://maps.google.com/?q=${lat},${lng}`;
    }
  }

  // Object lat / lng
  if (place.lat != null && place.lng != null && !isNaN(place.lat) && !isNaN(place.lng)) {
    return `https://maps.google.com/?q=${place.lat},${place.lng}`;
  }

  // Fallback to Google Maps Search query with name and address
  const parts = [place.name, place.vietnamese, place.address, place.city]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter((s) => s.length > 0);

  if (parts.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(" "))}`;
  }

  return null;
}

export function formatDayForWhatsApp(day, trip = {}) {
  if (!day) return "";

  const dayNum = day.day || day.dayNum || 1;
  const flag = trip?.flag || "🧭";
  const tripTitle = trip?.title || "Trip Plan";
  const lines = [];

  // 1. Header Block
  lines.push(`${flag} *${tripTitle.toUpperCase()}*`);
  lines.push(`🗓️ *DAY ${dayNum}: ${day.title || `Day ${dayNum} Plan`}*`);

  if (day.date) {
    lines.push(`📅 *Date:* ${day.date}`);
  }
  if (day.weather) {
    lines.push(`⛅ *Weather:* ${day.weather}`);
  }
  if (trip?.travelers) {
    lines.push(`👥 *Travelers:* ${trip.travelers}`);
  }
  if (day.subtitle) {
    lines.push(`🎯 *Focus:* ${day.subtitle}`);
  }

  lines.push(""); // Spacing after header

  // 2. Flight/Transit Leg on this day
  const rawPlaces = day.places || day.events || day.stops || [];
  const flightStops = rawPlaces.filter(
    (p) => p.category === "flight" || p.flightKey || (p.type && p.type.toLowerCase().includes("flight"))
  );

  if (flightStops.length > 0 && trip?.flights) {
    const flightList = Array.isArray(trip.flights) ? trip.flights : [];
    flightStops.forEach((fs) => {
      const flKey = fs.flightKey;
      const fl = flKey
        ? flightList.find((f) => f.key === flKey || f.id === flKey)
        : flightList[0];
      if (fl) {
        lines.push(`✈️ *FLIGHT CONFIRMATION:* ${fl.sector || `${fl.from} ➔ ${fl.to}`}`);
        lines.push(`• Airline: ${fl.airline || "Flight"} (${fl.flightNo || fl.flightNumber || "Scheduled"})`);
        if (fl.dept || fl.departure) lines.push(`• Timing: Dep ${fl.dept || fl.departure} ➔ Arr ${fl.arr || fl.arrival}`);
        if (fl.pnr) lines.push(`• PNR: *${fl.pnr}* (${fl.status || "Confirmed"})`);
        lines.push(""); // spacing after flight
      }
    });
  }

  // 3. Hourly Stops Breakdown
  if (rawPlaces.length > 0) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📍 *HOURLY SCHEDULE & SIGHTSEEING (${rawPlaces.length} Stops)*`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(""); // spacing before first stop

    rawPlaces.forEach((stop, idx) => {
      const order = idx + 1;
      const timeStr = stop.time ? `[${stop.time}] ` : "";
      const stopName = stop.name || stop.title || `Stop ${order}`;
      const viName = stop.vietnamese ? ` _(${stop.vietnamese})_` : "";

      lines.push(`*${order}. ${timeStr}${stopName}*${viName}`);

      const mapsUrl = getGoogleMapsUrl(stop);
      if (mapsUrl) {
        lines.push(`🗺️ Map: ${mapsUrl}`);
      }

      if (stop.address) {
        lines.push(`📍 Location: ${stop.address}`);
      }

      const desc = stop.desc || stop.notes || stop.description;
      if (desc) {
        lines.push(`📝 Note: ${desc}`);
      }

      const gem = stop.shoppingGem || stop.mustBuy || (stop.category === "shopping" ? stop.notes : null);
      if (gem) {
        lines.push(`🛍️ *Must-Buy / Gem:* ${gem}`);
      }

      if (stop.seniorTip) {
        lines.push(`👴 Senior Mobility: ${stop.seniorTip}`);
      }

      if (stop.insiderTip && stop.insiderTip !== stop.seniorTip && stop.insiderTip !== desc) {
        lines.push(`💡 Insider Tip: ${stop.insiderTip}`);
      }

      if (stop.transitToNext) {
        const transitText = typeof stop.transitToNext === "object"
          ? [stop.transitToNext.time, stop.transitToNext.desc].filter(Boolean).join(" — ")
          : String(stop.transitToNext);
        if (transitText) {
          lines.push(`🚗 Transit: ${transitText}`);
        }
      }

      // CRITICAL: Double-newline after every stop creates clean spacing in WhatsApp!
      lines.push("");
    });
  }

  // 4. Overnight Stay & Hotel Details
  let hotel = null;
  if (trip?.hotels) {
    const hotelObj = trip.hotels;
    if (day.hotelKey && typeof hotelObj === "object") {
      hotel = Array.isArray(hotelObj)
        ? hotelObj.find((h) => h.key === day.hotelKey || h.id === day.hotelKey)
        : hotelObj[day.hotelKey];
    }
    if (!hotel && typeof hotelObj === "object") {
      const allHotels = Array.isArray(hotelObj) ? hotelObj : Object.values(hotelObj);
      const dayText = ((day.hotelName || "") + " " + (day.title || "")).toLowerCase();
      hotel = allHotels.find((h) => {
        const hName = (h.name || "").toLowerCase();
        const hCity = (h.city || "").toLowerCase();
        return (
          (dayText.includes("da nang") && (hCity.includes("da nang") || hName.includes("bluesun") || hName.includes("tms"))) ||
          (dayText.includes("hanoi") && (hCity.includes("hanoi") || hName.includes("la casa") || hName.includes("peridot"))) ||
          (dayText.includes("halong") && (hCity.includes("halong") || hName.includes("cruise") || hName.includes("amanda")))
        );
      });
    }
  }

  const hotelName = day.hotelName || hotel?.name;
  if (hotelName) {
    lines.push(`🏨 *OVERNIGHT STAY:* *${hotelName}*`);
    if (hotel?.city) lines.push(`• Area: ${hotel.city}`);
    if (hotel?.address) lines.push(`• Address: ${hotel.address}`);
    if (hotel?.addressVi) lines.push(`• Taxi Address (VN): _${hotel.addressVi}_`);
    const hotelMap = hotel ? getGoogleMapsUrl(hotel) : getGoogleMapsUrl({ name: hotelName, address: hotel?.address });
    if (hotelMap) lines.push(`🗺️ Hotel Map: ${hotelMap}`);
    if (hotel?.phone) lines.push(`📞 Phone: ${hotel.phone}`);
    if (hotel?.pnr || hotel?.voucher) lines.push(`🔖 Voucher / Ref: *${hotel.pnr || hotel.voucher}*`);
    lines.push(""); // spacing
  }

  // 5. Veg Dining Recommendation
  if (day.keyVegMeal) {
    lines.push(`🥗 *VEGETARIAN DINING:* ${day.keyVegMeal}`);
    lines.push(""); // spacing
  }

  // 6. Emergency Contacts
  if (trip?.emergency) {
    lines.push(`🚨 *EMERGENCY CONTACTS & 24/7 HELPLINES:*`);
    if (trip.emergency.tourOperator) {
      lines.push(`• Concierge: ${trip.emergency.tourOperator}`);
    }
    if (trip.emergency.embassy) {
      lines.push(`• Indian Embassy: ${trip.emergency.embassy}`);
    }
    if (trip.emergency.police || trip.emergency.ambulance) {
      lines.push(`• Local SOS: Police ${trip.emergency.police || "113"} | Ambulance ${trip.emergency.ambulance || "115"}`);
    }
    lines.push(""); // spacing
  }

  // 7. Interactive Live Link
  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const tripParam = trip?.id ? `?trip=${trip.id}&day=${dayNum}` : `?day=${dayNum}`;
    lines.push(`🔗 *Open in Live Interactive Planner:* ${origin}${pathname}${tripParam}`);
  }

  return lines.join("\n");
}

export function formatFullTripForWhatsApp(trip = {}) {
  if (!trip) return "";

  const flag = trip.flag || "🧭";
  const tripTitle = trip.title || "Trip Plan";
  const days = trip.itinerary || trip.days || [];
  const lines = [];

  // Header
  lines.push(`${flag} *${tripTitle.toUpperCase()} — COMPLETE MASTER ITINERARY*`);
  if (trip.dates) lines.push(`🗓️ *Dates:* ${trip.dates} (${trip.daysCount || days.length} Days)`);
  if (trip.travelers) lines.push(`👥 *Travelers:* ${trip.travelers}`);
  if (trip.summary) lines.push(`📋 *Summary:* ${trip.summary}`);
  lines.push("");

  // Flights Summary
  if (trip.flights && trip.flights.length > 0) {
    lines.push(`✈️ *CONFIRMED FLIGHTS SUMMARY:*`);
    trip.flights.forEach((fl) => {
      lines.push(`• *${fl.sector || `${fl.from} ➔ ${fl.to}`}*`);
      lines.push(`  ${fl.airline || "Flight"} ${fl.flightNo || fl.flightNumber || ""} | Dep: ${fl.dept || fl.departure || "TBD"} | PNR: *${fl.pnr || "Confirmed"}*`);
    });
    lines.push("");
  }

  // Day-wise Summary
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📅 *DAY-BY-DAY OVERVIEW*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push("");

  days.forEach((day, idx) => {
    const dayNum = day.day || day.dayNum || (idx + 1);
    lines.push(`*DAY ${dayNum}: ${day.title || `Day ${dayNum}`}*`);
    if (day.date) lines.push(`🗓️ Date: ${day.date}`);
    if (day.weather) lines.push(`⛅ Weather: ${day.weather}`);

    const rawPlaces = day.places || day.events || day.stops || [];
    if (rawPlaces.length > 0) {
      lines.push(`📍 Key Stops (${rawPlaces.length}):`);
      rawPlaces.slice(0, 5).forEach((p) => {
        const pMap = getGoogleMapsUrl(p);
        const mapText = pMap ? ` (Map: ${pMap})` : "";
        lines.push(`  • ${p.time ? `[${p.time}] ` : ""}${p.name || p.title}${mapText}`);
      });
      if (rawPlaces.length > 5) {
        lines.push(`  • ... plus ${rawPlaces.length - 5} more stops`);
      }
    }

    if (day.hotelName) {
      lines.push(`🏨 Stay: ${day.hotelName}`);
    }

    // Clean spacing after every day!
    lines.push("");
  });

  // Stays / Hotels Summary
  if (trip.hotels) {
    lines.push(`🏨 *CONFIRMED ACCOMMODATIONS:*`);
    const hotelList = Array.isArray(trip.hotels) ? trip.hotels : Object.values(trip.hotels);
    hotelList.forEach((h) => {
      lines.push(`• *${h.name}* (${h.city || "Stay"})`);
      if (h.dates) lines.push(`  Dates: ${h.dates}`);
      if (h.pnr || h.voucher) lines.push(`  Voucher: *${h.pnr || h.voucher}*`);
      const hMap = getGoogleMapsUrl(h);
      if (hMap) lines.push(`  Map: ${hMap}`);
    });
    lines.push("");
  }

  // Emergency contacts
  if (trip.emergency) {
    lines.push(`🚨 *EMERGENCY CONTACTS:*`);
    if (trip.emergency.tourOperator) lines.push(`• Concierge: ${trip.emergency.tourOperator}`);
    if (trip.emergency.embassy) lines.push(`• Indian Embassy: ${trip.emergency.embassy}`);
    if (trip.emergency.police || trip.emergency.ambulance) {
      lines.push(`• Police: ${trip.emergency.police || "113"} | Ambulance: ${trip.emergency.ambulance || "115"}`);
    }
    lines.push("");
  }

  if (typeof window !== "undefined" && window.location) {
    lines.push(`🔗 *Full Interactive Live Planner:* ${window.location.origin}${window.location.pathname}?trip=${trip.id || ""}`);
  }

  return lines.join("\n");
}

export function openWhatsAppShare(text) {
  if (!text) return;
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyWhatsAppText(text) {
  if (!text) return false;
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Clipboard copy error:", err);
    return false;
  }
}

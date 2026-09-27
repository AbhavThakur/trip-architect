import React, { useState, useEffect } from "react";
import {
  Ticket, Bus, Hotel, Car, CheckCircle2, Clock, ExternalLink,
  Copy, Check, Calendar, MapPin, Sparkles, Navigation, AlertCircle,
  FileText, ShieldCheck, Download, ArrowRight, Share2, Info,
  Upload, Trash2, Eye, Loader2, FileCheck, Plane
} from "lucide-react";
import { uploadTicketPdf, deleteTicketPdf } from "../services/supabase";

// Dynamic builder that derives booking items strictly from the given trip
export function getQuickBookingsForTrip(trip) {
  if (!trip) return [];

  // 1. Explicit quickBookings in trip JSON take priority
  if (Array.isArray(trip.quickBookings) && trip.quickBookings.length > 0) {
    return trip.quickBookings;
  }

  const generated = [];

  // 2. Synthesize from trip.flights
  if (Array.isArray(trip.flights) && trip.flights.length > 0) {
    trip.flights.forEach((f, idx) => {
      generated.push({
        id: f.id || `flight-${f.key || idx}`,
        title: f.sector || (f.flightNumber ? `${f.airline || "Flight"} (${f.flightNumber}): ${f.from} ➔ ${f.to}` : `Flight ${idx + 1}`),
        category: "transit",
        icon: "plane",
        date: f.dept ? `${f.dept} (Arr: ${f.arr || "TBD"})` : (f.date ? `${f.date} • ${f.departure || "TBD"}` : "Scheduled Flight"),
        operator: f.airline || "Airline Carrier",
        pickup: f.from ? `${f.from}` : "Departure Airport",
        drop: f.to ? `${f.to}` : "Arrival Airport",
        seats: f.seats || (trip.travelers ? `${trip.travelers} Confirmed` : "Confirmed Seats"),
        price: f.price || (f.pnr ? `Confirmed • PNR: ${f.pnr}` : "Confirmed Flight"),
        primaryUrl: f.bookingUrl || (f.airline?.toLowerCase().includes("indigo") ? "https://www.goindigo.in" : f.airline?.toLowerCase().includes("vietjet") ? "https://www.vietjetair.com" : "https://www.google.com/travel/flights"),
        primaryLabel: f.airline ? `Official ${f.airline} Portal` : "Flight Booking Portal",
        pnrPlaceholder: f.pnr || "CONFIRMED-PNR",
        querySummary: `${f.from || "Origin"} ➔ ${f.to || "Destination"} • PNR: ${f.pnr || "Confirmed"}`
      });
    });
  }

  // 3. Synthesize from trip.stays or trip.hotels
  const staysList = Array.isArray(trip.stays)
    ? trip.stays
    : (trip.hotels && typeof trip.hotels === "object" ? Object.values(trip.hotels) : []);

  if (staysList.length > 0) {
    staysList.forEach((s, idx) => {
      generated.push({
        id: s.id || `stay-${s.key || idx}`,
        title: `${s.name || "Basecamp Stay"} [${s.city || "Hotel"}]`,
        category: "stay",
        icon: "hotel",
        date: s.dates ? `Dates: ${s.dates}` : (s.checkIn ? `Check-in: ${s.checkIn}` : "Confirmed Dates"),
        operator: s.phone ? `${s.name} (Phone: ${s.phone})` : (s.name || "Hotel Concierge"),
        pickup: s.address || s.location || trip.destination || "Basecamp Address",
        drop: s.room || "Reserved Accommodation",
        seats: s.room || `${trip.travelers || "Family"} Confirmed`,
        price: s.price || (s.pnr ? `Confirmed • PNR: ${s.pnr}` : "Confirmed Reservation"),
        primaryUrl: s.bookingUrl || s.primaryUrl || (s.coords ? `https://www.google.com/maps/search/?api=1&query=${s.coords[0]},${s.coords[1]}` : "https://www.google.com/maps"),
        primaryLabel: s.bookingLabel || `${s.name || "Hotel"} on Maps`,
        altUrl: s.bookingAltUrl || s.altUrl || null,
        altLabel: s.altLabel || null,
        pnrPlaceholder: s.pnr || (s.phone ? `PHONE: ${s.phone}` : "CONFIRMED-STAY"),
        querySummary: `${s.name || "Stay"} • ${s.dates || s.checkIn || ""} • ${s.city || ""}`
      });
    });
  } else if (trip.basecamp && trip.basecamp.name) {
    generated.push({
      id: "basecamp-stay",
      title: `${trip.basecamp.name} [BASECAMP]`,
      category: "stay",
      icon: "hotel",
      date: `Check-in: ${trip.basecamp.checkIn || trip.dates || "Scheduled"}`,
      operator: trip.basecamp.phone ? `${trip.basecamp.name} (Phone: ${trip.basecamp.phone})` : trip.basecamp.name,
      pickup: trip.basecamp.address || trip.basecamp.location || trip.destination || "Hotel",
      drop: "Basecamp Accommodation",
      seats: trip.travelers || "Confirmed Guests",
      price: "Confirmed Stay",
      primaryUrl: trip.basecamp.bookingUrl || "https://www.google.com/maps",
      primaryLabel: "Basecamp Map & Booking",
      pnrPlaceholder: trip.basecamp.phone ? `PHONE: ${trip.basecamp.phone}` : "BASECAMP-CONFIRMED",
      querySummary: `${trip.basecamp.name} • ${trip.basecamp.checkIn || trip.dates || ""}`
    });
  }

  // 4. Synthesize from trip.transit
  if (trip.transit) {
    if (trip.transit.outbound) {
      const out = trip.transit.outbound;
      generated.push({
        id: "transit-outbound",
        title: out.title || "Outbound Transit Journey",
        category: "transit",
        icon: out.mode === "flight" ? "plane" : out.mode === "car" ? "car" : "bus",
        date: out.date ? `${out.date} • ${out.deptTime || ""}` : "Outbound Schedule",
        operator: out.operator || "Transit Operator",
        pickup: out.from || "Departure Station",
        drop: out.to || "Destination Station",
        seats: out.seats || trip.travelers || "Confirmed Seats",
        price: out.pnr ? `Confirmed • PNR: ${out.pnr}` : "Confirmed Journey",
        primaryUrl: out.primaryUrl || (out.operator?.includes("KSRTC") ? "https://www.ksrtc.in" : "https://www.redbus.in"),
        primaryLabel: out.operator ? `Official ${out.operator} Portal` : "Transit Booking Portal",
        pnrPlaceholder: out.pnr || "CONFIRMED-PNR",
        querySummary: `${out.from} ➔ ${out.to} • ${out.date || ""} • ${out.seats || ""}`
      });
    }
    if (trip.transit.returnTrip) {
      const ret = trip.transit.returnTrip;
      generated.push({
        id: "transit-return",
        title: ret.title || "Return Transit Journey",
        category: "transit",
        icon: ret.mode === "flight" ? "plane" : ret.mode === "car" ? "car" : "bus",
        date: ret.date ? `${ret.date} • ${ret.deptTime || ""}` : "Return Schedule",
        operator: ret.operator || "Transit Operator",
        pickup: ret.from || "Departure Station",
        drop: ret.to || "Destination Station",
        seats: ret.seats || trip.travelers || "Confirmed Seats",
        price: ret.pnr ? `Confirmed • PNR: ${ret.pnr}` : "Confirmed Journey",
        primaryUrl: ret.primaryUrl || (ret.operator?.includes("KSRTC") ? "https://www.ksrtc.in" : "https://www.redbus.in"),
        primaryLabel: ret.operator ? `Official ${ret.operator} Portal` : "Transit Booking Portal",
        pnrPlaceholder: ret.pnr || "CONFIRMED-PNR",
        querySummary: `${ret.from} ➔ ${ret.to} • ${ret.date || ""} • ${ret.seats || ""}`
      });
    }
  }

  // 5. Synthesize from trip.limoTransfers
  if (Array.isArray(trip.limoTransfers) && trip.limoTransfers.length > 0) {
    const mainLimo = trip.limoTransfers[0];
    generated.push({
      id: "limo-fleet",
      title: "Private 9-Seater DCar Limousine Fleet (All 9 Legs)",
      category: "transit",
      icon: "car",
      date: `${trip.dates || "Expedition"} • Dedicated Chauffeur`,
      operator: mainLimo.operator || "Asia Transport Vietnam (+84 902 035 595)",
      pickup: "Da Nang, Hoi An, Hanoi Old Quarter, Ninh Binh & Halong Bay",
      drop: "Door-to-door Private Transfer",
      seats: "9 VIP Leather Massage Captain Chairs (5 Pax + Luggage)",
      price: "Confirmed Private Limousine",
      primaryUrl: "https://asiatransport.net",
      primaryLabel: "Asia Transport VIP Portal",
      pnrPlaceholder: "DCAR-VN-VIP",
      querySummary: "9-Seater DCar VIP Fleet • All intercity and airport transfers"
    });
  }

  return generated;
}

export default function BookingDesk({ trip, isOpen = false, onClose = null, asTab = false, onSaveTrip = null }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [bookingsState, setBookingsState] = useState({});
  const [uploading, setUploading] = useState(false);

  // Isolate trip identity strictly
  const tripId = trip?.id || "unspecified-trip";
  const storageKey = `travel_architect_bookings_${tripId}`;

  // Tickets state strictly initialized from active trip
  const [tickets, setTickets] = useState(trip?.tickets || []);

  // Quick bookings derived solely from the active trip
  const defaultBookings = getQuickBookingsForTrip(trip);

  // Sync state whenever the active trip changes (no cross-contamination!)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setBookingsState(JSON.parse(saved));
      } else {
        setBookingsState({});
      }
    } catch (e) {
      console.warn("Could not load bookings state", e);
      setBookingsState({});
    }

    setTickets(trip?.tickets || []);
  }, [storageKey, trip]);

  // Save state
  const updateBooking = (id, field, value) => {
    setBookingsState((prev) => {
      const next = {
        ...prev,
        [id]: {
          ...(prev[id] || {}),
          [field]: value
        }
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const copyToClipboard = (text, key, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
      setToastMessage("");
    }, 2500);
  };

  // Export full calendar schedule as .ics file
  const exportCalendarIcs = () => {
    if (defaultBookings.length === 0) {
      setToastMessage("No booking events to export for this trip.");
      setTimeout(() => setToastMessage(""), 2500);
      return;
    }

    const calendarEvents = defaultBookings.map((b, idx) => {
      const stateObj = bookingsState[b.id] || {};
      const uid = `${b.id || idx}-${tripId}@travelarchitect`;
      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        "DTSTAMP:20261001T000000Z",
        `SUMMARY:${b.title}`,
        `DESCRIPTION:${b.querySummary || b.title} - Confirmation: ${stateObj.pnr || b.pnrPlaceholder || "Confirmed"}`,
        `LOCATION:${b.drop || b.pickup || trip?.destination || "Destination"}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      ].join("\r\n");
    });

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//Travel Architect//${tripId}//EN`,
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${trip?.title || "Expedition"} Schedule`,
      ...calendarEvents,
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${tripId}_Schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage("Calendar (.ics) downloaded! Ready to import into Google / Apple Calendar.");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large (max 50MB).");
      return;
    }

    setUploading(true);
    setToastMessage(`Uploading ${file.name}...`);

    try {
      const uploadedDoc = await uploadTicketPdf(tripId, file);
      const nextTickets = [uploadedDoc, ...tickets];
      setTickets(nextTickets);

      if (onSaveTrip) {
        onSaveTrip({
          ...trip,
          tickets: nextTickets
        });
      }

      setToastMessage(`Uploaded ${file.name} successfully!`);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteTicket = async (ticket) => {
    if (!window.confirm(`Delete ticket "${ticket.title || ticket.name}"?`)) return;

    try {
      if (ticket.path && ticket.source === "supabase") {
        await deleteTicketPdf(ticket.path);
      }
      const nextTickets = tickets.filter((t) => t.id !== ticket.id);
      setTickets(nextTickets);
      if (onSaveTrip) {
        onSaveTrip({
          ...trip,
          tickets: nextTickets
        });
      }
      setToastMessage("Ticket removed.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Master copy of all passenger details
  const copyMasterPassengerDetails = () => {
    const lines = [
      "📋 EXPEDITION BOOKING & PASSENGER DOSSIER",
      "=========================================",
      `Destination: ${trip?.title || trip?.destination || "Expedition"}`,
      `Dates: ${trip?.dates || "2026"}`,
      `Travelers: ${trip?.travelersList?.map((t) => t.name).join(", ") || trip?.travelers || "Confirmed Travelers"}`,
      `Origin: ${trip?.origin || (trip?.category === "international" ? "Delhi (DEL) / Bengaluru (BLR)" : "Bengaluru")}`,
      "",
      "CONFIRMED & ACTIONABLE RESERVATIONS:"
    ];

    if (defaultBookings.length === 0) {
      lines.push("No active reservations configured for this trip yet.");
    } else {
      defaultBookings.forEach((b, idx) => {
        const stateObj = bookingsState[b.id] || {};
        lines.push(`${idx + 1}. ${b.title}:`);
        lines.push(`   • Details: ${b.date || "Scheduled"}`);
        lines.push(`   • Provider: ${b.operator || b.pickup || ""}`);
        lines.push(`   • Seats / Spec: ${b.seats || ""}`);
        lines.push(`   • PNR / Confirmation: ${stateObj.pnr || b.pnrPlaceholder || "Confirmed"}`);
        lines.push(`   • Status: ${stateObj.isBooked ? "BOOKED / CONFIRMED" : "ACTIONABLE"}`);
        lines.push("");
      });
    }

    const text = lines.join("\n");
    copyToClipboard(text, "master-dossier", "Complete Passenger & Booking Dossier");
  };

  const bookedCount = defaultBookings.filter((b) => bookingsState[b.id]?.isBooked).length;
  const progressPercent = defaultBookings.length > 0 ? Math.round((bookedCount / defaultBookings.length) * 100) : 0;

  const content = (
    <div className="space-y-5">
      {/* Top Banner & Progress Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-800/60 rounded-3xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                Actionable Booking Command Desk
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                {bookedCount}/{defaultBookings.length} Confirmed
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {trip?.destination ? `${trip.destination.split(',')[0]} Expedition Direct Booking Hub` : `${trip?.title || "Expedition"} Booking Hub`}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified direct booking links, confirmed PNRs, and reservation command cards.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyMasterPassengerDetails}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
              title="Copy all passenger names, dates, and route details"
            >
              {copiedKey === "master-dossier" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Passenger Dossier</span>
            </button>

            <button
              onClick={exportCalendarIcs}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
              title="Download .ics schedule for Google / Apple Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Export .ICS Calendar</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 pt-1">
          <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
            <span className="text-slate-300 text-[11px]">Booking Readiness Status</span>
            <span className="text-emerald-400 font-mono">{progressPercent}% Ready</span>
          </div>
          <div className="w-full bg-slate-900/80 rounded-full h-2.5 border border-emerald-900/80 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 📁 E-Tickets & PDF Document Vault Section */}
      <div className="bg-slate-900/90 dark:bg-darkcard border border-slate-700/80 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">E-Tickets & PDF Document Vault</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {tickets.length} Documents
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload & store flight boarding passes, cruise vouchers & e-visas with Supabase cloud backup & offline access.
              </p>
            </div>
          </div>

          <div>
            <label className={"px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95 " + (uploading ? "opacity-50 pointer-events-none" : "")}>
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? "Uploading..." : "Upload PDF Ticket"}</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tickets.length === 0 ? (
            <div className="col-span-full p-6 text-center text-slate-500 italic text-xs bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
              No tickets uploaded yet. Tap "Upload PDF Ticket" above to attach your boarding passes or booking vouchers!
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition group">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/80">
                      {t.category || "E-Ticket"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {t.size ? `${Math.round(t.size / 1024)} KB` : "Document"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1" title={t.title || t.name}>
                    {t.title || t.name}
                  </h4>
                  {t.bookingRef && (
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                      PNR / Ref: <span className="font-bold">{t.bookingRef}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1 px-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 text-[11px] font-bold border border-blue-800 flex items-center justify-center gap-1 transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </a>
                  <a
                    href={t.url}
                    download={t.name || "ticket.pdf"}
                    className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 flex items-center justify-center gap-1 transition"
                    title="Download to device"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => handleDeleteTicket(t)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-950/50 transition cursor-pointer"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* List of Actionable Booking Cards */}
      {defaultBookings.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-2">
          <Ticket className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Actionable Bookings Configured Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            This trip does not have direct booking cards configured. You can upload flight passes, cruise vouchers, or hotel confirmations to your E-Tickets vault above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {defaultBookings.map((item, idx) => {
            const isBooked = bookingsState[item.id]?.isBooked || false;
            const savedPnr = bookingsState[item.id]?.pnr || "";

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-sm ${
                  isBooked
                    ? "bg-emerald-950/20 dark:bg-emerald-950/20 border-emerald-500/40"
                    : "bg-white dark:bg-darkcard border-slate-200 dark:border-darkborder hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      item.category === "stay"
                        ? "bg-blue-500/15 text-blue-500 dark:text-blue-400"
                        : item.category === "tours"
                        ? "bg-amber-500/15 text-amber-500 dark:text-amber-400"
                        : "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400"
                    }`}>
                      {item.icon === "hotel" ? <Hotel className="w-5 h-5" /> : item.icon === "ticket" ? <Ticket className="w-5 h-5" /> : item.icon === "car" ? <Car className="w-5 h-5" /> : item.icon === "plane" ? <Plane className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                    </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                        Step {idx + 1} • {item.operator}
                      </span>
                      {isBooked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Booked & Confirmed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Booking Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                    {item.price}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block">
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Exact Pre-filled Parameters Badge */}
              <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-bold text-[11px]">Pre-filled Search Parameters:</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.querySummary, `query-${item.id}`, "Search Parameters")}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 p-1"
                    title="Copy search query string"
                  >
                    {copiedKey === `query-${item.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Query</span>
                  </button>
                </div>
                <div className="bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 select-all">
                  {item.querySummary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pickup / Station:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{item.pickup}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Seats / Accommodation:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{item.seats}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Primary Official + Instant Pre-filled + Alternative */}
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                {item.primaryUrl && (
                  <a
                    href={item.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <span>{item.primaryLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {item.altUrl && (
                  <a
                    href={item.altUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <span>{item.altLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {item.thirdUrl && (
                  <a
                    href={item.thirdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all"
                  >
                    <span>{item.thirdLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Booking Confirmation / PNR Tracker */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBooked}
                    onChange={(e) => updateBooking(item.id, "isBooked", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <span className={`font-bold text-[11px] ${isBooked ? "text-emerald-500" : "text-slate-600 dark:text-slate-400"}`}>
                    Mark as Booked
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">PNR / Voucher:</span>
                  <input
                    type="text"
                    value={savedPnr}
                    placeholder={item.pnrPlaceholder || "e.g. KT-7821"}
                    onChange={(e) => updateBooking(item.id, "pnr", e.target.value)}
                    className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 w-36 sm:w-44 focus:outline-hidden focus:border-emerald-500"
                  />
                  {savedPnr && (
                    <button
                      onClick={() => copyToClipboard(savedPnr, `pnr-${item.id}`, "PNR")}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy PNR"
                    >
                      {copiedKey === `pnr-${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

  // If rendered as a standalone tab view
  if (asTab) {
    return <div className="max-w-5xl mx-auto py-2">{content}</div>;
  }

  // If rendered as a modal
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-darkbg text-slate-900 dark:text-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-darkborder max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-darkborder">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Trip Booking Desk
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition"
            >
              ✕
            </button>
          )}
        </div>
        {content}
      </div>
    </div>
  );
}

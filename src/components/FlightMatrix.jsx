import React, { useState } from "react";
import {
  Plane, Copy, Check, Clock, AlertTriangle, PenSquare,
  RotateCcw, X, Plus, ArrowRight, ShieldCheck, Info
} from "lucide-react";

export default function FlightMatrix({ flights = [], onSaveFlights, tripId }) {
  const [copiedPnr, setCopiedPnr] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlightKey, setSelectedFlightKey] = useState("");
  const [flightModeConnecting, setFlightModeConnecting] = useState(true);

  const [form, setForm] = useState({
    sector: "",
    passengers: "",
    pax: "",
    isConnecting: true,
    airline: "",
    flightNo: "",
    pnr: "",
    dept: "",
    arr: "",
    totalDuration: "",
    notes: "",
    from: "",
    to: "",
    leg1From: "",
    leg1To: "",
    leg1Airline: "",
    leg1FlightNo: "",
    leg1Dept: "",
    leg1Arr: "",
    layoverAirport: "",
    layoverDuration: "",
    layoverNote: "",
    leg2From: "",
    leg2To: "",
    leg2Airline: "",
    leg2FlightNo: "",
    leg2Dept: "",
    leg2Arr: ""
  });

  const copyPnr = (pnr) => {
    if (!pnr) return;
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  const openEditModal = (flightOrKey) => {
    const target = typeof flightOrKey === "string"
      ? flights.find((f) => (f.key || f.sector) === flightOrKey) || flights[0]
      : flightOrKey;

    if (!target) return;

    const key = target.key || target.sector;
    setSelectedFlightKey(key);
    const isConn = target.isConnecting === true;
    setFlightModeConnecting(isConn);

    const leg1 = target.leg1 || {};
    const layover = target.layover || {};
    const leg2 = target.leg2 || {};

    setForm({
      sector: target.sector || "",
      passengers: target.passengers || target.pax || "",
      pax: target.pax || target.passengers || "",
      isConnecting: isConn,
      airline: target.airline || "",
      flightNo: target.flightNo || "",
      pnr: target.pnr || "",
      dept: target.dept || (typeof leg1 === "object" ? leg1.dept : "") || "",
      arr: target.arr || (typeof leg2 === "object" ? leg2.arr : "") || "",
      totalDuration: target.totalDuration || "",
      notes: target.notes || "",
      from: target.from || (typeof leg1 === "object" ? leg1.from : "") || "",
      to: target.to || (typeof leg2 === "object" ? leg2.to : (typeof target.to === "string" ? target.to : "")) || "",
      leg1From: (typeof leg1 === "object" ? leg1.from : "") || "",
      leg1To: (typeof leg1 === "object" ? leg1.to : "") || "",
      leg1Airline: (typeof leg1 === "object" ? leg1.airline : "") || "",
      leg1FlightNo: (typeof leg1 === "object" ? leg1.flightNo : "") || "",
      leg1Dept: (typeof leg1 === "object" ? leg1.dept : "") || "",
      leg1Arr: (typeof leg1 === "object" ? leg1.arr : "") || "",
      layoverAirport: (typeof layover === "object" ? (layover.airport || layover.city) : "") || (typeof layover === "string" ? layover : ""),
      layoverDuration: (typeof layover === "object" ? layover.duration : "") || "",
      layoverNote: (typeof layover === "object" ? layover.note : "") || "",
      leg2From: (typeof leg2 === "object" ? leg2.from : "") || "",
      leg2To: (typeof leg2 === "object" ? leg2.to : "") || "",
      leg2Airline: (typeof leg2 === "object" ? leg2.airline : "") || "",
      leg2FlightNo: (typeof leg2 === "object" ? leg2.flightNo : "") || "",
      leg2Dept: (typeof leg2 === "object" ? leg2.dept : "") || "",
      leg2Arr: (typeof leg2 === "object" ? leg2.arr : "") || ""
    });

    setIsEditModalOpen(true);
  };

  const handleSectorChange = (key) => {
    setSelectedFlightKey(key);
    const target = flights.find((f) => (f.key || f.sector) === key);
    if (!target) return;

    const isConn = target.isConnecting === true;
    setFlightModeConnecting(isConn);
    const leg1 = target.leg1 || {};
    const layover = target.layover || {};
    const leg2 = target.leg2 || {};

    setForm({
      sector: target.sector || "",
      passengers: target.passengers || target.pax || "",
      pax: target.pax || target.passengers || "",
      isConnecting: isConn,
      airline: target.airline || "",
      flightNo: target.flightNo || "",
      pnr: target.pnr || "",
      dept: target.dept || (typeof leg1 === "object" ? leg1.dept : "") || "",
      arr: target.arr || (typeof leg2 === "object" ? leg2.arr : "") || "",
      totalDuration: target.totalDuration || "",
      notes: target.notes || "",
      from: target.from || (typeof leg1 === "object" ? leg1.from : "") || "",
      to: target.to || (typeof leg2 === "object" ? leg2.to : "") || "",
      leg1From: (typeof leg1 === "object" ? leg1.from : "") || "",
      leg1To: (typeof leg1 === "object" ? leg1.to : "") || "",
      leg1Airline: (typeof leg1 === "object" ? leg1.airline : "") || "",
      leg1FlightNo: (typeof leg1 === "object" ? leg1.flightNo : "") || "",
      leg1Dept: (typeof leg1 === "object" ? leg1.dept : "") || "",
      leg1Arr: (typeof leg1 === "object" ? leg1.arr : "") || "",
      layoverAirport: (typeof layover === "object" ? (layover.airport || layover.city) : "") || (typeof layover === "string" ? layover : ""),
      layoverDuration: (typeof layover === "object" ? layover.duration : "") || "",
      layoverNote: (typeof layover === "object" ? layover.note : "") || "",
      leg2From: (typeof leg2 === "object" ? leg2.from : "") || "",
      leg2To: (typeof leg2 === "object" ? leg2.to : "") || "",
      leg2Airline: (typeof leg2 === "object" ? leg2.airline : "") || "",
      leg2FlightNo: (typeof leg2 === "object" ? leg2.flightNo : "") || "",
      leg2Dept: (typeof leg2 === "object" ? leg2.dept : "") || "",
      leg2Arr: (typeof leg2 === "object" ? leg2.arr : "") || ""
    });
  };

  const handleSaveFlight = (e) => {
    e.preventDefault();
    const isConn = flightModeConnecting;

    const nextFlights = flights.map((f) => {
      const fKey = f.key || f.sector;
      if (fKey !== selectedFlightKey) return f;

      if (isConn) {
        const leg1Obj = {
          from: form.leg1From || f.from || "",
          to: form.leg1To || "",
          airline: form.leg1Airline || "",
          flightNo: form.leg1FlightNo || "",
          dept: form.leg1Dept || "",
          arr: form.leg1Arr || ""
        };
        const layoverObj = {
          airport: form.layoverAirport || "",
          city: form.layoverAirport || "",
          duration: form.layoverDuration || "",
          note: form.layoverNote || ""
        };
        const leg2Obj = {
          from: form.leg2From || "",
          to: form.leg2To || f.to || "",
          airline: form.leg2Airline || "",
          flightNo: form.leg2FlightNo || "",
          dept: form.leg2Dept || "",
          arr: form.leg2Arr || ""
        };

        const combinedAirline = form.leg1Airline === form.leg2Airline
          ? form.leg1Airline
          : (form.leg1Airline && form.leg2Airline ? (form.leg1Airline + " + " + form.leg2Airline) : (form.leg1Airline || form.leg2Airline || f.airline));

        const combinedFlightNo = form.leg1FlightNo && form.leg2FlightNo
          ? (form.leg1FlightNo + " ➔ " + form.leg2FlightNo)
          : (form.leg1FlightNo || form.leg2FlightNo || f.flightNo);

        return {
          ...f,
          isConnecting: true,
          airline: combinedAirline,
          flightNo: combinedFlightNo,
          pnr: form.pnr,
          dept: form.leg1Dept || f.dept,
          arr: form.leg2Arr || f.arr,
          totalDuration: form.totalDuration || f.totalDuration,
          notes: form.notes || f.notes,
          from: form.leg1From || f.from,
          to: form.leg2To || f.to,
          leg1: leg1Obj,
          layover: layoverObj,
          leg2: leg2Obj
        };
      } else {
        return {
          ...f,
          isConnecting: false,
          airline: form.airline || f.airline,
          flightNo: form.flightNo || f.flightNo,
          from: form.from || f.from,
          to: form.to || f.to,
          pnr: form.pnr,
          dept: form.dept || f.dept,
          arr: form.arr || f.arr,
          totalDuration: form.totalDuration || f.totalDuration,
          notes: form.notes || f.notes,
          leg1: null,
          layover: null,
          leg2: null
        };
      }
    });

    if (onSaveFlights) {
      onSaveFlights(nextFlights);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar with Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-darkborder">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Connecting Flight Matrix & PNRs</h4>
            <p className="text-[11px] text-slate-400">Multi-origin routing with layover hub protection</p>
          </div>
        </div>

        <button
          onClick={() => openEditModal(flights[0] || {})}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <PenSquare className="w-3.5 h-3.5" />
          Edit Flight Matrix
        </button>
      </div>

      {/* Flight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flights.map((f, idx) => {
          const key = f.key || f.sector;
          const isConn = f.isConnecting === true;
          const leg1 = f.leg1;
          const layover = f.layover;
          const leg2 = f.leg2;

          return (
            <div
              key={key || idx}
              className="bg-white dark:bg-darkcard p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-darkborder space-y-3 hover:border-indigo-500/40 shadow-sm transition-all"
            >
              {/* Card Header with Sector, Pax, and Edit Button */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkborder pb-2.5">
                <div>
                  <span className="font-extrabold text-xs sm:text-sm text-indigo-600 dark:text-indigo-300 block font-bold">{f.sector}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      {f.passengers || f.pax || "Travelers"}
                    </span>
                    {f.totalDuration && (
                      <span className="text-[10px] font-mono text-slate-400">
                        • {f.totalDuration}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(f)}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700/80 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <PenSquare className="w-3 h-3" />
                  Edit Flight
                </button>
              </div>

              {/* Legs Section */}
              <div className="space-y-2 text-xs">
                {isConn && leg1 ? (
                  <>
                    {/* Leg 1 */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        <span>Leg 1 Departure</span>
                        {typeof leg1 === "object" && leg1.flightNo && (
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{leg1.airline} • {leg1.flightNo}</span>
                        )}
                      </div>
                      {typeof leg1 === "string" ? (
                        <p className="text-slate-800 dark:text-slate-200">{leg1}</p>
                      ) : (
                        <div className="text-slate-800 dark:text-slate-200 leading-snug">
                          <strong>{leg1.from}</strong> ➔ <strong>{leg1.to}</strong>
                          {(leg1.dept || leg1.arr) && (
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              🛫 {leg1.dept} ➔ 🛬 {leg1.arr}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Layover Alert */}
                    {layover && (
                      <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-500/30 flex items-start gap-2 text-amber-900 dark:text-amber-300 text-[11px]">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <strong>
                            Layover: {typeof layover === "string" ? layover : `${layover.airport || layover.city || "Transit"} • ${layover.duration || ""}`}
                          </strong>
                          {typeof layover === "object" && layover.note && (
                            <p className="text-[10px] text-amber-800 dark:text-amber-200/80 mt-0.5">{layover.note}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Leg 2 */}
                    {leg2 && (
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <span>Leg 2 Final Sector</span>
                          {typeof leg2 === "object" && leg2.flightNo && (
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{leg2.airline} • {leg2.flightNo}</span>
                          )}
                        </div>
                        {typeof leg2 === "string" ? (
                          <p className="text-slate-800 dark:text-slate-200">{leg2}</p>
                        ) : (
                          <div className="text-slate-800 dark:text-slate-200 leading-snug">
                            <strong>{leg2.from}</strong> ➔ <strong>{leg2.to}</strong>
                            {(leg2.dept || leg2.arr) && (
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                🛫 {leg2.dept} ➔ 🛬 {leg2.arr}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Direct Flight */
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>Direct Non-Stop Flight</span>
                      <span className="font-mono font-bold text-indigo-400">{f.airline} • {f.flightNo}</span>
                    </div>
                    <div className="text-slate-900 dark:text-white font-bold">
                      {f.from || f.route?.split("➔")[0]?.trim()} ➔ {f.to || f.route?.split("➔")[1]?.trim()}
                    </div>
                    {(f.dept || f.arr) && (
                      <div className="text-[11px] font-mono text-slate-400">
                        🛫 Dept: {f.dept} • 🛬 Arr: {f.arr}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {f.notes && (
                  <p className="text-[10px] text-slate-400 italic px-1">
                    ℹ️ {f.notes}
                  </p>
                )}
              </div>

              {/* PNR and Copy */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-darkborder text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Booking PNR:</span>
                  <strong className="font-mono text-emerald-700 dark:text-emerald-400 font-black text-xs sm:text-sm">
                    {f.pnr || "CONFIRMED"}
                  </strong>
                </div>
                {f.pnr && (
                  <button
                    onClick={() => copyPnr(f.pnr)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-1 transition-all"
                  >
                    {copiedPnr === f.pnr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedPnr === f.pnr ? "Copied!" : "Copy PNR"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT FLIGHT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-darkborder pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-indigo-400" />
                Edit Flight Matrix & Schedule
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="space-y-3.5 text-xs">
              {/* Sector Selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Sector to Edit:</label>
                <select
                  value={selectedFlightKey}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs outline-none focus:border-indigo-500"
                >
                  {flights.map((f, i) => (
                    <option key={f.key || f.sector || i} value={f.key || f.sector}>
                      {f.sector}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Toggle: Connecting vs Direct */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Flight Type:</label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFlightModeConnecting(false)}
                    className={"py-1.5 rounded-lg text-center font-bold text-xs transition-all " + (
                      !flightModeConnecting
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Direct Flight (1 Leg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlightModeConnecting(true)}
                    className={"py-1.5 rounded-lg text-center font-bold text-xs transition-all " + (
                      flightModeConnecting
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Connecting Flight (2 Legs + Layover)
                  </button>
                </div>
              </div>

              {/* Connecting Flight Fields */}
              {flightModeConnecting ? (
                <div className="space-y-3">
                  {/* Leg 1 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-400 block">
                      Leg 1 (Origin to Transit Hub)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="From (e.g. BLR T2)"
                        value={form.leg1From}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1From: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="To (e.g. DMK Bangkok)"
                        value={form.leg1To}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1To: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Airline (e.g. Thai AirAsia)"
                        value={form.leg1Airline}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1Airline: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Flight No (e.g. FD 138)"
                        value={form.leg1FlightNo}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1FlightNo: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-white text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Dept (e.g. 23:10 Dec 3)"
                        value={form.leg1Dept}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1Dept: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Arr (e.g. 04:30 AM Dec 4)"
                        value={form.leg1Arr}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg1Arr: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Layover */}
                  <div className="p-3 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-400 block">
                      Layover / Transit Hub
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Airport (e.g. Bangkok DMK)"
                        value={form.layoverAirport}
                        onChange={(e) => setForm((prev) => ({ ...prev, layoverAirport: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2h 45m)"
                        value={form.layoverDuration}
                        onChange={(e) => setForm((prev) => ({ ...prev, layoverDuration: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-white text-xs outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Transit Note (e.g. Baggage through-checked / Wheelchair)"
                      value={form.layoverNote}
                      onChange={(e) => setForm((prev) => ({ ...prev, layoverNote: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 text-xs outline-none"
                    />
                  </div>

                  {/* Leg 2 */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-black uppercase text-indigo-400 block">
                      Leg 2 (Transit Hub to Destination)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="From (e.g. DMK Bangkok)"
                        value={form.leg2From}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2From: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="To (e.g. HAN Hanoi T2)"
                        value={form.leg2To}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2To: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Airline (e.g. Thai AirAsia)"
                        value={form.leg2Airline}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2Airline: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Flight No (e.g. FD 642)"
                        value={form.leg2FlightNo}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2FlightNo: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-white text-xs outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Dept (e.g. 07:15 AM Dec 4)"
                        value={form.leg2Dept}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2Dept: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Arr (e.g. 08:45 AM Dec 4)"
                        value={form.leg2Arr}
                        onChange={(e) => setForm((prev) => ({ ...prev, leg2Arr: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Direct Flight Fields */
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-400 block">
                    Direct Flight Details
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="From (e.g. HAN Noi Bai T1)"
                      value={form.from}
                      onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="To (e.g. DAD Da Nang)"
                      value={form.to}
                      onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Airline (e.g. Vietnam Airlines)"
                      value={form.airline}
                      onChange={(e) => setForm((prev) => ({ ...prev, airline: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Flight No (e.g. VN 171)"
                      value={form.flightNo}
                      onChange={(e) => setForm((prev) => ({ ...prev, flightNo: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono font-bold text-white text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Departure (e.g. 14:30 Dec 6)"
                      value={form.dept}
                      onChange={(e) => setForm((prev) => ({ ...prev, dept: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Arrival (e.g. 15:50 Dec 6)"
                      value={form.arr}
                      onChange={(e) => setForm((prev) => ({ ...prev, arr: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-slate-300 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Shared Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Booking Ref / PNR:</label>
                  <input
                    type="text"
                    placeholder="e.g. VN-DEL-784"
                    value={form.pnr}
                    onChange={(e) => setForm((prev) => ({ ...prev, pnr: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono font-bold text-emerald-400 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g. 7h 30m"
                    value={form.totalDuration}
                    onChange={(e) => setForm((prev) => ({ ...prev, totalDuration: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Terminal & Baggage Notes:</label>
                <input
                  type="text"
                  placeholder="e.g. Baggage through-checked / Wheelchair requested"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

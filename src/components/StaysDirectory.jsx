import React, { useState } from "react";
import {
  Building, MapPin, Phone, Copy, Check, Calendar,
  ShieldCheck, PenSquare, X, Plus
} from "lucide-react";

export default function StaysDirectory({ stays, hotels, onSaveHotels, tripId }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");

  const [form, setForm] = useState({
    name: "",
    city: "",
    dates: "",
    room: "",
    address: "",
    addressVi: "",
    phone: "",
    pnr: "",
    voucher: ""
  });

  // Normalize stays to object map and array
  const hotelsSource = hotels || stays || {};
  const staysList = Object.keys(hotelsSource).map((k) => ({
    key: k,
    ...hotelsSource[k]
  }));

  if (staysList.length === 0) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center text-slate-500 dark:text-slate-400 text-xs">
        No hotel or stay vouchers configured for this expedition.
      </div>
    );
  }

  const copyVoucher = (voucher, key) => {
    if (!voucher) return;
    navigator.clipboard.writeText(voucher);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openEditModal = (stay) => {
    const key = stay.key || Object.keys(hotelsSource)[0];
    setSelectedKey(key);
    const target = hotelsSource[key] || {};
    setForm({
      name: target.name || "",
      city: target.city || "",
      dates: target.dates || "",
      room: target.room || "",
      address: target.address || target.addressVi || "",
      addressVi: target.addressVi || target.address || "",
      phone: target.phone || "",
      pnr: target.pnr || target.voucher || "",
      voucher: target.voucher || target.pnr || ""
    });
    setIsEditModalOpen(true);
  };

  const handleKeySelect = (key) => {
    setSelectedKey(key);
    const target = hotelsSource[key] || {};
    setForm({
      name: target.name || "",
      city: target.city || "",
      dates: target.dates || "",
      room: target.room || "",
      address: target.address || target.addressVi || "",
      addressVi: target.addressVi || target.address || "",
      phone: target.phone || "",
      pnr: target.pnr || target.voucher || "",
      voucher: target.voucher || target.pnr || ""
    });
  };

  const handleSaveStay = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const nextHotels = { ...hotelsSource };
    nextHotels[selectedKey] = {
      ...(nextHotels[selectedKey] || {}),
      name: form.name.trim(),
      city: form.city.trim(),
      dates: form.dates.trim(),
      room: form.room.trim(),
      address: form.address.trim(),
      addressVi: form.addressVi.trim() || form.address.trim(),
      phone: form.phone.trim(),
      pnr: form.pnr.trim(),
      voucher: form.pnr.trim()
    };

    if (onSaveHotels) {
      onSaveHotels(nextHotels);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-darkborder">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Stays & Basecamp Vouchers</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Confirmed booking vouchers, check-in policies & cloakrooms</p>
          </div>
        </div>

        <button
          onClick={() => openEditModal(staysList[0])}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <PenSquare className="w-3.5 h-3.5" />
          Edit Stay Details
        </button>
      </div>

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staysList.map((stay) => (
          <div
            key={stay.key}
            className="bg-white dark:bg-darkcard p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-darkborder space-y-3 hover:border-blue-500/40 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkborder pb-2.5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block font-mono">
                  {stay.city || "Basecamp Stay"}
                </span>
                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">{stay.name}</h5>
              </div>
              <div className="flex items-center gap-1.5">
                {stay.dates && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-500 dark:text-slate-400">
                    {stay.dates}
                  </span>
                )}
                <button
                  onClick={() => openEditModal(stay)}
                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700/80 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  title="Edit stay details"
                >
                  <PenSquare className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </div>

            {/* Voucher & Phone */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Booking PNR / Ref</span>
                  <strong className="font-mono text-emerald-400 text-[11px] font-black">
                    {stay.pnr || stay.voucher || "CONFIRMED"}
                  </strong>
                </div>
                {(stay.pnr || stay.voucher) && (
                  <button
                    onClick={() => copyVoucher(stay.pnr || stay.voucher, stay.key)}
                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                    title="Copy PNR"
                  >
                    {copiedKey === stay.key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Front Desk & Hotline</span>
                <a
                  href={"tel:" + (stay.phone || "")}
                  className="font-mono text-indigo-400 hover:underline text-[11px] block truncate mt-0.5"
                >
                  {stay.phone || "Call Reception"}
                </a>
              </div>
            </div>

            {/* Address */}
            {(stay.address || stay.addressVi) && (
              <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  {stay.addressVi || stay.address}
                </span>
              </div>
            )}

            {/* Room configuration & Notes */}
            {(stay.room || stay.checkIn || stay.note || stay.cloakroom) && (
              <div className="space-y-1 text-[11px] bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {stay.room && (
                  <div className="text-slate-700 dark:text-slate-300">
                    <strong className="text-indigo-300 font-semibold">Room:</strong> {stay.room}
                  </div>
                )}
                {stay.checkIn && (
                  <div className="text-slate-500 dark:text-slate-400">
                    Check-in: <strong className="text-slate-800 dark:text-slate-200">{stay.checkIn}</strong>
                    {stay.checkOut && <> • Check-out: <strong className="text-slate-800 dark:text-slate-200">{stay.checkOut}</strong></>}
                  </div>
                )}
                {(stay.cloakroom || stay.note) && (
                  <p className="text-amber-300/90 pt-0.5 text-[10px]">
                    ℹ️ {stay.cloakroom || stay.note}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* EDIT HOTEL MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder text-slate-900 dark:text-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-darkborder pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                Edit Stay Details & Address
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStay} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Select Hotel / Destination:</label>
                <select
                  value={selectedKey}
                  onChange={(e) => handleKeySelect(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500"
                >
                  {staysList.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.city ? `${s.city} - ${s.name}` : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Hotel Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. La Siesta Classic Ma May"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Vietnamese Address (for Grab / Taxi Driver):</label>
                <input
                  type="text"
                  placeholder="e.g. 94 Mã Mây, Phường Hàng Buồm, Quận Hoàn Kiếm, Hà Nội"
                  value={form.addressVi}
                  onChange={(e) => setForm((prev) => ({ ...prev, addressVi: e.target.value, address: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Phone / Hotline:</label>
                  <input
                    type="text"
                    placeholder="e.g. +84 24 3926 3641"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Booking Ref / PNR:</label>
                  <input
                    type="text"
                    placeholder="e.g. BOOK-HANOI-101"
                    value={form.pnr}
                    onChange={(e) => setForm((prev) => ({ ...prev, pnr: e.target.value, voucher: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Room Notes & Instructions:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 1 Deluxe Double + 1 Family Suite. Connecting rooms requested."
                  value={form.room}
                  onChange={(e) => setForm((prev) => ({ ...prev, room: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-200 text-xs outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

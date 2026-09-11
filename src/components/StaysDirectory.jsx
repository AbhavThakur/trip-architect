import React, { useState } from "react";
import { Building, MapPin, Phone, Copy, Check, Calendar, ShieldCheck } from "lucide-react";

export default function StaysDirectory({ stays, hotels }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const staysList = hotels
    ? Object.keys(hotels).map((k) => ({ key: k, ...hotels[k] }))
    : stays
    ? Object.keys(stays).map((k) => ({ key: k, ...stays[k] }))
    : [];

  if (staysList.length === 0) {
    return (
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
        No hotel or stay vouchers configured for this expedition.
      </div>
    );
  }

  const copyVoucher = (voucher, key) => {
    navigator.clipboard.writeText(voucher);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Stays & Basecamp Vouchers</h4>
            <p className="text-[11px] text-slate-400">Confirmed booking vouchers, check-in policies & cloakrooms</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staysList.map((stay) => (
          <div
            key={stay.key}
            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block font-mono">
                  {stay.city || "Basecamp Stay"}
                </span>
                <h5 className="text-xs sm:text-sm font-black text-white mt-0.5">{stay.name}</h5>
              </div>
              {stay.dates && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  {stay.dates}
                </span>
              )}
            </div>

            {/* Voucher & Phone */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Voucher Code</span>
                  <strong className="font-mono text-emerald-400 text-[11px]">{stay.voucher || "CONFIRMED"}</strong>
                </div>
                {stay.voucher && (
                  <button
                    onClick={() => copyVoucher(stay.voucher, stay.key)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === stay.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Phone & Front Desk</span>
                <a
                  href={"tel:" + stay.phone}
                  className="font-mono text-indigo-400 hover:underline text-[11px] block truncate"
                >
                  {stay.phone || "Call Reception"}
                </a>
              </div>
            </div>

            {/* Address */}
            {stay.address && (
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 flex items-start gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-[11px] leading-relaxed">{stay.address}</span>
              </div>
            )}

            {/* Timings & Cloakroom Note */}
            {(stay.checkIn || stay.note || stay.cloakroom) && (
              <div className="space-y-1 text-[11px] bg-slate-900/40 p-2.5 rounded-xl border border-slate-850">
                {stay.checkIn && (
                  <div className="text-slate-400">
                    Check-in: <strong className="text-slate-200">{stay.checkIn}</strong>
                    {stay.checkOut && <> • Check-out: <strong className="text-slate-200">{stay.checkOut}</strong></>}
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
    </div>
  );
}

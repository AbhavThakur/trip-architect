import React, { useState } from 'react';
import { Plane, Copy, Check, Clock, AlertTriangle } from 'lucide-react';

export default function FlightMatrix({ flights = [] }) {
  const [copiedPnr, setCopiedPnr] = useState(null);

  const copyPnr = (pnr) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  if (!flights || flights.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Connecting Flight Matrix</h4>
            <p className="text-[11px] text-slate-400">Multi-origin routing with layover hub protection</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flights.map((f, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="font-extrabold text-xs text-indigo-300">{f.sector}</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">{f.pax}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Leg 1 Departure</span>
                <p className="text-slate-200 mt-0.5">{f.leg1}</p>
              </div>

              {f.layover && (
                <div className="bg-amber-950/30 p-2 rounded-xl border border-amber-500/30 flex items-center gap-2 text-amber-300 text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Layover: {f.layover}</span>
                </div>
              )}

              {f.leg2 && (
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Leg 2 Final Sector</span>
                  <p className="text-slate-200 mt-0.5">{f.leg2}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">PNR:</span>
                <strong className="font-mono text-emerald-400">{f.pnr}</strong>
              </div>
              <button
                onClick={() => copyPnr(f.pnr)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-slate-800 flex items-center gap-1"
              >
                {copiedPnr === f.pnr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedPnr === f.pnr ? 'Copied' : 'Copy PNR'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

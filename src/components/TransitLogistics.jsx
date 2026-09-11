import React, { useState } from 'react';
import { Bus, Train, Car, Navigation, Copy, Check } from 'lucide-react';

export default function TransitLogistics({ transit }) {
  const [copiedPnr, setCopiedPnr] = useState(null);

  if (!transit) return null;
  const { outbound, returnTrip } = transit;

  const copyPnr = (pnr) => {
    navigator.clipboard.writeText(pnr);
    setCopiedPnr(pnr);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  const renderLeg = (leg, label, color) => {
    if (!leg) return null;
    return (
      <div className={`bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 hover:border-${color}-500/40 transition-all`}>
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-${color}-500/20 text-${color}-400 flex items-center justify-center`}>
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider text-${color}-400 block`}>{label}</span>
              <h5 className="text-xs font-black text-white">{leg.title}</h5>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{leg.date}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Boarding</span>
            <strong className="text-white text-[11px]">{leg.from}</strong>
            <span className={`font-mono text-${color}-400 block mt-0.5`}>{leg.deptTime}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Arrival</span>
            <strong className="text-white text-[11px]">{leg.to}</strong>
            <span className="font-mono text-amber-400 block mt-0.5">{leg.arrTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Service</span>
            <strong className="text-slate-200 text-[11px] truncate block">{leg.operator}</strong>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">PNR</span>
              <strong className={`text-${color}-400 font-mono text-[11px]`}>{leg.pnr}</strong>
            </div>
            <button onClick={() => copyPnr(leg.pnr)} className="text-slate-400 hover:text-white p-1">
              {copiedPnr === leg.pnr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300">Berths: <strong className="text-amber-300 font-mono">{leg.seats}</strong></span>
          <span className="text-[10px] text-slate-400 font-mono">{leg.duration}</span>
        </div>

        {leg.notes && (
          <p className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 leading-relaxed">
            {leg.notes}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">First & Last-Mile Transit Matrix</h4>
            <p className="text-[11px] text-slate-400">Outbound sleeper, return sleeper, and mountain mobility</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderLeg(outbound, 'Outbound • Going Leg', 'emerald')}
        {renderLeg(returnTrip, 'Return • Homebound Leg', 'indigo')}
      </div>
    </div>
  );
}

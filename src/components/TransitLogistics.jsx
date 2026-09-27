import React, { useState } from 'react';
import { Bus, Train, Car, Navigation, Copy, Check, ExternalLink } from 'lucide-react';

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
      <div className={`bg-white dark:bg-darkcard p-4 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm space-y-3 hover:border-${color}-500/40 transition-all`}>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-${color}-500/20 text-${color}-400 flex items-center justify-center`}>
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider text-${color}-400 block`}>{label}</span>
              <h5 className="text-xs font-black text-slate-900 dark:text-white">{leg.title}</h5>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{leg.date}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Boarding</span>
            <strong className="text-slate-900 dark:text-white text-[11px]">{leg.from}</strong>
            <span className={`font-mono text-${color}-400 block mt-0.5`}>{leg.deptTime}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Arrival</span>
            <strong className="text-slate-900 dark:text-white text-[11px]">{leg.to}</strong>
            <span className="font-mono text-amber-400 block mt-0.5">{leg.arrTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Service</span>
            <strong className="text-slate-800 dark:text-slate-200 text-[11px] truncate block">{leg.operator}</strong>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">PNR</span>
              <strong className={`text-${color}-400 font-mono text-[11px]`}>{leg.pnr}</strong>
            </div>
            <button onClick={() => copyPnr(leg.pnr)} className="text-slate-400 hover:text-white p-1">
              {copiedPnr === leg.pnr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-slate-300">Berths: <strong className="text-amber-300 font-mono">{leg.seats}</strong></span>
          <span className="text-[10px] text-slate-400 font-mono">{leg.duration}</span>
        </div>

        {leg.notes && (
          <p className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
            {leg.notes}
          </p>
        )}

        {leg.bookingParams && (
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                <span>🎯 Pre-filled Search Query</span>
              </span>
              <button
                onClick={() => copyPnr(leg.bookingParams)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                title="Copy query text"
              >
                {copiedPnr === leg.bookingParams ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 select-all">
              {leg.bookingParams}
            </p>
          </div>
        )}

        {(leg.bookingUrl || leg.bookingAltUrl || leg.bookingThirdUrl) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {leg.bookingUrl && (
              <a
                href={leg.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 text-center"
              >
                <span>{leg.bookingLabel || "KSRTC Official Portal"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {leg.bookingAltUrl && (
              <a
                href={leg.bookingAltUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 text-center"
              >
                <span>{leg.bookingAltLabel || "AbhiBus Pre-filled"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {leg.bookingThirdUrl && (
              <a
                href={leg.bookingThirdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all text-center"
              >
                <span>{leg.bookingThirdLabel || "redBus Route"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-darkborder">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">First & Last-Mile Transit Matrix</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Outbound sleeper, return sleeper, and mountain mobility</p>
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

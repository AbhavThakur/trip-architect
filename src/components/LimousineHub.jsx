import React, { useState } from "react";
import { Bus, Share2, Luggage, ShieldCheck, Check, Clock, DollarSign, X } from "lucide-react";

export default function LimousineHub({ limoTransfers = [] }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedLegs, setSelectedLegs] = useState(
    limoTransfers.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
  );

  const toggleLeg = (idx) => {
    setSelectedLegs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const generateWhatsAppQuote = () => {
    let msg = "*Vietnam Master Expedition — Private DCar Limousine Transfer Request*\n";
    msg += "Pass: 5 Adults (Family + 2 Senior Parents)\n";
    msg += "Vehicle: 9-Seater DCar President / Ford Transit VIP (Luggage for 5)\n\n";
    msg += "*Requested Itinerary Legs:*\n";

    limoTransfers.forEach((leg, idx) => {
      if (selectedLegs[idx]) {
        msg += `• ${leg.date}: ${leg.route} (${leg.duration})\n`;
      }
    });

    msg += "\nPlease confirm total all-inclusive quotation (toll, fuel, driver) in VND.";
    const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono border border-emerald-500/30">
            Chauffeur & Mobility
          </span>
          <h3 className="text-lg sm:text-xl font-black font-display text-white mt-1.5">
            9-Seater DCar Limousine VIP Hub
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Pre-negotiated luxury private transfers for 5 adults with captain reclining leather seats, USB fast chargers, and senior-friendly low-step boarding.
          </p>
        </div>

        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 shrink-0 active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>WhatsApp Quote Builder</span>
        </button>
      </div>

      {/* Luggage & Van Specs Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
            <Luggage className="w-4 h-4" />
            <span>Luggage Capacity</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Accommodates <strong>5 large 28-inch suitcases</strong> + 4 cabin bags stacked in the rear luggage boot.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Bus className="w-4 h-4" />
            <span>Vehicle Model</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Ford Transit / Hyundai Solati customized by <strong>DCar President</strong> with 9 luxury captain chairs.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Senior Comfort</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Electric auto-sliding side door, wide footstep, cold AC, and smooth expressway suspension.
          </p>
        </div>
      </div>

      {/* Master Transfers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Master 9-Transfer Rates & Schedule (5 Adults)</span>
          <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">All-Inclusive Private Chauffeur</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50/70 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Transfer Leg</th>
                <th className="py-3 px-4">Date & Pickup</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Est. Duration</th>
                <th className="py-3 px-4 text-right">Cost (VND / INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
              {limoTransfers.map((leg, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {leg.leg || `Transfer ${idx + 1}`}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {leg.date}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs">
                    {leg.route}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {leg.duration || "Scheduled"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                    <strong className="text-emerald-600 dark:text-emerald-400">{leg.costVnd || "Included"}</strong>
                    {leg.costInr && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1.5 font-normal">({leg.costInr})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Quote Builder Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                WhatsApp Limousine Quote Builder
              </h4>
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select which legs you want included in your WhatsApp quote message to the limousine coordinator:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {limoTransfers.map((leg, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleLeg(idx)}
                  className={"p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all " + (
                    selectedLegs[idx]
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-white"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className="truncate">
                    <strong className="text-amber-600 dark:text-amber-400 mr-2">{leg.leg || `Transfer ${idx + 1}`}:</strong>
                    <span>{leg.route}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!selectedLegs[idx]}
                    onChange={() => {}}
                    className="accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsQuoteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={generateWhatsAppQuote}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send to WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

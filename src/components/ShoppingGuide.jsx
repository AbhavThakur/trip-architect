import React, { useState } from "react";
import { ShoppingBag, Calculator, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function ShoppingGuide({ shopping = [] }) {
  const [askingPriceVnd, setAskingPriceVnd] = useState(800000);

  const offerVnd = Math.round(askingPriceVnd * 0.5);
  // Rate: 1 INR ≈ 303 VND (1 VND ≈ 0.0033 INR)
  const offerInr = Math.round(offerVnd * 0.0033);

  const quickPresets = [150000, 250000, 400000, 600000, 1000000, 1500000];

  return (
    <div className="space-y-4">
      {/* 50% Bargaining Counter Card */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-pink-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-300 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono border border-pink-500/30">
            Market Counter Tool
          </span>
          <h3 className="text-lg sm:text-xl font-black font-display text-white">
            50% Street Bargaining Calculator
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            At night markets and street stalls (Hàng Dầu, Đồng Xuân), vendors quote 2x–3x. Type their asking price to see your recommended starting counter-offer.
          </p>
        </div>

        {/* Interactive Counter Box */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-pink-500/40 space-y-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] text-slate-400 uppercase font-mono block">Seller Asks (VND)</label>
              <input
                type="number"
                value={askingPriceVnd}
                onChange={(e) => setAskingPriceVnd(Number(e.target.value) || 0)}
                step="50000"
                className="w-32 bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded-xl border border-slate-700 text-right focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="h-8 w-px bg-slate-800"></div>

            <div className="space-y-0.5 text-right">
              <label className="text-[10px] text-emerald-400 uppercase font-mono block font-bold">Offer 50% (You Pay)</label>
              <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                {offerVnd.toLocaleString("en-US")} ₫
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ≈ ₹{offerInr.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-6 gap-1 pt-1">
            {quickPresets.map((val) => (
              <button
                key={val}
                onClick={() => setAskingPriceVnd(val)}
                className="bg-slate-900 hover:bg-slate-800 text-pink-300 py-1 rounded-lg text-[10px] font-mono font-bold border border-slate-800 hover:border-pink-500/40 transition-all text-center"
              >
                {(val / 1000) + "k"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Shopping Gems Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            Curated Vietnam Shopping Gems (Tested Quality & Real Prices)
          </span>
          <span className="text-amber-400 font-mono text-[11px]">Hanoi • Hoi An • Da Nang</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left divide-y divide-slate-800">
            <thead className="bg-slate-950/60 text-slate-400 text-[10px] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Recommended Items</th>
                <th className="py-3 px-4">Best Location</th>
                <th className="py-3 px-4">Realistic Price (INR)</th>
                <th className="py-3 px-4">Bargaining & Quality Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {shopping.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 font-bold text-white max-w-xs">
                    {item.items}
                  </td>
                  <td className="py-3 px-4 text-indigo-300 whitespace-nowrap">
                    {item.location}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold whitespace-nowrap">
                    {item.price}
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px] leading-relaxed">
                    {item.rule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Airport VAT Refund Cheatsheet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Airport 8.5% VAT Tax Refund Guide (Noi Bai T2 & Da Nang)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-amber-400 font-mono block">1. Minimum Spend</strong>
            <p className="text-slate-300 leading-relaxed">
              Minimum <strong>2,000,000 VND (~₹6,600)</strong> on a single receipt from participating VAT-registered stores (FPT Shop, TopZone, luxury boutiques).
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-indigo-400 font-mono block">2. In-Store VAT Invoice</strong>
            <p className="text-slate-300 leading-relaxed">
              Present your original passport at checkout and ask for the green <em>"VAT Refund Declaration Form"</em> with official merchant stamp.
            </p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-emerald-400 font-mono block">3. Airport Claim Counter</strong>
            <p className="text-slate-300 leading-relaxed">
              At HAN T2 Departure Hall (before immigration), present items & receipt to Customs. Collect cash refund in USD/VND past security!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

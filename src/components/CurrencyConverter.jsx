import React, { useState } from "react";
import { DollarSign, ArrowRight, RefreshCw, Calculator } from "lucide-react";

export default function CurrencyConverter({ currency }) {
  const defaultRate = currency?.defaultRate || 0.0033; // 1 VND = 0.0033 INR
  const [foreignAmount, setForeignAmount] = useState(100000);
  const [rate, setRate] = useState(defaultRate);

  const presets = currency?.presets || [10000, 50000, 100000, 250000, 500000, 1000000];
  const inrValue = Math.round(foreignAmount * rate);

  return (
    <div className="bg-white dark:bg-darkcard p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-darkborder shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Live FX & Currency Converter</h4>
            <p className="text-[11px] text-slate-400">
              Offline calculator • 100,000 {currency?.code || "VND"} ≈ ₹{Math.round(100000 * rate).toLocaleString()} INR
            </p>
          </div>
        </div>
      </div>

      {/* Quick Amount Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Quick Presets</span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presets.map((val) => (
            <button
              key={val}
              onClick={() => setForeignAmount(val)}
              className={"py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all border " + (
                foreignAmount === val
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                  : "bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700"
              )}
            >
              {(val >= 1000000 ? (val / 1000000) + "M" : (val / 1000) + "k")}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input & Output */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Foreign Currency Input */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">
            Foreign Amount ({currency?.code || "VND"})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={foreignAmount}
              onChange={(e) => setForeignAmount(Number(e.target.value) || 0)}
              className="w-full bg-transparent text-lg font-mono font-black text-white focus:outline-none"
              placeholder="0"
            />
            <span className="text-xs font-mono text-slate-500 font-bold">{currency?.symbol || "₫"}</span>
          </div>
        </div>

        {/* Indian Rupee Output */}
        <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40 space-y-1">
          <label className="text-[10px] uppercase font-bold text-emerald-400 block">
            Estimated Cost ({currency?.targetCode || "INR"})
          </label>
          <div className="flex items-center justify-between">
            <strong className="text-2xl font-black text-emerald-300 font-mono">
              ₹{inrValue.toLocaleString()}
            </strong>
            <span className="text-[11px] text-emerald-500/80 font-mono">Rate: {rate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

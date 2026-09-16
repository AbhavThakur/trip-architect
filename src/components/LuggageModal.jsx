import React, { useState } from "react";
import { Luggage, X, AlertCircle, Sparkles, Scale, Users, Check } from "lucide-react";

export default function LuggageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [allowanceMode, setAllowanceMode] = useState("30"); // "20", "25", "30", "150"
  const [cashews, setCashews] = useState(4); // kg
  const [coffee, setCoffee] = useState(2); // kg
  const [shoes, setShoes] = useState(3); // pairs
  const [clothes, setClothes] = useState(5); // items

  const maxAllowance = Number(allowanceMode) || 30.0;
  const total = (cashews * 1.0) + (coffee * 1.0) + (shoes * 0.8) + (clothes * 1.0);
  const remaining = (maxAllowance - total).toFixed(1);
  const percentage = Math.min(100, Math.round((total / maxAllowance) * 100));

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-display">
                Luggage & Haul Weight Estimator
              </h3>
              <p className="text-[10px] text-slate-400">
                Track cashews, shoes & coffee vs airline check-in allowance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Allowance Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Select Baggage Allowance Limit
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold font-mono">
            <button
              onClick={() => setAllowanceMode("20")}
              className={`py-1.5 rounded-xl transition ${
                allowanceMode === "20"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              20 kg
            </button>
            <button
              onClick={() => setAllowanceMode("25")}
              className={`py-1.5 rounded-xl transition ${
                allowanceMode === "25"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              25 kg
            </button>
            <button
              onClick={() => setAllowanceMode("30")}
              className={`py-1.5 rounded-xl transition ${
                allowanceMode === "30"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              30 kg ★
            </button>
            <button
              onClick={() => setAllowanceMode("150")}
              className={`py-1.5 rounded-xl transition ${
                allowanceMode === "150"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="5 Pax x 30 kg = 150 kg Total Family Check-in"
            >
              150 kg (5p)
            </button>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">
            {allowanceMode === "30"
              ? "✓ Confirmed IndiGo 6E ticket allowance: 30 Kgs check-in per passenger"
              : allowanceMode === "150"
              ? "✓ Combined family allowance for all 5 confirmed travelers (5 × 30 kg = 150 kg)"
              : "✓ Standard budget airline check-in limit"}
          </p>
        </div>

        {/* Live Weight Progress Gauge */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Estimated Haul Weight
            </span>
            <span className="font-mono font-black text-lg text-purple-300">
              {total.toFixed(1)} kg
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                total > maxAllowance
                  ? "bg-red-500"
                  : total > maxAllowance * 0.85
                  ? "bg-amber-500"
                  : "bg-purple-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">Allowance: {maxAllowance}.0 kg</span>
            <span className={`font-bold ${total > maxAllowance ? "text-red-400" : "text-emerald-400"}`}>
              {total > maxAllowance
                ? `⚠️ Over limit by ${(total - maxAllowance).toFixed(1)} kg!`
                : `✓ ${remaining} kg safety buffer`}
            </span>
          </div>
        </div>

        {/* Item Inputs */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Grade 1 Salted Cashews (Loại 1)</strong>
              <span className="text-[10px] text-slate-400">500g vacuum packs (~1.0 kg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCashews(Math.max(0, cashews - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{cashews} kg</span>
              <button
                onClick={() => setCashews(cashews + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Trung Nguyên Coffee Packs</strong>
              <span className="text-[10px] text-slate-400">Legend No. 4/5 / Sang Tao (~1.0 kg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCoffee(Math.max(0, coffee - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{coffee} kg</span>
              <button
                onClick={() => setCoffee(coffee + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Sneakers & First-Copy Shoes</strong>
              <span className="text-[10px] text-slate-400">Hàng Dầu Street (~0.8 kg/pair)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShoes(Math.max(0, shoes - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{shoes} pr</span>
              <button
                onClick={() => setShoes(shoes + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Gore-Tex Jackets & Silk Tailoring</strong>
              <span className="text-[10px] text-slate-400">Hoi An tailored suits & jackets (~1.0 kg/item)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClothes(Math.max(0, clothes - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{clothes} pcs</span>
              <button
                onClick={() => setClothes(clothes + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-800 transition"
              >+</button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          Done & Close Calculator
        </button>
      </div>
    </div>
  );
}

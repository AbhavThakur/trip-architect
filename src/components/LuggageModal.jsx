import React, { useState } from "react";
import { Luggage, X, AlertCircle, Sparkles, Scale } from "lucide-react";

export default function LuggageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [cashews, setCashews] = useState(4); // kg
  const [coffee, setCoffee] = useState(2); // kg
  const [shoes, setShoes] = useState(3); // pairs
  const [clothes, setClothes] = useState(5); // items

  const total = (cashews * 1.0) + (coffee * 1.0) + (shoes * 0.8) + (clothes * 1.0);
  const maxAllowance = 25.0;
  const remaining = (maxAllowance - total).toFixed(1);
  const percentage = Math.min(100, Math.round((total / maxAllowance) * 100));

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Luggage & Haul Weight Estimator</h3>
              <p className="text-[10px] text-slate-400">Track cashews, shoes & coffee vs 25kg airline check-in allowance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Weight Progress Gauge */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">Estimated Haul Weight</span>
            <span className="font-mono font-black text-lg text-purple-300">{total.toFixed(1)} kg</span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${total > maxAllowance ? "bg-red-500" : total > 20 ? "bg-amber-500" : "bg-purple-500"}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Allowance: 25.0 kg</span>
            <span className={`font-bold ${total > maxAllowance ? "text-red-400" : "text-emerald-400"}`}>
              {total > maxAllowance ? `Over by ${(total - maxAllowance).toFixed(1)} kg!` : `${remaining} kg remaining buffer`}
            </span>
          </div>
        </div>

        {/* Item Inputs */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Grade 1 Salted Cashews (Loại 1)</strong>
              <span className="text-[10px] text-slate-400">500g vacuum tins (~1.0 kg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCashews(Math.max(0, cashews - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{cashews} kg</span>
              <button
                onClick={() => setCashews(cashews + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Trung Nguyên Coffee Packs</strong>
              <span className="text-[10px] text-slate-400">Legend No. 4/5 (~1.0 kg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCoffee(Math.max(0, coffee - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{coffee} kg</span>
              <button
                onClick={() => setCoffee(coffee + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
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
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{shoes} pr</span>
              <button
                onClick={() => setShoes(shoes + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <strong className="text-white block">Gore-Tex Jackets & Silk Tailoring</strong>
              <span className="text-[10px] text-slate-400">Jackets & linen suits (~1.0 kg/item)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClothes(Math.max(0, clothes - 1))}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >-</button>
              <span className="w-8 text-center font-mono font-bold text-purple-300">{clothes} pcs</span>
              <button
                onClick={() => setClothes(clothes + 1)}
                className="w-7 h-7 bg-slate-900 border border-slate-700 text-white rounded-lg font-bold"
              >+</button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all"
        >
          Got It, Done
        </button>
      </div>
    </div>
  );
}

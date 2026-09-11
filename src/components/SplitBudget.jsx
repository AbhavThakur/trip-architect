import React, { useState } from 'react';
import { Calculator, Users, CreditCard, ChevronRight } from 'lucide-react';

export default function SplitBudget({ budget }) {
  if (!budget) return null;

  const [pax, setPax] = useState(budget.paxCount || 2);
  const total = budget.total || 0;
  const perPerson = Math.round(total / (pax || 1));

  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Dynamic Split Budget Engine</h4>
            <p className="text-[11px] text-slate-400">Per-pax liability calculation with real-time scaling</p>
          </div>
        </div>

        {/* Pax Selector */}
        <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-slate-400 font-bold mr-1">Pax:</span>
          <select
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className="bg-slate-900 text-white font-mono font-bold text-xs rounded border border-slate-700 px-1.5 py-0.5 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n}>{n} Adults</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Group Cost</span>
          <strong className="text-xl font-black text-white font-mono mt-0.5 block">
            ₹{total.toLocaleString()}
          </strong>
          <span className="text-[10px] text-slate-500">Includes stays, travel & meals</span>
        </div>

        <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Per Person Share</span>
          <strong className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">
            ₹{perPerson.toLocaleString()}
          </strong>
          <span className="text-[10px] text-emerald-500/80">Split across {pax} traveler{pax === 1 ? '' : 's'}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {budget.categories && (
        <div className="space-y-2 pt-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Category Allocations</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {budget.categories.map((c, idx) => (
              <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">{c.name}</span>
                <span className="font-mono font-bold text-amber-300">₹{c.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

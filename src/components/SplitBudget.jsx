import React, { useState } from "react";
import { Calculator, Users, Plus, DollarSign, Calendar, X, Tag } from "lucide-react";

export default function SplitBudget({ budget, onSaveBudget }) {
  if (!budget) return null;

  const [pax, setPax] = useState(budget.paxCount || 5);
  const [categories, setCategories] = useState(budget.categories || []);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().split("T")[0]
  });

  const total = categories.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const perPerson = Math.round(total / (pax || 1));

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const amountNum = Number(newExpense.amount);
    const nextCategories = [...categories];

    // Find if category exists, add to it, or create new
    const existing = nextCategories.find((c) => c.name === newExpense.category);
    if (existing) {
      existing.amount += amountNum;
    } else {
      nextCategories.push({ name: newExpense.category, amount: amountNum });
    }

    setCategories(nextCategories);
    if (onSaveBudget) {
      onSaveBudget({ ...budget, total: total + amountNum, categories: nextCategories });
    }

    setNewExpense({
      name: "",
      amount: "",
      category: "Food & Dining",
      date: new Date().toISOString().split("T")[0]
    });
    setIsAddExpenseOpen(false);
  };

  return (
    <div className="bg-slate-900/90 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
      {/* Header with Pax Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-black text-white font-display">
              Multi-Pax Split Budget Engine
            </h4>
            <p className="text-[11px] text-slate-400">
              Live per-traveler liability calculations with instant pax presets
            </p>
          </div>
        </div>

        {/* 1-Tap Pax Presets */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {[
            { label: "5 Adults", count: 5, tip: "Full Group" },
            { label: "3 Adults", count: 3, tip: "BLR" },
            { label: "2 Adults", count: 2, tip: "Parents" },
            { label: "1 Adult", count: 1, tip: "Solo" }
          ].map((item) => (
            <button
              key={item.count}
              onClick={() => setPax(item.count)}
              className={"px-2.5 py-1 rounded-xl text-xs font-bold transition-all " + (
                pax === item.count
                  ? "bg-purple-600 text-white shadow-md font-black"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
            Total Group Expedition Cost
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-white font-mono block">
            ₹{total.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-slate-400">Includes flights, stays, activities & meals</span>
        </div>

        <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/40 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
            Per-Person Share ({pax} Adults)
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono block">
            ₹{perPerson.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-emerald-500/80">Equal split across {pax} traveler{pax === 1 ? "" : "s"}</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
            Category Allocations
          </span>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Expense</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {categories.map((c, idx) => {
            const pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
            return (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">{c.name}</span>
                  <strong className="font-mono font-bold text-amber-300 text-sm">
                    ₹{c.amount.toLocaleString("en-IN")}
                  </strong>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: pct + "%" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{pct}% of total</span>
                  <span>₹{Math.round(c.amount / (pax || 1)).toLocaleString("en-IN")} / person</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-400" />
                Add Custom Expense
              </h4>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Expense Name</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  placeholder="e.g. Extra Baggage 25kg, Coconut Forest tickets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Flights & Mobility">Flights & Mobility</option>
                  <option value="Hotels & Stays">Hotels & Stays</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Sightseeing & Tickets">Sightseeing & Tickets</option>
                  <option value="Shopping & Souvenirs">Shopping & Souvenirs</option>
                  <option value="Emergency & Visa">Emergency & Visa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Amount in INR (₹)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Save Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

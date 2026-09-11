import React, { useState } from "react";
import {
  Calculator, Users, Plus, DollarSign, Calendar, X, Tag,
  Plane, Hotel, Car, Ticket, Utensils, Shield, ShoppingBag,
  RotateCcw, PenSquare, Trash2, CheckCircle2, Clock, Receipt,
  Check, ArrowRight
} from "lucide-react";

export const BUDGET_CATEGORIES = {
  all: { label: "All", icon: Tag, color: "purple" },
  flights: { label: "Flights", icon: Plane, color: "indigo" },
  stays: { label: "Stays", icon: Hotel, color: "blue" },
  transport: { label: "Cabs & Limo", icon: Car, color: "sky" },
  tours: { label: "Tours & Tickets", icon: Ticket, color: "amber" },
  food: { label: "Food & Dining", icon: Utensils, color: "emerald" },
  visas: { label: "Visas & Docs", icon: Shield, color: "rose" },
  misc: { label: "Shopping & Misc", icon: ShoppingBag, color: "purple" }
};

const QUICK_DATE_PRESETS = [
  { label: "Dec 3 Departure", value: "2026-12-03" },
  { label: "Dec 4 Hanoi", value: "2026-12-04" },
  { label: "Dec 5 Ninh Binh", value: "2026-12-05" },
  { label: "Dec 6 Fly Da Nang", value: "2026-12-06" },
  { label: "Dec 7 Hoi An", value: "2026-12-07" },
  { label: "Dec 8 Ba Na Hills", value: "2026-12-08" },
  { label: "Dec 10 Farewell", value: "2026-12-10" },
  { label: "Dec 11 Return", value: "2026-12-11" }
];

export default function SplitBudget({ budget, onSaveBudget, tripId }) {
  if (!budget) return null;

  const defaultItems = [
    { item: "International Flights (DEL & BLR)", details: "5 return tickets (2 DEL Parents + 3 BLR Adults)", total: 140000, pax: 5, category: "flights", date: "2026-12-03", status: "estimated" },
    { item: "Domestic Flights (HAN ⇄ DAD)", details: "5 round-trip tickets (VN Airlines / VietJet)", total: 35000, pax: 5, category: "flights", date: "2026-12-06", status: "estimated" },
    { item: "Vietnam E-Visas", details: "/person for 5 pax (Gov Portal)", total: 10500, pax: 5, category: "visas", date: "2026-11-05", status: "estimated" },
    { item: "Hanoi Hotels (3 Nights Total)", details: "La Siesta Classic (Double + Triple Suites)", total: 33000, pax: 5, category: "stays", date: "2026-12-03", status: "estimated" },
    { item: "Hoi An Garden Resort (2 Nights)", details: "La Siesta Resort (Double + Grand Suites)", total: 24000, pax: 5, category: "stays", date: "2026-12-06", status: "estimated" },
    { item: "Da Nang Beachfront Hotel (2 Nights)", details: "TMS Hotel Ocean View (Double + Triple Suites)", total: 22000, pax: 5, category: "stays", date: "2026-12-08", status: "estimated" },
    { item: "9-Seater Private DCar Limousines", details: "All 9 private transfers (including Ninh Binh Full Day)", total: 38000, pax: 5, category: "transport", date: "2026-12-04", status: "estimated" },
    { item: "Ninh Binh Day Tour & Boat Tickets", details: "Hoa Lu entry + Tam Coc Sampan rowboat fees for 5 pax", total: 12500, pax: 5, category: "tours", date: "2026-12-05", status: "estimated" },
    { item: "Ba Na Hills Cable Car & Bridge Tickets", details: "5 Klook cable car + Golden bridge entry passes", total: 18500, pax: 5, category: "tours", date: "2026-12-08", status: "estimated" },
    { item: "Sightseeing, Puppets & Lantern Boats", details: "Water puppets VIP, Hoi An lantern boat, Marble Mt elevator", total: 9500, pax: 5, category: "tours", date: "2026-12-04", status: "estimated" },
    { item: "Pure Veg & Indian Dining / Cafes", details: "Sadhu, Dalcheeni, Baba's Kitchen, Ưu Đàm Chay & Egg Coffee", total: 42000, pax: 5, category: "food", date: "2026-12-03", status: "estimated" }
  ];

  const initialItems = budget.items && budget.items.length > 0
    ? budget.items
    : (budget.categories && budget.categories.length > 0
        ? budget.categories.map((c, i) => ({
            item: c.name,
            details: "Planned budget allocation",
            total: Number(c.amount) || 0,
            pax: budget.paxCount || 5,
            category: c.key || (c.name.toLowerCase().includes("flight") ? "flights" : c.name.toLowerCase().includes("hotel") ? "stays" : "misc"),
            date: "2026-12-04",
            status: "estimated"
          }))
        : defaultItems);

  const [items, setItems] = useState(initialItems);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expenses, setExpenses] = useState(budget.expenses || [
    { id: "exp_1", title: "Egg Coffee at Cafe Giảng (5 cups)", vnd: 175, inr: 580, category: "Food", payer: "Self", pax: 5, date: "2026-12-04" },
    { id: "exp_2", title: "Water Puppets Snack & Coconut Water", vnd: 120, inr: 400, category: "Food", payer: "BLR", pax: 5, date: "2026-12-04" }
  ]);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [itemForm, setItemForm] = useState({
    item: "",
    details: "",
    total: "",
    pax: 5,
    category: "flights",
    date: "",
    status: "estimated"
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    vnd: "",
    inr: "",
    category: "Food",
    payer: "Self",
    pax: 5
  });

  const grandTotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const totalPax = budget.paxCount || 5;
  const perPersonTotal = Math.round(grandTotal / Math.max(1, totalPax));

  const bookedTotal = items
    .filter((b) => b.status === "booked" || b.status === "paid")
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const estimatedTotal = items
    .filter((b) => b.status === "estimated")
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

  const sharedTotal = items
    .filter((b) => (Number(b.pax) || 5) === 5)
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const blrTotal = items
    .filter((b) => Number(b.pax) === 3)
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  const delTotal = items
    .filter((b) => Number(b.pax) === 2)
    .reduce((sum, b) => sum + (Number(b.total) || 0), 0);

  const totalLoggedSpendInr = expenses.reduce((sum, exp) => sum + (Number(exp.inr) || 0), 0);

  const catCounts = { all: items.length };
  Object.keys(BUDGET_CATEGORIES).forEach((k) => {
    if (k !== "all") {
      catCounts[k] = items.filter((b) => (b.category || "misc") === k).length;
    }
  });

  const filteredItems = items
    .map((item, idx) => ({ item, originalIndex: idx }))
    .filter((entry) => (activeFilter === "all" ? true : (entry.item.category || "misc") === activeFilter));

  const filteredSubtotal = filteredItems.reduce((sum, entry) => sum + (Number(entry.item.total) || 0), 0);

  const syncUpdates = (nextItems, nextExpenses = expenses) => {
    setItems(nextItems);
    setExpenses(nextExpenses);
    if (onSaveBudget) {
      const nextTotal = nextItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
      onSaveBudget({
        ...budget,
        total: nextTotal,
        items: nextItems,
        expenses: nextExpenses
      });
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(-1);
    setItemForm({
      item: "",
      details: "",
      total: "",
      pax: 5,
      category: activeFilter !== "all" ? activeFilter : "flights",
      date: "2026-12-04",
      status: "estimated"
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (idx) => {
    const item = items[idx];
    if (!item) return;
    setEditingIndex(idx);
    setItemForm({
      item: item.item || "",
      details: item.details || "",
      total: item.total || "",
      pax: item.pax || 5,
      category: item.category || "flights",
      date: item.date || "",
      status: item.status || "estimated"
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemForm.item.trim()) return;

    const totalNum = parseFloat(itemForm.total) || 0;
    const paxNum = Math.max(1, parseInt(itemForm.pax, 10) || 5);
    const newItem = {
      item: itemForm.item.trim(),
      details: itemForm.details.trim(),
      total: totalNum,
      pax: paxNum,
      pp: Math.round(totalNum / paxNum),
      category: itemForm.category,
      date: itemForm.date,
      status: itemForm.status
    };

    const next = [...items];
    if (editingIndex >= 0 && editingIndex < next.length) {
      next[editingIndex] = newItem;
    } else {
      next.push(newItem);
    }

    syncUpdates(next);
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (idx) => {
    const target = items[idx];
    if (!target) return;
    if (window.confirm()) {
      const next = items.filter((_, i) => i !== idx);
      syncUpdates(next);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all budget items to initial master estimates? Any custom edits will be replaced.")) {
      syncUpdates(defaultItems);
    }
  };

  const handleVndChange = (vndVal) => {
    const num = parseFloat(vndVal) || 0;
    const inrVal = Math.round(num * 3.3);
    setExpenseForm((prev) => ({
      ...prev,
      vnd: vndVal,
      inr: num > 0 ? inrVal : ""
    }));
  };

  const handleInrChange = (inrVal) => {
    const num = parseFloat(inrVal) || 0;
    const vndVal = Math.round(num / 3.3);
    setExpenseForm((prev) => ({
      ...prev,
      inr: inrVal,
      vnd: num > 0 ? vndVal : ""
    }));
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.title.trim()) return;

    const newExp = {
      id: "exp_" + Date.now(),
      title: expenseForm.title.trim(),
      vnd: parseFloat(expenseForm.vnd) || 0,
      inr: parseFloat(expenseForm.inr) || 0,
      category: expenseForm.category,
      payer: expenseForm.payer,
      pax: parseInt(expenseForm.pax, 10) || 5,
      date: new Date().toISOString().split("T")[0]
    };

    const nextExp = [newExp, ...expenses];
    syncUpdates(items, nextExp);
    setExpenseForm({
      title: "",
      vnd: "",
      inr: "",
      category: "Food",
      payer: "Self",
      pax: 5
    });
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (expId) => {
    const nextExp = expenses.filter((e) => e.id !== expId);
    syncUpdates(items, nextExp);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Summary Cards Grid */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-4 sm:p-5 rounded-3xl border border-purple-800/70 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Master Trip Cost Matrix</h4>
              <p className="text-[11px] text-slate-400">Live multi-pax liability calculations & on-trip spend tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Reset to default initial estimates"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              Reset Defaults
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Budget Item
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Grand Total</span>
            <span className="text-base sm:text-lg font-black text-white font-mono block mt-0.5">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-purple-400 font-bold block mt-0.5">
              ~₹{perPersonTotal.toLocaleString("en-IN")} / adult
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Actual / Booked</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono block mt-0.5">
              ₹{bookedTotal.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Confirmed bookings</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Estimated</span>
            <span className="text-base sm:text-lg font-black text-amber-400 font-mono block mt-0.5">
              ₹{estimatedTotal.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Pending quotes</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Logged Spends</span>
            <span className="text-base sm:text-lg font-black text-indigo-400 font-mono block mt-0.5">
              ₹{totalLoggedSpendInr.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">On-trip receipts</span>
          </div>
        </div>

        {/* Group Split Liability Cards */}
        <div className="pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Group Pax Split Liability Breakdown:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-bold block text-[11px]">👥 Shared (5 Pax All)</span>
              <span className="text-white font-mono font-black text-sm block mt-0.5">
                ₹{sharedTotal.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                (₹{Math.round(sharedTotal / 5).toLocaleString("en-IN")} / head)
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block text-[11px]">🧑 BLR Group (3 Pax)</span>
              <span className="text-white font-mono font-black text-sm block mt-0.5">
                ₹{blrTotal.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-purple-300 block mt-0.5">
                (₹{Math.round(blrTotal / 3).toLocaleString("en-IN")} / head)
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-indigo-400 font-bold block text-[11px]">👨 DEL Parents (2 Pax)</span>
              <span className="text-white font-mono font-black text-sm block mt-0.5">
                ₹{delTotal.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-indigo-300 block mt-0.5">
                (₹{Math.round(delTotal / 2).toLocaleString("en-IN")} / head)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills & Subtotal Bar */}
      <div className="bg-white dark:bg-darkcard rounded-2xl border border-slate-200 dark:border-darkborder overflow-hidden shadow-sm">
        <div className="p-3 border-b border-slate-100 dark:border-darkborder bg-slate-50/70 dark:bg-darkcard flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-1">Filter:</span>
          {Object.entries(BUDGET_CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            const count = catCounts[key] || 0;
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={"px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 " + (
                  isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={"px-1.5 py-0.2 rounded-full text-[9px] " + (isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {activeFilter !== "all" && (
          <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-900/40 text-xs text-purple-800 dark:text-purple-300 flex justify-between items-center">
            <span className="font-semibold">Showing {BUDGET_CATEGORIES[activeFilter]?.label || activeFilter} ({filteredItems.length} items)</span>
            <span className="font-mono font-bold">Subtotal: ₹{filteredSubtotal.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Master Budget Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200 dark:border-darkborder">
              <tr>
                <th className="p-3">Expense Item & Notes</th>
                <th className="p-3 text-right">Total Cost</th>
                <th className="p-3 text-center">Split / Pax</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-darkborder">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                    No expense items in this category. Click "+ Add Budget Item" above to add one!
                  </td>
                </tr>
              ) : (
                filteredItems.map(({ item, originalIndex }) => {
                  const cat = BUDGET_CATEGORIES[item.category] || BUDGET_CATEGORIES.misc;
                  const Icon = cat.icon;
                  const itemPax = item.pax || 5;
                  const ppCost = Math.round((Number(item.total) || 0) / Math.max(1, itemPax));

                  return (
                    <tr key={originalIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      {/* Title & Notes */}
                      <td className="p-3 align-middle max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 flex items-center gap-1">
                            <Icon className="w-2.5 h-2.5" />
                            {cat.label}
                          </span>
                          {item.date && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-purple-400" />
                              {item.date}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.item}</div>
                        {item.details && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.details}</p>}
                      </td>

                      {/* Total Cost */}
                      <td className="p-3 text-right whitespace-nowrap align-middle">
                        <div className="font-mono font-black text-slate-900 dark:text-white text-sm sm:text-base">
                          ₹{Number(item.total || 0).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Pax Split Badge */}
                      <td className="p-3 text-center whitespace-nowrap align-middle">
                        <span className={"px-2 py-0.5 rounded-lg text-[10px] font-bold border " + (
                          itemPax === 5
                            ? "bg-slate-800 text-slate-300 border-slate-700"
                            : itemPax === 3
                            ? "bg-purple-950/80 text-purple-300 border-purple-800"
                            : itemPax === 2
                            ? "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                            : "bg-amber-950/80 text-amber-300 border-amber-800"
                        )}>
                          ~₹{ppCost.toLocaleString("en-IN")} / head ({itemPax}p)
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3 text-center whitespace-nowrap align-middle">
                        {item.status === "booked" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 mx-auto w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Booked
                          </span>
                        ) : item.status === "paid" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1 mx-auto w-fit">
                            <Receipt className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 mx-auto w-fit">
                            <Clock className="w-3 h-3" /> Estimated
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="p-3 text-right whitespace-nowrap align-middle">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(originalIndex)}
                            className="p-1.5 text-purple-400 hover:text-white hover:bg-purple-950/80 rounded-lg transition-colors"
                            title="Edit Item, Split & Cost"
                          >
                            <PenSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(originalIndex)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Live On-Trip Spends Feed */}
      <div className="bg-white dark:bg-darkcard p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-darkborder shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">Live On-Trip Spends</h4>
              <p className="text-[10px] text-slate-400">Quickly log street food, cabs, coffee, and ticket receipts</p>
            </div>
          </div>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Spend
          </button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-3 italic">
            No on-trip spends logged yet. Tap "+ Log Spend" to record actual expenses.
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{exp.title}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 font-normal">
                      {exp.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Paid by <strong className="text-slate-200">{exp.payer || "Self"}</strong> • Split across {exp.pax || 5} pax
                    {exp.date && (" • " + exp.date)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="font-black text-white text-xs sm:text-sm block">₹{exp.inr}</span>
                    <span className="text-[10px] text-amber-400 block">{exp.vnd}k VND</span>
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg"
                    title="Delete spend"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL: Add / Edit Budget Item */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PenSquare className="w-4 h-4 text-purple-400" />
                {editingIndex >= 0 ? "Edit Budget Item" : "Add Custom Budget Item"}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              {/* Category selector */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">Category:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(BUDGET_CATEGORIES)
                    .filter(([k]) => k !== "all")
                    .map(([key, cat]) => {
                      const Icon = cat.icon;
                      const isSelected = itemForm.category === key;
                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() => setItemForm((prev) => ({ ...prev, category: key }))}
                          className={"p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all " + (
                            isSelected
                              ? "bg-purple-600 text-white shadow"
                              : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Item Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Return flights, Hotel stays, Cruise tickets"
                  value={itemForm.item}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, item: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs outline-none focus:border-purple-500"
                />
              </div>

              {/* Details & Notes */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Details & Booking Notes:</label>
                <input
                  type="text"
                  placeholder="e.g. 5 tickets with 20kg checked baggage"
                  value={itemForm.details}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, details: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs outline-none focus:border-purple-500"
                />
              </div>

              {/* Date & Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-bold">Planned Date:</label>
                  <span className="text-[10px] text-slate-500">Quick Presets:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 no-scrollbar">
                  {QUICK_DATE_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setItemForm((prev) => ({ ...prev, date: p.value }))}
                      className={"px-2 py-1 rounded-lg text-[10px] whitespace-nowrap font-bold transition-all " + (
                        itemForm.date === p.value
                          ? "bg-purple-600 text-white"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  value={itemForm.date}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-slate-300 text-xs outline-none focus:border-purple-500"
                />
              </div>

              {/* Total Cost & Pax Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Cost (INR ₹):</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    placeholder="e.g. 84000"
                    value={itemForm.total}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, total: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono font-bold text-white text-sm outline-none focus:border-purple-500 text-purple-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Split Across (Pax):</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={itemForm.pax}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, pax: parseInt(e.target.value, 10) || 1 }))}
                      className="w-14 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-center text-white text-xs outline-none focus:border-purple-500"
                    />
                    <div className="grid grid-cols-4 gap-1 flex-1">
                      {[
                        { label: "5 (All)", count: 5 },
                        { label: "3 (BLR)", count: 3 },
                        { label: "2 (DEL)", count: 2 },
                        { label: "1 (Solo)", count: 1 }
                      ].map((btn) => (
                        <button
                          type="button"
                          key={btn.count}
                          onClick={() => setItemForm((prev) => ({ ...prev, pax: btn.count }))}
                          className={"py-1 px-1 rounded-lg text-center font-bold text-[10px] border transition-all " + (
                            itemForm.pax === btn.count
                              ? "border-purple-500 bg-purple-950 text-purple-300 font-black"
                              : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                          )}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Per-Person Preview */}
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between">
                <span className="text-slate-300 text-xs font-semibold">Per-Person Share:</span>
                <span className="font-mono font-bold text-purple-300 text-xs sm:text-sm">
                  ₹{Math.round((parseFloat(itemForm.total) || 0) / Math.max(1, parseInt(itemForm.pax, 10) || 5)).toLocaleString("en-IN")} / person (for {itemForm.pax || 5} pax)
                </span>
              </div>

              {/* Status */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Booking Status:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: "booked", label: "✓ Actual / Booked", color: "border-emerald-500 bg-emerald-950/60 text-emerald-300" },
                    { key: "paid", label: "💳 Paid", color: "border-blue-500 bg-blue-950/60 text-blue-300" },
                    { key: "estimated", label: "⏳ Estimated", color: "border-amber-500 bg-amber-950/60 text-amber-300" }
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      onClick={() => setItemForm((prev) => ({ ...prev, status: s.key }))}
                      className={"py-2 px-1 rounded-xl text-center font-bold text-[11px] border transition-all " + (
                        itemForm.status === s.key ? s.color : "border-slate-800 bg-slate-950 text-slate-400"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Log On-Trip Spend */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" />
                Log On-Trip Spend
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Spend Description:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grab 7-Seater to Ba Na Hills, Coconut Water"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Amount (VND in '000):</label>
                  <input
                    type="number"
                    placeholder="e.g. 450 (=450k)"
                    value={expenseForm.vnd}
                    onChange={(e) => handleVndChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono font-bold text-white text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Amount (INR ₹):</label>
                  <input
                    type="number"
                    placeholder="e.g. 1485"
                    value={expenseForm.inr}
                    onChange={(e) => handleInrChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono font-bold text-emerald-400 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["Food", "Taxi", "Shopping", "Entry"].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setExpenseForm((prev) => ({ ...prev, category: cat }))}
                      className={"py-1.5 rounded-xl font-bold text-[11px] transition-all " + (
                        expenseForm.category === cat
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Paid By:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["Self", "BLR", "Parents", "Pool"].map((payer) => (
                    <button
                      type="button"
                      key={payer}
                      onClick={() => setExpenseForm((prev) => ({ ...prev, payer }))}
                      className={"py-1.5 rounded-xl font-bold text-[11px] transition-all " + (
                        expenseForm.payer === payer
                          ? "bg-emerald-600 text-white shadow"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                      )}
                    >
                      {payer}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Spend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

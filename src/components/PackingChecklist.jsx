import React, { useState, useEffect } from "react";
import {
  CheckSquare, Square, ClipboardCheck, RotateCcw,
  Plus, Trash2, CheckCheck, X, Search, CheckCircle2,
  Calendar, Info, ArrowRight, ShieldCheck, Sparkles, Check
} from "lucide-react";

export default function PackingChecklist({ tripId, checklist = [] }) {
  const storageKey = "trip_checklist_" + (tripId || "general");
  const customTasksKey = "trip_checklist_custom_" + (tripId || "general");

  const [checkedMap, setCheckedMap] = useState({});
  const [customTasks, setCustomTasks] = useState([]);
  const [activePhase, setActivePhase] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [showHowToUse, setShowHowToUse] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPhaseIdx, setNewTaskPhaseIdx] = useState(0);

  // Normalize base phases (supporting both phased checklist and flat checklists)
  const isFlat = Array.isArray(checklist) && checklist.length > 0 && !checklist[0].items && !checklist[0].tasks;
  let normalizedPhases = [];

  if (isFlat) {
    const categories = {};
    checklist.forEach((item, i) => {
      const cat = item.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({
        id: item.id || `flat_${i}`,
        text: item.text || item.title || item.item || "",
        desc: item.desc || "",
        defaultChecked: !!(item.defaultChecked || item.done),
        isCustom: false
      });
    });
    normalizedPhases = Object.entries(categories).map(([cat, items], idx) => ({
      id: `phase_${idx}`,
      index: idx,
      title: cat.toUpperCase(),
      badge: `${items.length} Tasks`,
      items
    }));
  } else {
    normalizedPhases = checklist.map((p, idx) => {
      const title = p.title || (typeof p.phase === "string" ? p.phase : "Phase " + (p.phase || (idx + 1)));
      const rawItems = p.items || p.tasks || [];
      const items = rawItems.map((item, iIdx) => ({
        id: item.id || (idx + "_" + iIdx),
        text: item.text || item.title || "",
        desc: item.desc || "",
        defaultChecked: !!item.defaultChecked,
        isCustom: false
      }));
      return {
        id: p.id || ("phase_" + idx),
        index: idx,
        title,
        badge: p.badge || null,
        items
      };
    });
  }

  // Combine items with custom items
  const phasesWithCustom = normalizedPhases.map((phase) => {
    const phaseCustom = customTasks.filter((c) => c.phaseIndex === phase.index);
    return {
      ...phase,
      items: [...phase.items, ...phaseCustom]
    };
  });

  // Load checked state and custom tasks from localStorage
  useEffect(() => {
    try {
      const savedChecked = localStorage.getItem(storageKey);
      if (savedChecked) {
        setCheckedMap(JSON.parse(savedChecked));
      } else {
        const defaults = {};
        phasesWithCustom.forEach((p) => {
          p.items.forEach((item) => {
            if (item.defaultChecked) defaults[item.id] = true;
          });
        });
        if (Object.keys(defaults).length > 0) {
          setCheckedMap(defaults);
        }
      }

      const savedCustom = localStorage.getItem(customTasksKey);
      if (savedCustom) setCustomTasks(JSON.parse(savedCustom));
    } catch (e) {}
  }, [storageKey, customTasksKey]);

  const allItems = phasesWithCustom.flatMap((p) => p.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((i) => checkedMap[i.id]).length;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleItem = (id) => {
    const next = { ...checkedMap, [id]: !checkedMap[id] };
    setCheckedMap(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleTogglePhase = (phase, markDone) => {
    const next = { ...checkedMap };
    phase.items.forEach((item) => {
      next[item.id] = markDone;
    });
    setCheckedMap(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const handleToggleAll = (markDone) => {
    const next = {};
    allItems.forEach((i) => {
      next[i.id] = markDone;
    });
    setCheckedMap(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const resetChecklist = () => {
    if (window.confirm("Reset all checkboxes in checklist to uncompleted?")) {
      setCheckedMap({});
      localStorage.removeItem(storageKey);
    }
  };

  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: "custom_" + Date.now(),
      text: newTaskTitle.trim(),
      desc: newTaskDesc.trim(),
      phaseIndex: newTaskPhaseIdx,
      isCustom: true
    };

    const nextCustom = [...customTasks, newTask];
    setCustomTasks(nextCustom);
    localStorage.setItem(customTasksKey, JSON.stringify(nextCustom));

    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAddModalOpen(false);
  };

  const handleRemoveCustomTask = (taskId) => {
    const nextCustom = customTasks.filter((t) => t.id !== taskId);
    setCustomTasks(nextCustom);
    localStorage.setItem(customTasksKey, JSON.stringify(nextCustom));

    const nextChecked = { ...checkedMap };
    delete nextChecked[taskId];
    setCheckedMap(nextChecked);
    localStorage.setItem(storageKey, JSON.stringify(nextChecked));
  };

  // Filter phases & tasks based on activePhase, statusFilter, and searchQuery
  const filteredPhases = phasesWithCustom
    .filter((phase) => activePhase === "all" || phase.id === activePhase)
    .map((phase) => {
      const matchingItems = phase.items.filter((item) => {
        const isChecked = !!checkedMap[item.id];
        if (statusFilter === "pending" && isChecked) return false;
        if (statusFilter === "completed" && !isChecked) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchText = (item.text || "").toLowerCase().includes(query);
          const matchDesc = (item.desc || "").toLowerCase().includes(query);
          return matchText || matchDesc;
        }
        return true;
      });

      return {
        ...phase,
        items: matchingItems
      };
    })
    .filter((phase) => phase.items.length > 0 || (searchQuery === "" && statusFilter === "all"));

  return (
    <div className="space-y-4">
      {/* 1. Bright, Clean White Header Card */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Readiness Hub
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {totalCount} Total Checkpoints
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                Pre-Departure 10-Phase Checklist
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleAll(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              title="Check all items"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Check All
            </button>
            <button
              onClick={resetChecklist}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all active:scale-95"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Task
            </button>
          </div>
        </div>

        {/* Live Progress & Readiness Gauge */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Trip Readiness Progress</span>
              {percent === 100 && (
                <span className="text-emerald-700 dark:text-emerald-300 text-[11px] font-mono flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Ready for Departure!
                </span>
              )}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm">
              {completedCount} / {totalCount} Done ({percent}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full shadow-sm"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visas, medicines, clothing, forex, SIM..."
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === "pending"
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                statusFilter === "completed"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Phase Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setActivePhase("all")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
              activePhase === "all"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
            }`}
          >
            All 10 Phases ({phasesWithCustom.length})
          </button>
          {phasesWithCustom.map((p, idx) => {
            const pDone = p.items.filter((i) => checkedMap[i.id]).length;
            const isAllDone = p.items.length > 0 && pDone === p.items.length;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  activePhase === p.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : isAllDone
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>Phase {idx + 1}</span>
                <span className="text-[10px] font-mono opacity-80 font-bold">({pDone}/{p.items.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Step-by-Step "How to Use This Pre-Departure Roadmap" Guide */}
      {showHowToUse && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                <Info className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                How to Use This Pre-Departure Roadmap (Step-by-Step Guide)
              </h4>
            </div>
            <button
              onClick={() => setShowHowToUse(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              title="Dismiss guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black text-[11px]">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">1</span>
                D-60 to D-30 Days
              </div>
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">E-Visas & Luggage</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Clear official Vietnam E-Visas on <em>evisa.gov.vn</em>, verify 6-month passport validity, and test pack within 25kg allowance.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-black text-[11px]">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">2</span>
                D-15 to D-7 Days
              </div>
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">Forex, Meds & eSIM</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Activate zero-forex debit cards, buy Viettel eSIM data packs, download offline Google Maps, and pack senior prescription meds.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-black text-[11px]">
                <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">3</span>
                D-3 to D-1 Days
              </div>
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">Web Check-in & Cabs</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Complete Vietnam Airlines web check-in 24h prior, reconfirm private DCar VIP limousine driver on WhatsApp, and print physical documents.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-black text-[11px]">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">4</span>
                D-Day Airport & Arrival
              </div>
              <strong className="block text-slate-900 dark:text-white font-bold text-xs">Zipper Pouch & Noi Bai</strong>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Carry original passports + 2 printed e-visa copies in your cabin bag. On arrival at Noi Bai T2, withdraw cash at VPBank/BIDV ATMs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Phased Task Cards with Clean White Background & High-Contrast Black/Dark Text */}
      <div className="space-y-4">
        {filteredPhases.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
            <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching checklist tasks</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try changing your search term or status filter.</p>
            <button
              onClick={() => { setActivePhase("all"); setStatusFilter("all"); setSearchQuery(""); }}
              className="mt-2 px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPhases.map((phase, pIdx) => {
            const phaseTotal = phase.items.length;
            const phaseDone = phase.items.filter((i) => checkedMap[i.id]).length;
            const isPhaseAllDone = phaseTotal > 0 && phaseDone === phaseTotal;

            return (
              <div
                key={phase.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Phase Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                      {pIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {phase.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {phaseDone} of {phaseTotal} Completed ({phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0}%)
                        </span>
                        {phase.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase tracking-wider">
                            {phase.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTogglePhase(phase, !isPhaseAllDone)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
                        isPhaseAllDone
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {isPhaseAllDone ? "Uncheck Phase" : "Check All Phase"}
                    </button>
                  </div>
                </div>

                {/* Items in this Phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.items.map((item) => {
                    const isChecked = !!checkedMap[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`flex items-start justify-between gap-3 p-4 rounded-2xl transition-all cursor-pointer border ${
                          isChecked
                            ? "bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs"
                            : "bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-900 dark:text-white shadow-2xs"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItem(item.id);
                            }}
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "border-2 border-slate-400 dark:border-slate-500 hover:border-emerald-600 bg-white dark:bg-slate-900"
                            }`}
                          >
                            {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-xs sm:text-sm font-bold block leading-snug transition-colors ${
                                  isChecked
                                    ? "line-through text-emerald-900/70 dark:text-emerald-300/70"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {item.text}
                              </span>
                              {item.isCustom && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase font-bold">
                                  Custom
                                </span>
                              )}
                              {isChecked && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono font-bold">
                                  Done
                                </span>
                              )}
                            </div>
                            {item.desc && (
                              <p
                                className={`text-[11px] mt-1.5 leading-relaxed font-normal ${
                                  isChecked
                                    ? "text-emerald-800/70 dark:text-emerald-400/70 line-through"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCustomTask(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                            title="Delete custom task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Add Personal Task</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Assign to any of the 10 pre-departure phases</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Target Phase:
                </label>
                <select
                  value={newTaskPhaseIdx}
                  onChange={(e) => setNewTaskPhaseIdx(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium outline-none focus:border-emerald-500"
                >
                  {phasesWithCustom.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      Phase {idx + 1}: {p.title.split(":")[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Extra inhaler, Universal adapter, Camera batteries"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Description / Instruction (Optional):
                </label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="e.g. Keep in cabin zipper bag with doctor prescription."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Checkpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

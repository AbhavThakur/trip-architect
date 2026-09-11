import React, { useState, useEffect } from "react";
import {
  CheckSquare, Square, ClipboardCheck, RotateCcw,
  Plus, Trash2, CheckCheck, X
} from "lucide-react";

export default function PackingChecklist({ tripId, checklist = [] }) {
  const storageKey = "trip_checklist_" + (tripId || "general");
  const customTasksKey = "trip_checklist_custom_" + (tripId || "general");

  const [checkedMap, setCheckedMap] = useState({});
  const [customTasks, setCustomTasks] = useState([]);
  const [activePhase, setActivePhase] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPhaseIdx, setNewTaskPhaseIdx] = useState(0);

  // Normalize base phases
  const normalizedPhases = checklist.map((p, idx) => {
    const title = p.title || (typeof p.phase === "string" ? p.phase : "Phase " + (p.phase || (idx + 1)));
    const rawItems = p.items || p.tasks || [];
    const items = rawItems.map((item, iIdx) => ({
      id: item.id || (idx + "_" + iIdx),
      text: item.text || item.title || "",
      desc: item.desc || "",
      isCustom: false
    }));
    return {
      id: "phase_" + idx,
      index: idx,
      title,
      badge: p.badge || null,
      items
    };
  });

  // Load checked state and custom tasks from localStorage
  useEffect(() => {
    try {
      const savedChecked = localStorage.getItem(storageKey);
      if (savedChecked) setCheckedMap(JSON.parse(savedChecked));

      const savedCustom = localStorage.getItem(customTasksKey);
      if (savedCustom) setCustomTasks(JSON.parse(savedCustom));
    } catch (e) {}
  }, [storageKey, customTasksKey]);

  // Combine items with custom items
  const phasesWithCustom = normalizedPhases.map((phase) => {
    const phaseCustom = customTasks.filter((c) => c.phaseIndex === phase.index);
    return {
      ...phase,
      items: [...phase.items, ...phaseCustom]
    };
  });

  const allItems = phasesWithCustom.flatMap((p) => p.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((i) => checkedMap[i.id]).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleItem = (id) => {
    const next = { ...checkedMap, [id]: !checkedMap[id] };
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
    if (window.confirm("Reset all checkboxes in checklist?")) {
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

  const displayedPhases = activePhase === "all"
    ? phasesWithCustom
    : phasesWithCustom.filter((p) => p.id === activePhase);

  return (
    <div className="space-y-4">
      {/* Header with Progress Bar */}
      <div className="bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Pre-Departure Readiness Checklist</h4>
              <p className="text-[11px] text-slate-400">Track visas, e-SIMs, DCar bookings & foreign exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleToggleAll(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1"
              title="Check all items"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Check All
            </button>
            <button
              onClick={resetChecklist}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1"
              title="Reset checkboxes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Readiness Progress</span>
            <span className="text-amber-400 font-mono">{completedCount} / {totalCount} ({percent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

        {/* Phase Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setActivePhase("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
              activePhase === "all" ? "bg-amber-600 text-white shadow" : "bg-slate-950 text-slate-400 border border-slate-800"
            }`}
          >
            All Phases ({totalCount})
          </button>
          {phasesWithCustom.map((p) => {
            const pDone = p.items.filter((i) => checkedMap[i.id]).length;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                  activePhase === p.id ? "bg-amber-600 text-white shadow" : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                {p.title.split(":")[0]} ({pDone}/{p.items.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Phases and Tasks */}
      <div className="space-y-4">
        {displayedPhases.map((phase) => (
          <div
            key={phase.id}
            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h5 className="text-xs sm:text-sm font-black text-white">{phase.title}</h5>
              {phase.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {phase.badge}
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-850">
              {phase.items.map((item) => {
                const isChecked = !!checkedMap[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 py-2.5 hover:bg-slate-900/40 rounded-xl px-2 transition-colors group cursor-pointer"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(item.id);
                        }}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-white"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      <div>
                        <span className={`text-xs font-bold block ${isChecked ? "line-through text-slate-500" : "text-slate-200"}`}>
                          {item.text}
                        </span>
                        {item.desc && (
                          <p className={`text-[11px] mt-0.5 ${isChecked ? "text-slate-600 line-through" : "text-slate-400"}`}>
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
                        className="p-1 text-slate-600 hover:text-red-400 transition-colors"
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
        ))}
      </div>

      {/* ADD CUSTOM TASK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Add Custom Checklist Task
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Phase:</label>
                <select
                  value={newTaskPhaseIdx}
                  onChange={(e) => setNewTaskPhaseIdx(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs outline-none focus:border-amber-500"
                >
                  {normalizedPhases.map((p) => (
                    <option key={p.id} value={p.index}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Task Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call SBI branch for Zero-Forex Card activation"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Notes / Instructions:</label>
                <input
                  type="text"
                  placeholder="e.g. Ensure international contactless POS limit is set to ₹50,000"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

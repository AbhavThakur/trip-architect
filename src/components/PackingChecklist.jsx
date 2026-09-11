import React, { useState, useEffect } from "react";
import { CheckSquare, Square, ClipboardCheck, RotateCcw } from "lucide-react";

export default function PackingChecklist({ tripId, checklist = [] }) {
  const storageKey = "trip_checklist_" + (tripId || "general");
  const [checkedMap, setCheckedMap] = useState({});
  const [activePhase, setActivePhase] = useState("all");

  // Normalize phases and items
  const normalizedPhases = checklist.map((p, idx) => {
    const title = p.title || (typeof p.phase === "string" ? p.phase : "Phase " + (p.phase || (idx + 1)));
    const rawItems = p.items || p.tasks || [];
    const items = rawItems.map((item, iIdx) => ({
      id: item.id || (idx + "_" + iIdx),
      text: item.text || item.title || "",
      desc: item.desc || "",
      defaultChecked: !!item.defaultChecked
    }));
    return {
      id: "phase_" + idx,
      title,
      badge: p.badge || null,
      items
    };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      } else {
        const initial = {};
        normalizedPhases.forEach((phase) => {
          phase.items.forEach((item) => {
            if (item.defaultChecked) initial[item.id] = true;
          });
        });
        setCheckedMap(initial);
      }
    } catch (e) {}
  }, [storageKey]);

  const toggleItem = (id) => {
    const next = { ...checkedMap, [id]: !checkedMap[id] };
    setCheckedMap(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const resetChecklist = () => {
    if (confirm("Reset all checkboxes in checklist?")) {
      const initial = {};
      normalizedPhases.forEach((phase) => {
        phase.items.forEach((item) => {
          if (item.defaultChecked) initial[item.id] = true;
        });
      });
      setCheckedMap(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  };

  // Totals
  let totalItems = 0;
  let checkedCount = 0;
  normalizedPhases.forEach((phase) => {
    phase.items.forEach((item) => {
      totalItems++;
      if (checkedMap[item.id]) checkedCount++;
    });
  });

  const percentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const filteredPhases = activePhase === "all"
    ? normalizedPhases
    : normalizedPhases.filter((p) => p.id === activePhase || p.title === activePhase);

  return (
    <div className="space-y-4">
      {/* Header & Progress Bar */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Interactive Packing & Gear Checklist</h4>
              <p className="text-[11px] text-slate-400">Offline-synced readiness tracker</p>
            </div>
          </div>

          <button
            onClick={resetChecklist}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all text-xs flex items-center gap-1"
            title="Reset Checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Readiness: <strong className="text-white">{checkedCount}</strong> / {totalItems} items
            </span>
            <strong className="text-emerald-400 font-bold">{percentage}% Packed</strong>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: percentage + "%" }}
            />
          </div>
        </div>
      </div>

      {/* Phase Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActivePhase("all")}
          className={"px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all " + (
            activePhase === "all"
              ? "bg-slate-800 text-amber-400 border border-amber-500/40"
              : "bg-slate-950 text-slate-400 border border-slate-800"
          )}
        >
          All Items ({totalItems})
        </button>
        {normalizedPhases.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePhase(p.id)}
            className={"px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all " + (
              activePhase === p.id
                ? "bg-slate-800 text-amber-400 border border-amber-500/40"
                : "bg-slate-950 text-slate-400 border border-slate-800"
            )}
          >
            {p.badge || p.title}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {filteredPhases.map((phase) => (
          <div key={phase.id} className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 font-mono">
                {phase.title}
              </h5>
              {phase.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {phase.badge}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {phase.items.map((item) => {
                const isChecked = !!checkedMap[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={"p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all select-none " + (
                      isChecked
                        ? "bg-emerald-950/20 border-emerald-500/30 text-slate-400"
                        : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-200"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className={"text-xs leading-relaxed " + (isChecked ? "line-through opacity-70" : "font-medium")}>
                        {item.text}
                      </p>
                      {item.desc && (
                        <p className="text-[11px] text-slate-400">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Calendar, Plane, Bus, Building, Calculator, ClipboardCheck, Volume2 } from "lucide-react";

export default function BottomNav({ activeTab, onTabChange, hasMobility, isFlight, hasVegDining, hasCurrency }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-darkborder px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => onTabChange("itinerary")}
          className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
            activeTab === "itinerary" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px]">Itinerary</span>
        </button>

        {hasMobility && (
          <button
            onClick={() => onTabChange("mobility")}
            className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
              activeTab === "mobility" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            {isFlight ? <Plane className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
            <span className="text-[10px]">{isFlight ? "Flights" : "Transit"}</span>
          </button>
        )}

        <button
          onClick={() => onTabChange("stays")}
          className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
            activeTab === "stays" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <Building className="w-4 h-4" />
          <span className="text-[10px]">Stays</span>
        </button>

        <button
          onClick={() => onTabChange("budget")}
          className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
            activeTab === "budget" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[10px]">Budget</span>
        </button>

        <button
          onClick={() => onTabChange("checklist")}
          className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
            activeTab === "checklist" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="text-[10px]">Checklist</span>
        </button>

        {hasVegDining && (
          <button
            onClick={() => onTabChange("dining")}
            className={"flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all " + (
              activeTab === "dining" ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px]">Veg</span>
          </button>
        )}
      </div>
    </nav>
  );
}

import React, { useState } from "react";
import { Volume2, VolumeX, Copy, Check, Utensils, MapPin, Sparkles } from "lucide-react";

export default function VegDiningAudio({ vegDining }) {
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!vegDining) return null;
  const phrases = vegDining.phrases || vegDining.vietnamesePhrases || [];
  const restaurants = vegDining.restaurants || [];

  const speakPhrase = (text, idx) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const copyPhrase = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Audio Survival Phrases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-darkborder">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Dietary & Veg Audio Survival Cards</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">1-Tap native pronunciation for waiters and street vendors</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phrases.map((p, idx) => {
            const badgeLabel = p.badge || (p.category === "diet" ? "Strict Pure Veg" : p.category === "jain" ? "Jain Strict" : "Dietary Note");
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/30">
                      {badgeLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyPhrase(p.vietnamese, idx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        title="Copy Phrase"
                      >
                        {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => speakPhrase(p.vietnamese, idx)}
                        className={"p-2 rounded-xl text-white font-bold transition-all shadow-md active:scale-95 " + (
                          speakingIdx === idx
                            ? "bg-rose-600 scale-105 shadow-rose-500/30"
                            : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                        )}
                        title="Speak Out Loud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-relaxed">
                    "{p.vietnamese}"
                  </p>
                  {p.phonetic && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                      🗣️ {p.phonetic}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Meaning</span>
                  {p.english}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Restaurants Directory */}
      {restaurants && restaurants.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-darkborder">
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Verified Pure Veg & Indian Restaurants</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {restaurants.map((r, idx) => (
              <div key={idx} className="bg-white dark:bg-darkcard p-3.5 rounded-2xl border border-slate-200 dark:border-darkborder shadow-xs space-y-2 hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</strong>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-1.5 py-0.5 rounded">
                    {r.city}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">{r.cuisine}</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{r.address}</p>
                {r.note && (
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/80 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    {r.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Download, X, Smartphone, CheckCircle, Share, MoreVertical, PlusSquare, ArrowRight } from "lucide-react";

export default function InstallPromptModal({ isOpen, onClose, onInstall, isIos, hasDeferredPrompt = false }) {
  const [platform, setPlatform] = useState(isIos ? "ios" : "android");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 text-center relative safe-area-bottom">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-emerald-500/20">
          <Smartphone className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-white font-display">Install Travel Architect App</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add to your home screen for full offline access in foreign countries, flights, and mountain trails without internet.
          </p>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setPlatform("ios")}
            className={`py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              platform === "ios"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🍏 iPhone (Safari)</span>
          </button>
          <button
            onClick={() => setPlatform("android")}
            className={`py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              platform === "android"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🤖 Android (Chrome)</span>
          </button>
        </div>

        {/* Key App Benefits Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-1.5 text-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>100% Offline Ready</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-1.5 text-teal-300">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-teal-400" />
            <span>No Roaming Data Needed</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-1.5 text-amber-300">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Full-Screen Phone View</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-1.5 text-indigo-300">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
            <span>1-Tap Instant Launch</span>
          </div>
        </div>

        {/* Step-by-Step Guidance */}
        {platform === "ios" ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Share className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Easy 3-step setup on iPhone:</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li>
                In Safari, tap the <strong>Share</strong> icon <Share className="w-3 h-3 inline text-amber-300" /> at the bottom of the screen.
              </li>
              <li>
                Scroll down in the menu and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3 h-3 inline text-emerald-400" />.
              </li>
              <li>
                Tap <strong>"Add"</strong> in the top-right corner. The app icon will appear right on your phone!
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <MoreVertical className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>On Android (Chrome / Samsung Internet):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>Tap the button below to install directly to your device.</li>
                <li>Or tap the <strong>three dots (⋮)</strong> in Chrome and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
              </ol>
            </div>
            <button
              onClick={onInstall}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen Now</span>
            </button>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
}

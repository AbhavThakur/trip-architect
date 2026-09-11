import React from "react";
import { Download, X, Smartphone, CheckCircle, Share } from "lucide-react";

export default function InstallPromptModal({ isOpen, onClose, onInstall, isIos }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-emerald-500/20">
          <Smartphone className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-black text-white font-display">Install Travel Architect</h3>
          <p className="text-xs text-slate-400 mt-1">
            Install to your home screen for full offline access in foreign countries and mountain trails without internet.
          </p>
        </div>

        {isIos ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Share className="w-4 h-4 text-amber-400" />
              <span>How to install on iPhone (Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>Tap the <strong>Share</strong> icon in the bottom Safari bar.</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (+).</li>
              <li>Tap <strong>"Add"</strong> in the top right corner.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>100% Offline Enabled & Zero Data Usage</span>
            </div>
            <button
              onClick={onInstall}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

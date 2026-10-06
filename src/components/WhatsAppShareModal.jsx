import React, { useState, useMemo } from "react";
import { X, Copy, Check, MessageCircle, ExternalLink, MapPin, Calendar, Sparkles, Download } from "lucide-react";
import { formatDayForWhatsApp, formatFullTripForWhatsApp, openWhatsAppShare, copyWhatsAppText } from "../utils/whatsappShare";

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  trip,
  days = [],
  initialDayNum = 1
}) {
  const [selectedDayTab, setSelectedDayTab] = useState(initialDayNum);
  const [copied, setCopied] = useState(false);

  // Sync initialDayNum when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedDayTab(initialDayNum);
      setCopied(false);
    }
  }, [isOpen, initialDayNum]);

  // Compute text based on active tab
  const messageText = useMemo(() => {
    if (!trip) return "";
    if (selectedDayTab === "all") {
      return formatFullTripForWhatsApp(trip);
    }
    const dayObj = days.find((d) => (d.day || d.dayNum) === selectedDayTab) || days[0];
    return formatDayForWhatsApp(dayObj, trip);
  }, [selectedDayTab, days, trip]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyWhatsAppText(messageText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadFile = () => {
    const rawTitle = trip?.title || "Trip";
    const filename = selectedDayTab === "all"
      ? `${rawTitle}_Master_Itinerary.txt`
      : `${rawTitle}_Day_${selectedDayTab}_Plan.txt`;
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = new Blob([messageText], { type: "text/plain;charset=utf-8" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  };

  const handleShare = () => {
    openWhatsAppShare(messageText);
  };

  const activeDayObj = selectedDayTab === "all" ? null : days.find((d) => (d.day || d.dayNum) === selectedDayTab);
  const stopCount = activeDayObj ? (activeDayObj.places || activeDayObj.events || []).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-darkcard w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-darkborder shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-darkborder flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c.969.541 1.838.835 2.809.835 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.767-5.771-5.767zm7.502 5.765c0 4.14-3.366 7.507-7.505 7.507-1.309 0-2.529-.336-3.606-.925l-4.422 1.159 1.18-4.306c-.689-1.127-1.079-2.457-1.079-3.882 0-4.141 3.366-7.508 7.506-7.508 4.14 0 7.506 3.367 7.506 7.508z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Share Day Plan on WhatsApp</span>
                <span className="text-[10px] uppercase font-black tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Formatted with Maps
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct Google Maps links & clean spacing after every point
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Day Selection Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-darkborder bg-slate-50/60 dark:bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedDayTab("all");
              setCopied(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedDayTab === "all"
                ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-darkborder hover:bg-slate-100"
            }`}
          >
            All Trip Summary
          </button>
          {days.map((d, idx) => {
            const dNum = d.day || d.dayNum || idx + 1;
            const isSelected = selectedDayTab === dNum;
            return (
              <button
                key={dNum}
                onClick={() => {
                  setSelectedDayTab(dNum);
                  setCopied(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-darkborder hover:bg-slate-100"
                }`}
              >
                <span>Day {dNum}</span>
                {d.title && (
                  <span className="opacity-75 font-normal text-[11px] truncate max-w-[80px]">
                    {d.title.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feature Highlights Pills */}
        <div className="px-5 py-2 bg-emerald-500/5 dark:bg-emerald-950/20 border-b border-emerald-500/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {selectedDayTab === "all"
                  ? "All daily basecamps & highlights included"
                  : `${stopCount} direct Google Maps links`}
              </span>
            </span>
            <span className="hidden sm:flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Double-spaced bullet blocks</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {messageText.length} characters
          </span>
        </div>

        {/* Formatted Message Preview Box */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto no-scrollbar space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              WhatsApp Message Preview:
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadFile}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                title="Download formatted text file (.txt)"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>Download .txt</span>
              </button>

              <button
                onClick={handleCopy}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-darkborder p-3.5 sm:p-4 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap shadow-inner leading-relaxed max-h-72 sm:max-h-80 overflow-y-auto select-all">
            {messageText}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-darkborder bg-white dark:bg-darkcard flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            💡 Tapping this opens WhatsApp with the message ready to send to your group or family.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-darkborder bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/30 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c.969.541 1.838.835 2.809.835 3.18 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.767-5.771-5.771-5.771zm7.502 5.765c0 4.14-3.366 7.507-7.505 7.507-1.309 0-2.529-.336-3.606-.925l-4.422 1.159 1.18-4.306c-.689-1.127-1.079-2.457-1.079-3.882 0-4.141 3.366-7.508 7.506-7.508 4.14 0 7.506 3.367 7.506 7.508z" />
              </svg>
              <span>Share on WhatsApp ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

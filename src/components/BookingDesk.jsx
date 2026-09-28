import React, { useState, useEffect } from "react";
import {
  Ticket, Bus, Hotel, Car, CheckCircle2, Clock, ExternalLink,
  Copy, Check, Calendar, MapPin, Sparkles, Navigation, AlertCircle,
  FileText, ShieldCheck, Download, ArrowRight, Share2, Info,
  Upload, Trash2, Eye, Loader2, FileCheck, Plane, X, Plus,
  Maximize2, ZoomIn, ZoomOut
} from "lucide-react";
import { uploadTicketPdf, deleteTicketPdf } from "../services/supabase";

export default function BookingDesk({ trip, isOpen = false, onClose = null, asTab = false, onSaveTrip = null }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New pass form state
  const [newPass, setNewPass] = useState({
    title: "",
    category: "flight",
    bookingRef: "",
    passenger: "",
    notes: "",
    url: ""
  });

  // Isolate trip identity strictly
  const tripId = trip?.id || "unspecified-trip";
  const storageKey = `travel_architect_tickets_${tripId}`;

  // Helper to merge local saved tickets with any official blueprint tickets
  const getMergedTickets = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((t) => t.id));
          const missingBlueprintTickets = (trip?.tickets || []).filter((t) => !existingIds.has(t.id));
          return [...missingBlueprintTickets, ...parsed];
        }
      }
    } catch (e) {}
    return trip?.tickets || [];
  };

  // Tickets state strictly initialized from active trip & local storage
  const [tickets, setTickets] = useState(getMergedTickets);

  // Sync state whenever the active trip changes (no cross-contamination!)
  useEffect(() => {
    setTickets(getMergedTickets());
  }, [storageKey, trip?.id, trip?.tickets]);

  // Persist tickets helper
  const persistTickets = (updatedTickets) => {
    setTickets(updatedTickets);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedTickets));
    } catch (e) {
      console.warn("Could not save tickets to localStorage", e);
    }
    if (onSaveTrip && trip) {
      onSaveTrip({
        ...trip,
        tickets: updatedTickets
      });
    }
  };

  const copyToClipboard = (text, key, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey(null);
      setToastMessage("");
    }, 2500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large (max 50MB).");
      return;
    }

    setUploading(true);
    setToastMessage(`Uploading ${file.name}...`);

    try {
      const uploadedDoc = await uploadTicketPdf(tripId, file);
      
      // Auto-categorize based on filename
      let category = "general";
      const lower = file.name.toLowerCase();
      if (lower.includes("flight") || lower.includes("air") || lower.includes("indigo") || lower.includes("vietjet") || lower.includes("boarding")) {
        category = "flight";
      } else if (lower.includes("hotel") || lower.includes("stay") || lower.includes("resort") || lower.includes("booking")) {
        category = "stay";
      } else if (lower.includes("train") || lower.includes("bus") || lower.includes("ksrtc") || lower.includes("irctc")) {
        category = "train";
      } else if (lower.includes("visa") || lower.includes("evisa") || lower.includes("passport")) {
        category = "visa";
      } else if (lower.includes("cruise") || lower.includes("tour") || lower.includes("pass")) {
        category = "activity";
      }

      const newTicketItem = {
        ...uploadedDoc,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        category,
        fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image")
      };

      const nextTickets = [newTicketItem, ...tickets];
      persistTickets(nextTickets);

      setToastMessage(`Saved ${file.name} to your Passes!`);
      setTimeout(() => setToastMessage(""), 3500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteTicket = async (ticket) => {
    if (!window.confirm(`Delete ticket "${ticket.title || ticket.name}"?`)) return;

    try {
      if (ticket.path && ticket.source === "supabase") {
        await deleteTicketPdf(ticket.path);
      }
      const nextTickets = tickets.filter((t) => t.id !== ticket.id);
      persistTickets(nextTickets);
      
      if (previewDoc?.id === ticket.id) {
        setPreviewDoc(null);
      }

      setToastMessage("Ticket removed.");
      setTimeout(() => setToastMessage(""), 2500);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddManualPass = (e) => {
    e.preventDefault();
    if (!newPass.title.trim()) {
      alert("Please enter a pass title.");
      return;
    }

    const manualItem = {
      id: "pass_" + Date.now(),
      title: newPass.title.trim(),
      category: newPass.category || "flight",
      bookingRef: newPass.bookingRef.trim(),
      passenger: newPass.passenger.trim(),
      notes: newPass.notes.trim(),
      url: newPass.url.trim() || null,
      fileType: newPass.url.trim().endsWith(".pdf") ? "application/pdf" : "custom",
      uploadedAt: new Date().toISOString(),
      source: "manual"
    };

    const nextTickets = [manualItem, ...tickets];
    persistTickets(nextTickets);
    setShowAddModal(false);
    setNewPass({
      title: "",
      category: "flight",
      bookingRef: "",
      passenger: "",
      notes: "",
      url: ""
    });

    setToastMessage(`Added "${manualItem.title}" to Passes!`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "flight":
        return { label: "Flight Ticket", bg: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Plane };
      case "stay":
        return { label: "Hotel / Stay", bg: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Hotel };
      case "train":
        return { label: "Train / Transit", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Bus };
      case "visa":
        return { label: "Visa / ID Pass", bg: "bg-purple-500/15 text-purple-400 border-purple-500/30", icon: ShieldCheck };
      case "activity":
        return { label: "Activity / Cruise", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30", icon: Ticket };
      default:
        return { label: "E-Pass", bg: "bg-slate-500/15 text-slate-300 border-slate-500/30", icon: FileText };
    }
  };

  const isPdf = (doc) => {
    if (!doc?.url) return false;
    if (doc.fileType === "application/pdf" || doc.fileType === "pdf") return true;
    if (typeof doc.url === "string" && (doc.url.startsWith("data:application/pdf") || doc.url.toLowerCase().includes(".pdf"))) return true;
    return false;
  };

  const isImage = (doc) => {
    if (!doc?.url) return false;
    if (doc.fileType && doc.fileType.startsWith("image/")) return true;
    if (typeof doc.url === "string" && (doc.url.startsWith("data:image/") || /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(doc.url))) return true;
    return false;
  };

  const content = (
    <div className="space-y-4">
      {/* Vault Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Passes & E-Ticket Vault
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {tickets.length} Saved
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Drop your boarding pass PDFs, hotel vouchers, and e-visas here for instant 1-tap offline preview.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Direct PDF / Image Upload */}
            <label className={"flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95 " + (uploading ? "opacity-50 pointer-events-none" : "")}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{uploading ? "Uploading..." : "Upload Ticket (PDF / Image)"}</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Add Manual Pass */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
              title="Add Pass by PNR or Confirmation Code"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="hidden xs:inline">Add PNR Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 bg-emerald-900 text-emerald-100 border border-emerald-500 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Passes Grid */}
      {tickets.length === 0 ? (
        <div className="bg-slate-900/60 dark:bg-darkcard border border-dashed border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-white">Your Ticket & Pass Vault is Empty</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Attach your flight boarding passes, hotel confirmations, train tickets, or e-visa documents. All files are securely saved on your device for instant offline preview at airport check-in desks.
          </p>
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition shadow-lg active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Upload Your First PDF or Image Pass</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tickets.map((t) => {
            const badge = getCategoryBadge(t.category);
            const BadgeIcon = badge.icon;
            const hasPreview = !!t.url;

            return (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between space-y-3.5 hover:border-emerald-500/40 transition shadow-sm hover:shadow-md group"
              >
                {/* Header: Category Badge & Size/Date */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1 ${badge.bg}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {t.size ? `${Math.round(t.size / 1024)} KB` : "Offline Pass"}
                    </span>
                  </div>

                  {/* Pass Title */}
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2.5 line-clamp-2 leading-snug">
                    {t.title || t.name}
                  </h4>

                  {/* Passenger / Traveler Name */}
                  {t.passenger && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <span>Traveler:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{t.passenger}</strong>
                    </div>
                  )}

                  {/* PNR / Booking Ref Highlight Box */}
                  {t.bookingRef && (
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                          PNR / Booking Reference
                        </span>
                        <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                          {t.bookingRef}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.bookingRef, `pnr-${t.id}`, "PNR")}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                        title="Copy PNR to clipboard"
                      >
                        {copiedKey === `pnr-${t.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* Optional Notes */}
                  {t.notes && (
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-900">
                      {t.notes}
                    </p>
                  )}
                </div>

                {/* Footer Action Buttons: Preview, Download, Delete */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  {hasPreview ? (
                    <button
                      onClick={() => setPreviewDoc(t)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Pass</span>
                    </button>
                  ) : (
                    <span className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 text-xs font-medium text-center">
                      No File Attached
                    </span>
                  )}

                  {t.url && (
                    <a
                      href={t.url}
                      download={t.name || `${t.title || "ticket"}.pdf`}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition"
                      title="Download document to device"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteTicket(t)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 👁️ IN-APP TICKET & PDF PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full h-[90vh] sm:h-[86vh] flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden">
            {/* Modal Header Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    {previewDoc.title || previewDoc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="uppercase font-mono text-emerald-400 font-bold">
                      {previewDoc.category || "Pass"}
                    </span>
                    {previewDoc.bookingRef && (
                      <span>• Ref: <strong className="font-mono text-white">{previewDoc.bookingRef}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {previewDoc.bookingRef && (
                  <button
                    onClick={() => copyToClipboard(previewDoc.bookingRef, "preview-pnr", "PNR")}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition"
                    title="Copy PNR code"
                  >
                    {copiedKey === "preview-pnr" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Copy PNR</span>
                  </button>
                )}

                {previewDoc.url && (
                  <a
                    href={previewDoc.url}
                    download={previewDoc.name || `${previewDoc.title || "ticket"}.pdf`}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition"
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {previewDoc.url && (
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition"
                    title="Open in new window / print"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white border border-slate-700 transition ml-1"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Direct In-App Viewer */}
            <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-auto flex flex-col items-center justify-center relative">
              {isPdf(previewDoc) ? (
                <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                  {/* PDF Navigation Bar */}
                  <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono truncate">
                      📄 Document Viewer • {previewDoc.name || previewDoc.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={previewDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open in New Tab</span>
                      </a>
                    </div>
                  </div>

                  {/* Embedded PDF Viewer with Object and Iframe Fallbacks */}
                  <div className="flex-1 w-full h-full relative bg-slate-950">
                    <object
                      data={previewDoc.url}
                      type="application/pdf"
                      className="w-full h-full border-0 bg-white"
                    >
                      <iframe
                        src={previewDoc.url}
                        title={previewDoc.title || "PDF Ticket Preview"}
                        className="w-full h-full border-0 bg-white"
                      >
                        <div className="p-8 text-center space-y-4">
                          <p className="text-sm text-slate-300">
                            Previewing this PDF file directly inside the browser.
                          </p>
                          <a
                            href={previewDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                          >
                            Open PDF Document
                          </a>
                        </div>
                      </iframe>
                    </object>
                  </div>
                </div>
              ) : isImage(previewDoc) ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title || "Ticket Preview"}
                    className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
                  />
                  <div className="mt-2 text-[11px] text-slate-400 font-mono">
                    Tap & hold to save image or use download button above
                  </div>
                </div>
              ) : (
                /* Fallback Clean Pass Viewer when no direct file */
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{previewDoc.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">
                      {previewDoc.category} Pass
                    </p>
                  </div>

                  {previewDoc.bookingRef && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                        Booking Reference / PNR
                      </span>
                      <strong className="text-xl font-mono text-emerald-400 tracking-wider block mt-1">
                        {previewDoc.bookingRef}
                      </strong>
                    </div>
                  )}

                  {previewDoc.passenger && (
                    <div className="text-xs text-slate-300">
                      Traveler: <strong>{previewDoc.passenger}</strong>
                    </div>
                  )}

                  {previewDoc.notes && (
                    <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {previewDoc.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD MANUAL PASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add New Pass / E-Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualPass} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pass Title / Route *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IndiGo 6E-676 (DEL to HAN)"
                  value={newPass.title}
                  onChange={(e) => setNewPass({ ...newPass, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={newPass.category}
                    onChange={(e) => setNewPass({ ...newPass, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                  >
                    <option value="flight">Flight ✈️</option>
                    <option value="stay">Hotel / Stay 🏨</option>
                    <option value="train">Train / Transit 🚆</option>
                    <option value="visa">Visa / ID 🛂</option>
                    <option value="activity">Activity / Tour 🎟️</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    PNR / Confirmation Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OB5L6J"
                    value={newPass.bookingRef}
                    onChange={(e) => setNewPass({ ...newPass, bookingRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Traveler Name / Seat
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sundeep & Family • Seat 12A-12C"
                  value={newPass.passenger}
                  onChange={(e) => setNewPass({ ...newPass, passenger: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes / Counter Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Terminal 3, counter opens 3h prior"
                  value={newPass.notes}
                  onChange={(e) => setNewPass({ ...newPass, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md active:scale-95 transition"
                >
                  Save Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Standalone tab view
  if (asTab) {
    return <div className="max-w-5xl mx-auto py-2">{content}</div>;
  }

  // Modal view
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-darkbg text-slate-900 dark:text-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-darkborder max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-darkborder">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Trip Passes & Tickets
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition"
            >
              ✕
            </button>
          )}
        </div>
        {content}
      </div>
    </div>
  );
}

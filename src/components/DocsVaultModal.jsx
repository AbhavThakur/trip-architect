import React, { useState } from "react";
import { Shield, Copy, Check, X, FileText, Lock } from "lucide-react";

export default function DocsVaultModal({ isOpen, onClose, docs = [] }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-left relative my-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white font-display">
                Family Travel Document Vault
              </h3>
              <p className="text-[11px] text-slate-400">Passports, E-Visas & Medical Policies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Travel Insurance Notice */}
        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-indigo-300 font-mono font-bold uppercase block">
              Group Travel Insurance
            </span>
            <strong className="text-white font-mono">Policy # TATA-AIG-VN-99421</strong>
          </div>
          <a href="tel:+912266603500" className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px]">
            Call TATA AIG ICE
          </a>
        </div>

        {/* Family Member Passports Table */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {docs.map((doc, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-white font-bold">{doc.name}</strong>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {doc.notes || "Verified"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Passport:</span>
                    <strong className="text-amber-300">{doc.passport}</strong>
                  </div>
                  <button
                    onClick={() => copyText(doc.passport, "p_" + idx)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy Passport Number"
                  >
                    {copiedId === "p_" + idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">E-Visa Code:</span>
                    <strong className="text-emerald-300">{doc.evisa}</strong>
                  </div>
                  <button
                    onClick={() => copyText(doc.evisa, "v_" + idx)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy E-Visa Code"
                  >
                    {copiedId === "v_" + idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

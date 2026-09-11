import React, { useState } from 'react';
import { Phone, Shield, Building2, Cross, AlertCircle, X } from 'lucide-react';

export default function EmergencySosModal({ isOpen, onClose, initialTab = 'india' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99998] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkborder pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-display">Emergency SOS & Medical ICE Vault</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">24x7</span>
              </div>
              <p className="text-[11px] text-slate-400">1-Tap Dialing, Nearest Verified Hospitals & Consular Hotlines</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-900 dark:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Region Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-center font-bold text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('india')}
            className={`py-2 rounded-lg transition-colors ${activeTab === 'india' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🇮🇳 India Domestic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vietnam')}
            className={`py-2 rounded-lg transition-colors ${activeTab === 'vietnam' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🇻🇳 Vietnam Intl
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('insurance')}
            className={`py-2 rounded-lg transition-colors ${activeTab === 'insurance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🛡️ Insurance & ICE
          </button>
        </div>

        {/* India Domestic Tab */}
        {activeTab === 'india' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">1-Tap Emergency Hotlines</span>
              <div className="grid grid-cols-2 gap-2">
                <a href="tel:112" className="p-3 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 rounded-xl flex items-center justify-between text-rose-300 font-bold">
                  <div>
                    <span className="block text-white text-sm">112</span>
                    <span className="text-[10px] text-slate-400">National All-in-One</span>
                  </div>
                  <span className="text-[10px] bg-rose-600 px-2 py-0.5 rounded text-white font-bold">DIAL</span>
                </a>
                <a href="tel:108" className="p-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 rounded-xl flex items-center justify-between text-amber-300 font-bold">
                  <div>
                    <span className="block text-white text-sm">108</span>
                    <span className="text-[10px] text-slate-400">Free Ambulance</span>
                  </div>
                  <span className="text-[10px] bg-amber-600 px-2 py-0.5 rounded text-white font-bold">DIAL</span>
                </a>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Chikmagalur Hospitals & 24x7 Chemist</span>
              <div className="space-y-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white text-xs block">Malnad Hospital & Rotary Blood Bank</strong>
                    <span className="text-[11px] text-slate-400 block">MG Road, Chikmagalur • ICU & 24x7 Casualty</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+91 8262 235555</span>
                  </div>
                  <a href="tel:+918262235555" className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">Call</a>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-300 text-xs block">24x7 Apollo Pharmacy (Near Tresca)</strong>
                    <span className="text-[11px] text-slate-400">RG Road, 250m walking distance from Tresca Hotel</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">24 Hours</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vietnam Intl Tab */}
        {activeTab === 'vietnam' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Vietnam Emergency Numbers</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <a href="tel:113" className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl block">
                  <span className="text-rose-400 text-base font-black block">113</span>
                  <span className="text-[10px] text-slate-400">Police</span>
                </a>
                <a href="tel:115" className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl block">
                  <span className="text-amber-400 text-base font-black block">115</span>
                  <span className="text-[10px] text-slate-400">Ambulance</span>
                </a>
                <a href="tel:114" className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl block">
                  <span className="text-blue-400 text-base font-black block">114</span>
                  <span className="text-[10px] text-slate-400">Fire / Rescue</span>
                </a>
              </div>
            </div>

            <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Embassy of India (Hanoi)
                </span>
                <span className="text-[10px] text-slate-400">Hoan Kiem</span>
              </div>
              <p className="text-[11px] text-slate-300">58-60 Tran Hung Dao, Hoan Kiem, Hanoi</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-emerald-400">24/7 SOS: +84 90 411 9694</span>
                <a href="tel:+84904119694" className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px]">Call</a>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Verified International JCI Hospitals</span>
              <div className="space-y-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white text-xs block">Hanoi French Hospital (Bệnh viện Việt Pháp)</strong>
                    <span className="text-[11px] text-slate-400 block">1 Phuong Mai, Dong Da, Hanoi • 24/7 ER</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+84 24 3577 1100</span>
                  </div>
                  <a href="tel:+842435771100" className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">Call ER</a>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-white text-xs block">Vinmec Danang International Hospital</strong>
                    <span className="text-[11px] text-slate-400 block">30 Thang 4, Hai Chau, Da Nang (Near Hoi An)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">+84 236 3711 111</span>
                  </div>
                  <a href="tel:+842363711111" className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">Call ER</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <div className="space-y-3.5">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Group Travel Insurance Policy
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">Active</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Policy Number:</span>
                  <strong className="text-white font-mono text-[11px]">BAGIC-TRV-89402174</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">TPA 24x7 Hotline:</span>
                  <strong className="text-emerald-400 font-mono text-[11px]">+91 124 617 4700</strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Notify TPA assistance within 24 hours of hospital admission. Keep passport, visa, and hospital admission bills handy.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-black text-white block">Medical ICE (Blood Groups)</span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-200">Delhi Parents:</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">Blood Groups: B+ & O+</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-200">Bengaluru Group:</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">Blood Groups: A+, O+, B+</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
          >
            Close SOS Vault
          </button>
        </div>
      </div>
    </div>
  );
}

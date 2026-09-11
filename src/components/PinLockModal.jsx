import React, { useState, useEffect } from 'react';
import { Shield, Delete, Lightbulb, Lock, Unlock } from 'lucide-react';

export default function PinLockModal({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(true);

  const DEFAULT_PIN_HASH = '158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab'; // '2026'

  async function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  useEffect(() => {
    const unlocked = sessionStorage.getItem('travel_architect_unlocked') === 'true';
    if (unlocked) {
      setIsLocked(false);
      if (onUnlock) onUnlock();
    }
  }, [onUnlock]);

  const handleDigit = async (d) => {
    if (pin.length < 4) {
      const nextPin = pin + d;
      setPin(nextPin);
      setError('');

      if (nextPin.length === 4) {
        const hash = await sha256(nextPin);
        const storedHash = localStorage.getItem('travel_architect_custom_pin_hash') || DEFAULT_PIN_HASH;
        if (hash === storedHash) {
          sessionStorage.setItem('travel_architect_unlocked', 'true');
          setIsLocked(false);
          if (onUnlock) onUnlock();
        } else {
          setError('Incorrect PIN. Please try again.');
          setTimeout(() => setPin(''), 400);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-7 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-display">Travel Architect Vault</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter 4-digit PIN to access private travel data</p>
          </div>
        </div>

        {/* 4 Dots */}
        <div className="flex justify-center items-center gap-3.5 py-1">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                idx < pin.length
                  ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)] scale-110'
                  : 'border-slate-600'
              }`}
            />
          ))}
        </div>

        {error && <div className="text-xs text-rose-400 font-bold">{error}</div>}

        {/* Virtual Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(String(num))}
              className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-lg shadow active:scale-95 transition-all border border-slate-700/60"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 font-bold text-xs active:scale-95 transition-all border border-slate-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-lg shadow active:scale-95 transition-all border border-slate-700/60"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-bold active:scale-95 transition-all border border-slate-800 flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => setError('Hint: Default master PIN is 2026')}
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Default PIN hint
          </button>
          <span className="text-[10px] text-slate-600">Encrypted SHA-256</span>
        </div>
      </div>
    </div>
  );
}

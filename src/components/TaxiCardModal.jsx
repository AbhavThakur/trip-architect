import React, { useState } from "react";
import { Car, Volume2, Phone, X, MapPin } from "lucide-react";

export default function TaxiCardModal({ isOpen, onClose }) {
  const [selectedCity, setSelectedCity] = useState("hanoi");
  const [speaking, setSpeaking] = useState(false);

  if (!isOpen) return null;

  const cards = {
    hanoi: {
      city: "Hanoi Old Quarter",
      name: "Khách sạn La Siesta Classic Mã Mây",
      address: "94 Mã Mây, Hàng Buồm, Quận Hoàn Kiếm, Hà Nội",
      landmark: "Gần Hồ Hoàn Kiếm & Chợ Đêm",
      phone: "+84 24 3926 3641",
      driverNote: "Làm ơn chở tôi đến khách sạn này ở Phố Cổ Mã Mây."
    },
    hoian: {
      city: "Hội An Ancient Town",
      name: "La Siesta Hội An Resort & Spa",
      address: "132 Hùng Vương, Phường Cẩm Phổ, TP. Hội An, Quảng Nam",
      landmark: "Gần Chùa Cầu & Phố Cổ Hội An",
      phone: "+84 235 3915 915",
      driverNote: "Làm ơn chở tôi đến resort La Siesta đường Hùng Vương."
    },
    danang: {
      city: "Đà Nẵng My Khe Beach",
      name: "Khách sạn TMS Hotel Da Nang Beach",
      address: "292 Võ Nguyên Giáp, Phường Mỹ An, Quận Ngũ Hành Sơn, Đà Nẵng",
      landmark: "Đối diện Bãi Biển Mỹ Khe",
      phone: "+84 236 3755 999",
      driverNote: "Làm ơn chở tôi đến khách sạn TMS mặt biển Võ Nguyên Giáp."
    }
  };

  const current = cards[selectedCity] || cards.hanoi;

  const speakVietnameseAddress = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.name + ", " + current.address);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-left relative my-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white font-display">
                Grab & Taxi Driver Address Card
              </h3>
              <p className="text-[11px] text-slate-400">Show your phone screen to the driver</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Switcher */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSelectedCity("hanoi")}
            className={"py-1.5 rounded-xl transition-all " + (selectedCity === "hanoi" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            Hà Nội
          </button>
          <button
            onClick={() => setSelectedCity("hoian")}
            className={"py-1.5 rounded-xl transition-all " + (selectedCity === "hoian" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            Hội An
          </button>
          <button
            onClick={() => setSelectedCity("danang")}
            className={"py-1.5 rounded-xl transition-all " + (selectedCity === "danang" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
          >
            Đà Nẵng
          </button>
        </div>

        {/* Giant Vietnamese Card for Taxi Drivers */}
        <div className="bg-white text-slate-950 rounded-2xl p-5 space-y-3 shadow-2xl border-4 border-amber-400">
          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-600">
            {current.city} • Điểm Đến (Destination)
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
            {current.name}
          </h2>

          <div className="space-y-1 pt-1 border-t border-slate-200">
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
              📍 {current.address}
            </p>
            <p className="text-xs text-slate-600">
              🏷️ {current.landmark}
            </p>
          </div>

          <p className="text-xs italic text-slate-600 pt-1 border-t border-slate-200">
            🗣️ "{current.driverNote}"
          </p>
        </div>

        {/* Action Buttons: Audio Pronounce & Call Front Desk */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={speakVietnameseAddress}
            disabled={speaking}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Volume2 className={"w-4 h-4 " + (speaking ? "animate-bounce" : "")} />
            <span>{speaking ? "Speaking..." : "Pronounce (VN)"}</span>
          </button>

          <a
            href={"tel:" + current.phone}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}

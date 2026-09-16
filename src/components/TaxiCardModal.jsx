import React, { useState, useEffect } from "react";
import { Car, Volume2, Phone, X, MapPin, Navigation, Building2, Compass } from "lucide-react";

export default function TaxiCardModal({ isOpen, onClose, customStop = null }) {
  const [selectedCity, setSelectedCity] = useState("custom");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (customStop) {
      setSelectedCity("custom");
    } else {
      setSelectedCity("hanoi");
    }
  }, [customStop, isOpen]);

  if (!isOpen) return null;

  const baseStays = {
    hanoi: {
      city: "Hà Nội Old Quarter",
      name: "Khách sạn Peridot Grand Luxury Boutique",
      nameEn: "Peridot Grand Luxury Boutique Hotel",
      address: "33 Đường Thành, Phường Cửa Đông, Quận Hoàn Kiếm, Hà Nội",
      landmark: "Khu Phố Cổ Hà Nội • Gần Nhà Thờ Lớn & Chợ Hàng Da",
      phone: "+84 24 3828 0099",
      driverNote: "Làm ơn chở tôi về khách sạn Peridot Grand, số 33 Đường Thành, Hoàn Kiếm.",
      coords: [21.0315, 105.8458]
    },
    danang: {
      city: "Đà Nẵng My Khe Beach",
      name: "Khách sạn TMS Hotel Da Nang Beach",
      nameEn: "TMS Hotel Da Nang Beach (Oceanfront)",
      address: "292 Võ Nguyên Giáp, Phường Mỹ An, Quận Ngũ Hành Sơn, Đà Nẵng",
      landmark: "Mặt tiền biển Mỹ Khe • Đối diện bãi tắm Mỹ An",
      phone: "+84 236 3755 999",
      driverNote: "Làm ơn chở tôi về khách sạn TMS mặt đường biển Võ Nguyên Giáp, Đà Nẵng.",
      coords: [16.0538, 108.2464]
    },
    hoian: {
      city: "Phố Cổ Hội An",
      name: "Phố Cổ Hội An & Bến Thuyền Đèn Lồng",
      nameEn: "Hoi An Ancient Town & Lantern Pier",
      address: "Đường Bạch Đằng / Trần Phú, Phường Minh An, TP. Hội An, Quảng Nam",
      landmark: "Gần Chùa Cầu Nhật Bản & Chợ Đêm Hội An",
      phone: "+84 235 3915 915",
      driverNote: "Làm ơn chở tôi đến cổng phố cổ Hội An đường Bạch Đằng.",
      coords: [15.8776, 108.3276]
    },
    halong: {
      city: "Vịnh Hạ Long / Tuần Châu",
      name: "Cảng Tàu Khách Quốc Tế Tuần Châu (Tàu Aqua Cruise)",
      nameEn: "Tuan Chau Marina (Aqua Cruise Lounge)",
      address: "Cảng Tàu Khách Quốc Tế Tuần Châu, TP. Hạ Long, Quảng Ninh",
      landmark: "Nhà chờ bến tàu Aqua Cruise Tuần Châu",
      phone: "+84 987 654 321",
      driverNote: "Làm ơn chở tôi đến Cảng tàu Tuần Châu đi tàu Aqua Cruise.",
      coords: [20.9312, 107.0125]
    }
  };

  let current;
  if (selectedCity === "custom" && customStop) {
    const coords = customStop.coords || (customStop.lat && customStop.lng ? [customStop.lat, customStop.lng] : null);
    current = {
      city: customStop.vietnamese ? "Điểm Hành Trình" : "Điểm Đến",
      name: customStop.vietnamese || customStop.name,
      nameEn: customStop.name,
      address: customStop.address || "Điểm tham quan tại Việt Nam",
      landmark: customStop.shoppingGem ? `🛍️ Mua sắm: ${customStop.shoppingGem}` : (customStop.insiderTip || "Điểm dừng trong lịch trình tour"),
      phone: customStop.phone || "+84 24 3828 0099",
      driverNote: `Làm ơn chở tôi đến: ${customStop.vietnamese || customStop.name}.`,
      coords: coords
    };
  } else {
    current = baseStays[selectedCity] || baseStays.danang;
  }

  const speakVietnameseAddress = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${current.name}. ${current.address}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "vi-VN";
    utterance.rate = 0.85;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const navUrl = current.coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${current.coords[0]},${current.coords[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.name + " " + current.address)}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder text-slate-900 dark:text-white rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl text-left relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
                Grab & Taxi Driver Address Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Show your screen to the Grab / Mai Linh taxi driver
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Switcher Pills */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {customStop && (
            <button
              onClick={() => setSelectedCity("custom")}
              className={`flex-1 min-w-[100px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                selectedCity === "custom"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Compass className="w-3 h-3" />
              <span className="truncate">{customStop.vietnamese ? customStop.vietnamese.split(" ")[0] : "Target Stop"}</span>
            </button>
          )}

          <button
            onClick={() => setSelectedCity("danang")}
            className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              selectedCity === "danang"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>TMS Đà Nẵng</span>
          </button>

          <button
            onClick={() => setSelectedCity("hanoi")}
            className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              selectedCity === "hanoi"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Peridot Hà Nội</span>
          </button>

          <button
            onClick={() => setSelectedCity("hoian")}
            className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              selectedCity === "hoian"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span>Hội An</span>
          </button>

          <button
            onClick={() => setSelectedCity("halong")}
            className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              selectedCity === "halong"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span>Hạ Long</span>
          </button>
        </div>

        {/* High-Contrast Vietnamese Card for Drivers */}
        <div className="bg-white text-slate-950 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-2xl border-4 border-amber-400 select-text">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-black text-amber-700">
              🇻🇳 {current.city} • ĐIỂM ĐẾN (DESTINATION)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              Show Driver
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
              {current.name}
            </h2>
            {current.nameEn && current.nameEn !== current.name && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {current.nameEn}
              </p>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                {current.address}
              </p>
            </div>
            {current.landmark && (
              <p className="text-xs text-slate-600 pl-5 leading-relaxed">
                {current.landmark}
              </p>
            )}
          </div>

          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs font-semibold text-amber-950">
            🗣️ Bác tài ơi: <span className="font-bold underline">"{current.driverNote}"</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
          <button
            onClick={speakVietnameseAddress}
            disabled={speaking}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${speaking ? "animate-bounce" : ""}`} />
            <span>{speaking ? "Speaking..." : "Pronounce (vi-VN)"}</span>
          </button>

          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>Google Maps</span>
          </a>

          <a
            href={`tel:${current.phone}`}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}

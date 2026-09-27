import React, { useState, useEffect } from "react";
import { Car, Volume2, Phone, X, MapPin, Navigation, Building2, Compass } from "lucide-react";

export default function TaxiCardModal({ isOpen, onClose, customStop = null, currentTrip = null }) {
  const isVietnam = currentTrip?.id?.includes("vietnam");
  const isHampi = currentTrip?.id?.includes("hampi");
  const isKarnataka = currentTrip?.destination?.toLowerCase().includes("karnataka") || isHampi || currentTrip?.id?.includes("chikmagalur");

  const [selectedCity, setSelectedCity] = useState("custom");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (customStop) {
      setSelectedCity("custom");
    } else {
      setSelectedCity(isVietnam ? "danang" : (isHampi ? "sanapur" : "stay"));
    }
  }, [customStop, isOpen, isVietnam]);

  if (!isOpen) return null;

  const vietnamStays = {
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

  const hampiStays = {
    stay: {
      city: "Sanapur, North Hampi",
      name: "Sri Durga Comfort Stay",
      nameEn: "Sri Durga Comfort Stay (Sanapur Boulders)",
      address: "Sunrise Road, Sanapur, Gangavathi Taluk, Karnataka - 583234",
      landmark: "ಶ್ರೀ ದುರ್ಗಾ ಕಂಫರ್ಟ್ ಸ್ಟೇ • 1.5 km to Sanapur Lake (Hosts Durga & Raj)",
      phone: "+91 63623 28833",
      driverNote: "ದಯವಿಟ್ಟು ನನ್ನನ್ನು ಸನಾಪುರದಲ್ಲಿರುವ ಶ್ರೀ ದುರ್ಗಾ ಕಂಫರ್ಟ್ ಸ್ಟೇ ಗೆ ಕರೆದೊಯ್ಯಿರಿ (Please take me to Sri Durga Comfort Stay, Sanapur).",
      coords: [15.3484108, 76.4364539]
    },
    rental: {
      city: "Munirabad Station",
      name: "Ravi Bike Rental Hampi",
      nameEn: "Ravi Bike Rental (Munirabad Railway Station)",
      address: "Shivapur Road, near Munirabad Station, Huligi Corridor",
      landmark: "ರವಿ ಬೈಕ್ ಬಾಡಿಗೆ • Opposite Munirabad Station (Linga Bhaiya)",
      phone: "+91 87928 58466",
      driverNote: "ದಯವಿಟ್ಟು ಮುನಿರಾಬಾದ್ ರೈಲ್ವೆ ನಿಲ್ದಾಣದ ಬಳಿ ಇರುವ ರವಿ ಬೈಕ್ ಬಾಡಿಗೆ ಬಳಿ ಕರೆದೊಯ್ಯಿರಿ.",
      coords: [15.3115739, 76.3381657]
    },
    bus_stand: {
      city: "Hosapete Town",
      name: "Hosapete Central Bus Stand",
      nameEn: "Hosapete KSRTC Central Bus Station (Platform 0)",
      address: "Station Road, Hosapete, Vijayanagara District - 583201",
      landmark: "ಹೊಸಪೇಟೆ ಕೇಂದ್ರ ಬಸ್ ನಿಲ್ದಾಣ • KSRTC Non AC Sleeper & Pallakki Boarding",
      phone: "+91 8394 220333",
      driverNote: "ದಯವಿಟ್ಟು ಹೊಸಪೇಟೆ ಕೆಎಸ್ಆರ್ಟಿಸಿ ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಕರೆದೊಯ್ಯಿರಿ (Please take me to Hosapete Central Bus Stand).",
      coords: [15.2713, 76.3888]
    },
    virupaksha: {
      city: "Hampi UNESCO Zone",
      name: "Virupaksha Temple / Bazaar",
      nameEn: "Sri Virupaksha Temple & Hampi Bazaar",
      address: "Main Temple Road, Hampi Bazaar, Vijayanagara - 583239",
      landmark: "ಶ್ರೀ ವಿರೂಪಾಕ್ಷ ದೇವಸ್ಥಾನ • Main 50m Temple Gopuram",
      phone: "+91 8394 241339",
      driverNote: "ದಯವಿಟ್ಟು ಹಂಪಿ ವಿರೂಪಾಕ್ಷ ದೇವಸ್ಥಾನದ ಪ್ರವೇಶ ದ್ವಾರಕ್ಕೆ ಕರೆದೊಯ್ಯಿರಿ.",
      coords: [15.3354, 76.4601]
    }
  };

  const genericStays = {
    stay: {
      city: currentTrip?.destination?.split(',')[0] || "Basecamp",
      name: currentTrip?.basecamp?.name || currentTrip?.stays?.[0]?.name || "Basecamp Hotel",
      nameEn: currentTrip?.basecamp?.name || currentTrip?.stays?.[0]?.name || "Basecamp Stay",
      address: currentTrip?.basecamp?.addressLocalScript || currentTrip?.basecamp?.location || currentTrip?.stays?.[0]?.address || "Basecamp address",
      landmark: currentTrip?.basecamp?.diningNote || "Main Accommodation",
      phone: currentTrip?.basecampContact || currentTrip?.stays?.[0]?.phone || "+91 99999 99999",
      driverNote: `Please take me to ${currentTrip?.basecamp?.name || "our hotel"}.`,
      coords: currentTrip?.basecamp?.coords || currentTrip?.mapCenter || null
    }
  };

  const tripStays = {};
  if (currentTrip?.stays) {
    if (Array.isArray(currentTrip.stays)) {
      currentTrip.stays.forEach((s, i) => {
        tripStays[`stay_${i}`] = {
          city: s.city || currentTrip?.destination?.split(',')[0] || "Stay",
          name: s.addressVi || s.addressLocalScript || s.name,
          nameEn: s.name,
          address: s.address || s.location || "",
          landmark: s.note || s.room || "Accommodation",
          phone: s.phone || currentTrip?.basecampContact || "",
          driverNote: isVietnam ? `Làm ơn chở tôi về khách sạn: ${s.name}.` : `Please take me to: ${s.name}.`,
          coords: s.coords || null
        };
      });
    } else if (typeof currentTrip.stays === "object") {
      Object.entries(currentTrip.stays).forEach(([k, s]) => {
        tripStays[k] = {
          city: s.city || currentTrip?.destination?.split(',')[0] || "Stay",
          name: s.addressVi || s.addressLocalScript || s.name,
          nameEn: s.name,
          address: s.address || s.location || "",
          landmark: s.note || s.room || "Accommodation",
          phone: s.phone || currentTrip?.basecampContact || "",
          driverNote: isVietnam ? `Làm ơn chở tôi về khách sạn: ${s.name}.` : `Please take me to: ${s.name}.`,
          coords: s.coords || null
        };
      });
    }
  }

  if (currentTrip?.basecamp && Object.keys(tripStays).length === 0) {
    tripStays.basecamp = {
      city: currentTrip?.destination?.split(',')[0] || "Basecamp",
      name: currentTrip.basecamp.addressLocalScript || currentTrip.basecamp.name,
      nameEn: currentTrip.basecamp.name,
      address: currentTrip.basecamp.location || currentTrip.basecamp.address || "",
      landmark: currentTrip.basecamp.diningNote || "Basecamp Stay",
      phone: currentTrip.basecampContact || "+91 112",
      driverNote: `Please take me to ${currentTrip.basecamp.name}.`,
      coords: currentTrip.basecamp.coords || null
    };
  }

  const baseStays = Object.keys(tripStays).length > 0
    ? tripStays
    : (isVietnam ? vietnamStays : (isHampi ? hampiStays : genericStays));

  let current;
  if (selectedCity === "custom" && customStop) {
    const coords = customStop.coords || (customStop.lat && customStop.lng ? [customStop.lat, customStop.lng] : null);
    const localName = customStop.addressLocalScript || customStop.localScript || customStop.kannada || customStop.vietnamese || customStop.name;
    current = {
      city: customStop.category ? customStop.category.toUpperCase() : "TARGET STOP",
      name: localName,
      nameEn: customStop.name,
      address: customStop.address || `${customStop.name}, ${currentTrip?.destination || ""}`,
      landmark: customStop.shoppingGem ? `🛍️ Tip: ${customStop.shoppingGem}` : (customStop.insiderTip || customStop.desc || "Expedition Stop"),
      phone: customStop.phone || currentTrip?.emergencyContacts?.[0]?.phone || "+91 112",
      driverNote: isVietnam
        ? `Làm ơn chở tôi đến: ${localName}.`
        : isKarnataka
        ? `ದಯವಿಟ್ಟು ಇಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯಿರಿ: ${customStop.name}. (Please take me to ${customStop.name}.)`
        : `Please take me to: ${customStop.name}.`,
      coords: coords
    };
  } else {
    current = baseStays[selectedCity] || Object.values(baseStays)[0] || {
      city: currentTrip?.destination || "Destination",
      name: currentTrip?.title || "Trip Location",
      nameEn: currentTrip?.title || "Trip Location",
      address: currentTrip?.destination || "Basecamp",
      landmark: "Basecamp",
      phone: "",
      driverNote: `Please take me to: ${currentTrip?.title || "our stay"}`,
      coords: null
    };
  }

  const speakAddress = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${current.name}. ${current.address}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isVietnam ? "vi-VN" : "en-IN";
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
                Taxi & Auto Driver Address Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Show your screen to the local driver or auto rickshaw
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
              className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                selectedCity === "custom"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Compass className="w-3 h-3" />
              <span className="truncate">{customStop.name?.split(" ")[0] || "Target"}</span>
            </button>
          )}

          {Object.entries(baseStays).map(([key, stay]) => (
            <button
              key={key}
              onClick={() => setSelectedCity(key)}
              className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                selectedCity === key
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span className="truncate">{stay.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* High-Contrast Card for Drivers */}
        <div className="bg-white text-slate-950 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-2xl border-4 border-amber-400 select-text">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-mono font-black text-amber-700">
              {isVietnam ? `🇻🇳 ${current.city} • ĐIỂM ĐẾN` : `🚖 ${current.city} • DESTINATION / DROP POINT`}
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
            {isVietnam ? "🗣️ Bác tài ơi:" : "🗣️ Driver / Auto Note:"} <span className="font-bold underline">"{current.driverNote}"</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
          <button
            onClick={speakAddress}
            disabled={speaking}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${speaking ? "animate-bounce" : ""}`} />
            <span>{speaking ? "Speaking..." : (isVietnam ? "Pronounce (vi-VN)" : "Speak Aloud")}</span>
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
            href={`tel:${current.phone?.replace(/[^0-9+]/g, '')}`}
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

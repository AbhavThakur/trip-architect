import React, { useState } from "react";
import { AlertTriangle, X, Phone, Share2, MapPin, Check } from "lucide-react";

export default function LostSosModal({ isOpen, onClose, trip = null }) {
  if (!isOpen) return null;
  const [copied, setCopied] = useState(false);

  const isVietnam = trip?.id?.includes("vietnam");
  const isKarnataka = trip?.destination?.toLowerCase().includes("karnataka") || trip?.id?.includes("hampi") || trip?.id?.includes("chikmagalur");

  const hotelName = isVietnam
    ? (trip?.hotels?.hanoi?.name || trip?.basecamp?.name || "Peridot Grand Luxury Boutique Hotel Hanoi")
    : (trip?.basecamp?.name || trip?.stays?.[0]?.name || `${trip?.title || "Trip"} Basecamp`);

  const hotelAddress = isVietnam
    ? (trip?.hotels?.hanoi?.addressVi || trip?.basecamp?.address || "33 Đường Thành, Cửa Đông, Hoàn Kiếm, Hà Nội")
    : (trip?.basecamp?.addressLocalScript || trip?.stays?.[0]?.addressLocalScript || trip?.basecamp?.location || trip?.stays?.[0]?.address || trip?.destination || "Basecamp Address");

  const hotelPhone = isVietnam
    ? (trip?.hotels?.hanoi?.phone || trip?.basecamp?.phone || "+84 24 3828 0099")
    : (trip?.stays?.[0]?.phone || trip?.basecampContact || trip?.basecamp?.phone || "+91 99999 99999");

  const policePhone = isVietnam ? "113" : "112";

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const url = `https://wa.me/?text=${encodeURIComponent(`🚨 Family SOS: I am lost! My live Google Maps location is https://maps.google.com/?q=${lat},${lng}`)}`;
          window.open(url, "_blank");
        },
        () => {
          const url = `https://wa.me/?text=${encodeURIComponent("🚨 Family SOS: I am lost! Please call my phone immediately or meet me at the hotel.")}`;
          window.open(url, "_blank");
        }
      );
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent("🚨 Family SOS: I am lost! Please call my phone immediately or meet me at the hotel.")}`;
      window.open(url, "_blank");
    }
  };

  const copyAddress = () => {
    let text = "";
    if (isVietnam) {
      text = `Tôi bị lạc, xin hãy giúp tôi liên lạc với khách sạn ${hotelName} (${hotelAddress} - Điện thoại: ${hotelPhone}) hoặc gia đình tôi!`;
    } else if (isKarnataka) {
      text = `ನಾನು ಪ್ರವಾಸಿ, ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನನ್ನ ಹೋಟೆಲ್ ${hotelName} (${hotelAddress} - ದೂರವಾಣಿ: ${hotelPhone}) ಅಥವಾ ನನ್ನ ಕುಟುಂಬವನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡಿ!`;
    } else {
      text = `I am a traveler and I am lost. Please help me contact my hotel ${hotelName} (${hotelAddress} - Phone: ${hotelPhone}) or my family!`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/90 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkborder pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 text-slate-900 dark:text-white flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Emergency SOS Beacon</h3>
              <p className="text-[10px] text-rose-300 font-bold">
                {isVietnam ? "Lost in Vietnam • Show Screen to Locals" : `${trip?.destination?.split(',')[0] || "Expedition"} SOS • Show Screen to Locals / Driver`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Local Text Card to Show to Locals */}
        <div className="bg-white text-slate-950 p-4 rounded-2xl shadow-inner space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
            {isVietnam ? "Xin Hãy Giúp Đỡ Tôi (Please Help Me)" : isKarnataka ? "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ (Please Help Me)" : "PLEASE HELP ME (I AM LOST)"}
          </span>
          <p className="text-base sm:text-lg font-black leading-snug">
            {isVietnam
              ? '"Tôi là du khách nước ngoài và đang bị lạc. Xin vui lòng giúp tôi gọi cho khách sạn hoặc người nhà của tôi."'
              : isKarnataka
              ? '"ನಾನು ಪ್ರವಾಸಿ, ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನನ್ನ ಹೋಟೆಲ್ ಅಥವಾ ಕುಟುಂಬವನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡಿ."'
              : '"I am a visiting traveler and I am lost. Please help me call my hotel or my family."'}
          </p>
          {(isVietnam || isKarnataka) && (
            <p className="text-xs text-slate-600 italic">
              "I am a visiting traveler and I am lost. Please help me call my hotel or my family."
            </p>
          )}
          <div className="pt-2 border-t border-slate-200 text-xs">
            <strong className="block text-slate-900 font-bold">
              {isVietnam ? "Khách Sạn Của Tôi (My Basecamp Stay):" : isKarnataka ? "ನನ್ನ ಹೋಟೆಲ್ (My Basecamp Stay):" : "My Basecamp Hotel:"}
            </strong>
            <p className="text-slate-800 text-xs font-bold mt-0.5">
              {hotelName}
            </p>
            <p className="text-slate-600 text-[11px] font-semibold mt-0.5 font-mono">
              {hotelAddress}
            </p>
            <p className="text-slate-900 font-mono font-bold mt-1">
              {isVietnam ? "Điện thoại" : isKarnataka ? "ದೂರವಾಣಿ" : "Phone"}: {hotelPhone}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={shareLocation}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share Live GPS Location to Family WhatsApp
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${hotelPhone.replace(/[^0-9+]/g, '')}`}
              className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Hotel ({hotelPhone})
            </a>
            <a
              href={`tel:${policePhone}`}
              className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Call Police ({policePhone})
            </a>
          </div>

          <button
            onClick={copyAddress}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MapPin className="w-3.5 h-3.5" />}
            {copied ? "Address Copied!" : (isVietnam ? "Copy Hotel Address in Vietnamese" : "Copy Hotel Address in Local Script")}
          </button>
        </div>
      </div>
    </div>
  );
}

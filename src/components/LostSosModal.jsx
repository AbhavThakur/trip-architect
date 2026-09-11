import React, { useState } from "react";
import { AlertTriangle, X, Phone, Share2, MapPin, Check } from "lucide-react";

export default function LostSosModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [copied, setCopied] = useState(false);

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

  const copyVietnamese = () => {
    const text = "Tôi bị lạc, xin hãy giúp tôi liên lạc với khách sạn La Siesta Classic (94 phố Mã Mây, Hoàn Kiếm, Hà Nội - Điện thoại: +84 24 3926 3641) hoặc gia đình tôi!";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-rose-950/90 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-wider">Emergency SOS Beacon</h3>
              <p className="text-[10px] text-rose-300 font-bold">Lost in Vietnam • Show Screen to Locals</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Vietnamese Text Card to Show to Locals */}
        <div className="bg-white text-slate-950 p-4 rounded-2xl shadow-inner space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block">
            Xin Hãy Giúp Đỡ Tôi (Please Help Me)
          </span>
          <p className="text-base sm:text-lg font-black leading-snug">
            "Tôi là du khách nước ngoài và đang bị lạc. Xin vui lòng giúp tôi gọi cho khách sạn hoặc người nhà của tôi."
          </p>
          <div className="pt-2 border-t border-slate-200 text-xs">
            <strong className="block text-slate-900 font-bold">Khách sạn của tôi (My Hotel):</strong>
            <p className="text-slate-700 text-xs font-semibold">
              La Siesta Classic — 94 Mã Mây, Hoàn Kiếm, Hà Nội
            </p>
            <p className="text-slate-900 font-mono font-bold mt-1">
              Điện thoại (Phone): +84 24 3926 3641
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
              href="tel:+842439263641"
              className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Hotel Front Desk
            </a>
            <a
              href="tel:113"
              className="py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Call Police (113)
            </a>
          </div>

          <button
            onClick={copyVietnamese}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MapPin className="w-3.5 h-3.5" />}
            {copied ? "Vietnamese Copied!" : "Copy Hotel Address in Vietnamese"}
          </button>
        </div>
      </div>
    </div>
  );
}

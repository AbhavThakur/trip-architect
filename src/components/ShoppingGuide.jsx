import React, { useState } from "react";
import {
  ShoppingBag, Calculator, Sparkles, CheckCircle2, AlertTriangle,
  ArrowRight, Volume2, Search, Filter, Percent, ShieldCheck, Tag, X,
  MapPin, Lightbulb
} from "lucide-react";

export default function ShoppingGuide({ shopping = [] }) {
  const [askingPriceVnd, setAskingPriceVnd] = useState(800000);
  const [discountPercent, setDiscountPercent] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // VAT Calculator State
  const [vatPurchaseVnd, setVatPurchaseVnd] = useState(3500000);

  // Currency rate: 1 INR ≈ 303 VND (1 VND ≈ 0.0033 INR)
  const VND_TO_INR_RATE = 0.0033;

  // Counter offer calculations
  const offerVnd = Math.round(askingPriceVnd * (discountPercent / 100));
  const offerInr = Math.round(offerVnd * VND_TO_INR_RATE);
  const savingsVnd = askingPriceVnd - offerVnd;
  const savingsInr = Math.round(savingsVnd * VND_TO_INR_RATE);

  // VAT calculations (8.5% net refund after admin fee)
  const isVatEligible = vatPurchaseVnd >= 2000000;
  const vatRefundVnd = isVatEligible ? Math.round(vatPurchaseVnd * 0.085) : 0;
  const vatRefundInr = Math.round(vatRefundVnd * VND_TO_INR_RATE);

  const quickPresets = [150000, 300000, 500000, 800000, 1200000, 2000000, 3000000];

  // Vietnamese bargaining phrases
  const bargainingPhrases = [
    {
      vietnamese: "Bao nhiêu tiền?",
      phonetic: "Bow nyew tyen?",
      english: "How much does this cost?",
      tag: "Opening"
    },
    {
      vietnamese: "Đắt quá!",
      phonetic: "Dat kwah!",
      english: "Too expensive! (Express surprise)",
      tag: "Reaction"
    },
    {
      vietnamese: "Bớt cho tôi đi!",
      phonetic: "Buht chaw toy dee!",
      english: "Please give me a discount!",
      tag: "Bargain"
    },
    {
      vietnamese: "Năm mươi phần trăm nhé!",
      phonetic: "Nahm moy fahn trahm nyeh!",
      english: "50 percent okay?",
      tag: "Counter"
    },
    {
      vietnamese: "Tôi mua hai cái, tính rẻ hơn nhé?",
      phonetic: "Toy moo-ah high kye, ting reh huhn nyeh?",
      english: "I'll buy two, can you give a better price?",
      tag: "Bundle"
    },
    {
      vietnamese: "Không được thì thôi, tôi đi nhé!",
      phonetic: "Khawng doo-uhk tee toy, toy dee nyeh!",
      english: "If not, that's okay, I'm walking away!",
      tag: "Walkaway"
    },
    {
      vietnamese: "Có thanh toán bằng thẻ không?",
      phonetic: "Caw tan twan bahng theh khawng?",
      english: "Do you accept credit card?",
      tag: "Payment"
    },
    {
      vietnamese: "Có tính phí quẹt thẻ không?",
      phonetic: "Caw ting fee kwet theh khawng?",
      english: "Is there an extra card surcharge? (Usually 3%)",
      tag: "Payment"
    }
  ];

  const playVietnameseAudio = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get distinct categories
  const categories = ["all", ...new Set(shopping.map((s) => s.category).filter(Boolean))];

  // Filter shopping items
  const filteredShopping = shopping.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCat = (item.category || "").toLowerCase().includes(q);
      const matchItems = (item.items || "").toLowerCase().includes(q);
      const matchLoc = (item.location || "").toLowerCase().includes(q);
      const matchRule = (item.rule || "").toLowerCase().includes(q);
      return matchCat || matchItems || matchLoc || matchRule;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Street Bargaining Counter Hero Card - Clean White Background */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono border border-pink-200 dark:border-pink-800">
                Market Counter Tool
              </span>
              <span className="text-[11px] text-pink-600 dark:text-pink-400 font-mono font-bold">
                1 INR ≈ 303 VND
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Street Bargaining Calculator & Counter-Offer Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
              Vendors at Hàng Dầu (shoes), Night Markets, and Han Market quote 2x–3x. Choose your negotiation strategy level and quote your target offer with confidence.
            </p>
          </div>

          {/* Interactive Counter Box */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shrink-0 shadow-2xs min-w-[320px]">
            {/* Input & Target Output */}
            <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-mono block font-bold">
                  Seller Asks (VND)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={askingPriceVnd}
                    onChange={(e) => setAskingPriceVnd(Math.max(0, Number(e.target.value) || 0))}
                    step="50000"
                    className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-right focus:outline-none focus:border-pink-500 transition-colors shadow-2xs"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">₫</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right font-mono font-medium">
                  ≈ ₹{Math.round(askingPriceVnd * VND_TO_INR_RATE).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-mono block font-bold">
                  You Offer ({discountPercent}%)
                </label>
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl px-3.5 py-1.5 shadow-2xs">
                  <div className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    {offerVnd.toLocaleString("en-US")} ₫
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-300 font-mono font-bold">
                    ≈ ₹{offerInr.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="text-[11px] text-pink-600 dark:text-pink-400 font-bold font-mono">
                  Save {100 - discountPercent}% (₹{savingsInr.toLocaleString("en-IN")})
                </div>
              </div>
            </div>

            {/* Aggression level buttons */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Counter-Offer Strategy:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDiscountPercent(40)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                    discountPercent === 40
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="block text-xs font-mono">40% Offer</span>
                  <span className="text-[9px] block opacity-90">Tough Stalls</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountPercent(50)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                    discountPercent === 50
                      ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="block text-xs font-mono">50% Golden</span>
                  <span className="text-[9px] block opacity-90">Standard Rule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountPercent(60)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                    discountPercent === 60
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="block text-xs font-mono">60% Gentle</span>
                  <span className="text-[9px] block opacity-90">Cashews & Silk</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="pt-1">
              <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block mb-1">Common Quotes:</span>
              <div className="grid grid-cols-7 gap-1">
                {quickPresets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setAskingPriceVnd(val)}
                    className="bg-white dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-pink-700 py-1.5 rounded-lg text-[10px] font-mono font-bold border border-slate-200 dark:border-slate-700 transition-all text-center shadow-2xs"
                  >
                    {val >= 1000000 ? (val / 1000000) + "M" : (val / 1000) + "k"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tactical Bargaining Phrases & Audio Speak Deck - Clean White Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-sm text-slate-900 dark:text-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">Vietnamese Market Bargaining Phrases</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Tap the speaker icon to play native pronunciation to the seller</p>
            </div>
          </div>
          <span className="text-[10px] bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-pink-200 dark:border-pink-800">
            8 Audio Cards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {bargainingPhrases.map((phrase, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-pink-500/50 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                    {phrase.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => playVietnameseAudio(phrase.vietnamese)}
                    className="p-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-xs transition-transform active:scale-95"
                    title="Speak phrase"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-white block font-sans">
                  {phrase.vietnamese}
                </strong>
                <span className="text-[11px] text-pink-600 dark:text-pink-400 font-mono font-bold block mt-0.5">
                  "{phrase.phonetic}"
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-2.5 border-t border-slate-200 dark:border-slate-700 pt-2 leading-snug">
                {phrase.english}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The 5 Golden Rules of Vietnam Market Bargaining */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-sm text-slate-900 dark:text-white">
        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          The 5 Golden Rules of Street Bargaining in Vietnam
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-pink-700 dark:text-pink-400 font-mono font-bold block text-[10px]">Rule 1 • The 50% Anchor</span>
            <strong className="text-slate-900 dark:text-white block font-bold text-xs">Start at 50%</strong>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              At Hàng Dầu & night markets, always counter with half. You will usually settle around 60–65% of the original quote.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-amber-700 dark:text-amber-400 font-mono font-bold block text-[10px]">Rule 2 • The Walkaway</span>
            <strong className="text-slate-900 dark:text-white block font-bold text-xs">Walkaway Bluff</strong>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              If the vendor declines, smile, say <em>"Cảm ơn"</em> (thank you) and take 3 steps away. 80% of stalls call you back immediately!
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-rose-700 dark:text-rose-400 font-mono font-bold block text-[10px]">Rule 3 • Morning Luck</span>
            <strong className="text-slate-900 dark:text-white block font-bold text-xs">Mở Hàng Etiquette</strong>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Never bargain aggressively before 9 AM or with the day's first vendor if not buying; locals believe it affects their whole day's fortune.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold block text-[10px]">Rule 4 • Cash is King</span>
            <strong className="text-slate-900 dark:text-white block font-bold text-xs">Avoid 3% Card Fee</strong>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Market merchants charge a 3% swipe fee on Visa/Mastercard. Cash in crisp VND bills gets you immediate price cuts.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-indigo-700 dark:text-indigo-400 font-mono font-bold block text-[10px]">Rule 5 • Bundle Up</span>
            <strong className="text-slate-900 dark:text-white block font-bold text-xs">Group Buying Power</strong>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Traveling as a group of 5? Pick 3–4 pairs of shoes or 5 silk scarves at the same stall for immediate wholesale pricing.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Interactive Airport 8.5% VAT Tax Refund Calculator - Clean White Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm text-slate-900 dark:text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono border border-indigo-200 dark:border-indigo-800">
              Airport Cash Rebate
            </span>
            <h4 className="text-base font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Airport 8.5% VAT Tax Refund Calculator (Noi Bai T2 & Da Nang)
            </h4>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <label className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-mono font-bold block">Bill Amount (VND)</label>
              <input
                type="number"
                value={vatPurchaseVnd}
                onChange={(e) => setVatPurchaseVnd(Math.max(0, Number(e.target.value) || 0))}
                step="500000"
                className="w-32 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-right focus:border-indigo-500 outline-none shadow-2xs"
              />
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="text-right">
              <label className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-mono block font-bold">
                Cash Refund (8.5%)
              </label>
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {vatRefundVnd.toLocaleString("en-US")} ₫
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold">
                ≈ ₹{vatRefundInr.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-amber-700 dark:text-amber-400 font-mono font-bold">Step 1 • In Store</strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold">
                Min 2M VND
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
              Present your original Indian passport when buying gadgets at FPT Shop, TopZone, or silk at Khai Silk. Ask for the green <em>"VAT Refund Declaration Form"</em> with store stamp.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-indigo-700 dark:text-indigo-400 font-mono font-bold">Step 2 • Customs Inspection</strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono font-bold">
                Pillar 10 T2
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
              At Noi Bai HAN T2 Departure Hall (3rd floor, before security), locate Customs Inspection Counter next to Pillar 10. Present passport, tax invoice, and unopened items for physical stamp.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">Step 3 • Cash Collection</strong>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                USD or VND
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
              Pass immigration and security to the international boarding area. Visit the BIDV / Vietcombank refund counter to collect your 8.5% net cash payout in clean USD or VND!
            </p>
          </div>
        </div>
      </div>

      {/* 5. Master Curated Vietnam Shopping Gems Directory - Clean White Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5 sm:p-6 text-slate-900 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Master Shopping Directory (Hanoi • Hoi An • Da Nang)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Verified genuine items, fair local market target prices, and quality testing rules
              </p>
            </div>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sneakers, silk, cashews..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-pink-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all capitalize border ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? `All Items (${shopping.length})` : cat}
            </button>
          ))}
        </div>

        {/* Gems Table with Balanced Fixed Width Columns */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-xs text-left table-fixed min-w-[920px] divide-y divide-slate-200 dark:divide-slate-800">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[23%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono font-black tracking-wider">
              <tr>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Recommended Items</th>
                <th className="py-3 px-3.5">Best Verified Location</th>
                <th className="py-3 px-3.5">Target Fair Price</th>
                <th className="py-3 px-3.5">Quality & Bargaining Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredShopping.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                    No shopping items match "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredShopping.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-3.5 align-top">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/70 border border-pink-200 dark:border-pink-800/60 text-pink-800 dark:text-pink-300 font-bold text-[10px] leading-tight">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug break-words">
                        {item.items}
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="flex items-start gap-1 text-slate-700 dark:text-slate-300 text-xs font-medium leading-relaxed break-words">
                        <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      {item.price && item.price.includes("|") ? (
                        <div className="space-y-1.5">
                          {item.price.split("|").map((segment, sIdx) => {
                            const parts = segment.split(":");
                            if (parts.length === 2) {
                              return (
                                <div key={sIdx} className="bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
                                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold block leading-tight">{parts[0].trim()}</span>
                                  <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs block leading-tight">{parts[1].trim()}</span>
                                </div>
                              );
                            }
                            return (
                              <div key={sIdx} className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-xs leading-snug break-words">
                                {segment.trim()}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/50">
                          <div className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm leading-snug break-words">
                            {item.price}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 break-words flex items-start gap-1.5 font-medium">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item.rule}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

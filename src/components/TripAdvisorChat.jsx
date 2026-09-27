import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, HelpCircle, Shield, Utensils, Bus, Receipt } from "lucide-react";

export default function TripAdvisorChat({ currentTrip }) {
  const isVietnam = currentTrip?.id?.includes("vietnam");
  const isHampi = currentTrip?.id?.includes("hampi");
  const isChikmagalur = currentTrip?.id?.includes("chikmagalur");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: isVietnam
        ? "Xin chào! I am your Vietnam On-Ground Expedition Advisor. Ask me anything about pure-veg food, private limousines, airport VAT refunds, or senior parent comfort."
        : isHampi
        ? "Namaste! I am your Hampi On-Ground Expedition Advisor. Ask me anything about KSRTC sleeper buses, boulder basecamp stays, ASI monument passes, or sunrise hill climbs."
        : isChikmagalur
        ? "Namaste! I am your Chikmagalur Expedition Advisor. Ask me anything about Mullayanagiri peak trekking, Tresca hotel logistics, 125cc scooty rentals, or pure coffee shopping."
        : `Hello! I am your ${currentTrip?.title || "Expedition"} Advisor. Ask me anything about ${currentTrip?.destination || "the trip"}, basecamp logistics, itinerary stops, or emergency helplines.`
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Sync welcome message on trip change
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: isVietnam
          ? "Xin chào! I am your Vietnam On-Ground Expedition Advisor. Ask me anything about pure-veg food, private limousines, airport VAT refunds, or senior parent comfort."
          : isHampi
          ? "Namaste! I am your Hampi On-Ground Expedition Advisor. Ask me anything about KSRTC sleeper buses, boulder basecamp stays, ASI monument passes, or sunrise hill climbs."
          : isChikmagalur
          ? "Namaste! I am your Chikmagalur Expedition Advisor. Ask me anything about Mullayanagiri peak trekking, Tresca hotel logistics, 125cc scooty rentals, or pure coffee shopping."
          : `Hello! I am your ${currentTrip?.title || "Expedition"} Advisor. Ask me anything about ${currentTrip?.destination || "the trip"}, basecamp logistics, itinerary stops, or emergency helplines.`
      }
    ]);
  }, [currentTrip?.id]);

  const quickQuestions = isVietnam ? [
    { label: "🥗 Pure Veg Food", query: "Where are the best pure veg restaurants in Hanoi and Hoi An?" },
    { label: "🚗 DCar Limousines", query: "How do our private 9-seater limousine transfers work?" },
    { label: "💵 Airport VAT Refund", query: "How do I claim the 8.5% VAT cash refund at Noi Bai airport?" },
    { label: "👴 Senior Comfort", query: "What are the senior comfort tips for parents at Marble Mountains and Ba Na Hills?" }
  ] : isHampi ? [
    { label: "🚌 KSRTC Bus Timings", query: "What are the exact KSRTC Airavat Club Class bus timings and boarding points?" },
    { label: "🏨 Basecamp & Booking", query: "Where is our basecamp hotel located and how do I book?" },
    { label: "🎫 ASI Monuments", query: "How do I book tickets for the Vittala Stone Chariot and Lotus Mahal?" },
    { label: "🛶 Coracle Float", query: "Where do we take the Tungabhadra coracle boat ride?" }
  ] : isChikmagalur ? [
    { label: "🚌 KSRTC Sleeper", query: "What are the KSRTC Airavat bus timings between Bengaluru and Chikmagalur?" },
    { label: "🏨 Tresca Basecamp", query: "Where is Tresca Hotel located and how do I drop luggage early?" },
    { label: "⛰️ Mullayanagiri Trek", query: "When is the best time to climb Mullayanagiri peak?" },
    { label: "☕ Coffee Shopping", query: "Where can we buy the best single-estate Arabica coffee beans?" }
  ] : [
    { label: "🏨 Basecamp Stay", query: "Where is our basecamp located?" },
    { label: "🗺️ Day 1 Itinerary", query: "What is the schedule for Day 1?" },
    { label: "🚨 Emergency SOS", query: "What are the local emergency numbers?" },
    { label: "🎒 Packing Essentials", query: "What are the most critical things to carry?" }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      let reply = `Here are the key details for ${currentTrip?.title || "your trip"} (${currentTrip?.dates || "2026"}): all transit passes, booking links, and verified logistics are loaded in your hub!`;
      const q = query.toLowerCase();

      if (isVietnam) {
        if (q.includes("veg") || q.includes("food") || q.includes("dining") || q.includes("eat") || q.includes("jain")) {
          reply = "🥗 *Vegetarian Dining Guide*:\n• In Hanoi: Sadhu Gourmet Vegetarian (fine-dining Buddhist buffet) and Namaste Hanoi (North Indian).\n• In Hoi An: Karma Waters (organic vegan) and Baba's Kitchen (Indian).\n• In Da Nang: Roots Plant-Based Café & Vedaana Indian.\n💡 *Crucial Phrase*: Say *'Không nước mắm'* (No fish sauce) and *'Tôi ăn chay trường'* (I am strictly vegetarian).";
        } else if (q.includes("limo") || q.includes("car") || q.includes("transfer") || q.includes("van") || q.includes("driver")) {
          reply = "🚗 *9-Seater DCar President Limousines*:\n• All 9 inter-city and airport legs are private, pre-booked DCar Transit vans.\n• Features plush leather massage captain seats, USB charging ports, Wi-Fi, and luggage room for 5 large + 5 cabin bags.\n• No crowded tour buses or overnight sleeper coaches!";
        } else if (q.includes("vat") || q.includes("refund") || q.includes("tax") || q.includes("customs")) {
          reply = "💵 *8.5% Airport VAT Cash Refund Guide*:\n1. Keep store VAT tax invoices for purchases > 2M VND (from certified shops in Hanoi & Da Nang).\n2. At Noi Bai Airport T2, go to the Customs inspection counter on the 3rd Floor (near Pillar 8 before security) to get your invoice stamped.\n3. After passport control, collect instant cash in USD or VND at the bank refund counter!";
        } else if (q.includes("senior") || q.includes("parent") || q.includes("walking") || q.includes("cane") || q.includes("wheelchair")) {
          reply = "👴 *Senior Parent Comfort Notes*:\n• Marble Mountains: We take the glass elevator directly to the upper pagoda platform, avoiding steep stone steps.\n• Ba Na Hills: Direct cable car with smooth boarding.\n• Hoi An: Gentle pedestrian zone flat walking; electric buggies are available.\n• Airports: Free wheelchair assistance requested for Delhi parents at transit hubs.";
        } else if (q.includes("shopping") || q.includes("bargain") || q.includes("cashew") || q.includes("coffee")) {
          reply = "🛍️ *Shopping & Bargaining Rules*:\n• Dong Xuan & Han Market: Start bargaining at 40%–50% of the initial quote with a warm smile.\n• Cashews: Look for 'Hạt điều rang muối Loại 1' (Grade 1 salted vacuum packs, ~180k VND / 500g tin).\n• Coffee: Trung Nguyên Legend Sang Tao No. 8 or No. 5 with traditional Phin filter.";
        } else if (q.includes("sos") || q.includes("emergency") || q.includes("police") || q.includes("hospital")) {
          reply = "🚨 *Emergency Contacts*:\n• Vietnam Police: 113 • Ambulance: 115\n• Tourist Support Hotline: 1022\n• Indian Embassy in Hanoi: +84 24 3824 4989\n• Hanoi French Hospital (Vinmec): International emergency department with English-speaking doctors.";
        }
      } else if (isHampi) {
        // Hampi Specific
        if (q.includes("bus") || q.includes("ksrtc") || q.includes("timing") || q.includes("transit") || q.includes("sleeper") || q.includes("pnr")) {
          reply = "🚌 *KSRTC Sleeper Transit (Confirmed PNRs)*:\n• **Outbound (Oct 1)**: KSRTC Non AC Sleeper (PNR: **KK22992248**, TripCode: 2314BNGHSP, Seats 8 & 7). Departs Kempegowda BS Terminal 1 (Majestic) Platform 15 at **11:14 PM (23:14 hrs)**; arrives Hosapete Central at ~06:15 AM.\n• **Bellandur Strategy**: Pre-book cab from Bellandur at 09:45 PM to reach Majestic Terminal 1 comfortably before 10:45 PM.\n• **Return (Oct 4)**: KSRTC Pallakki Non AC Sleeper (PNR: **KS23020219**, TripCode: 2132GVTBNG, Seats 11 & 12). Departs Hosapete Central Bus Stand Platform 0 at **10:45 PM (22:45 hrs)**; arrives Majestic 06:00 AM Monday. Early morning cab back to Bellandur takes ~30 mins.";
        } else if (q.includes("basecamp") || q.includes("hotel") || q.includes("stay") || q.includes("scooter") || q.includes("rental") || q.includes("munirabad")) {
          reply = "🏨 *Basecamp & Scooter Rental Strategy*:\n• **Basecamp**: **Sri Durga Comfort Stay** located on Sunrise Road, **Sanapur, North Hampi** (Phone: 063623 28833, hosts Durga & Raj). 2 nights confirmed under ₹5,000 with early bag drop at 08:00 AM.\n• **Scooter Rental**: **Ravi Bike Rental Hampi** at **Munirabad Station** (Phone: 087928 58466, Linga Bhaiya) for ₹450/day. Take a 15-min auto from Hosapete bus stand to Munirabad station to collect the scooter for 3 days of complete commute autonomy!";
        } else if (q.includes("monument") || q.includes("asi") || q.includes("ticket") || q.includes("vittala") || q.includes("stone chariot") || q.includes("lotus mahal")) {
          reply = "🎫 *ASI Monument Passes*:\n• A single official ASI ticket (₹50) covers **Vijaya Vittala Temple** (Stone Chariot) AND **Lotus Mahal / Elephant Stables** on the same day!\n• Book directly on the official ASI portal: https://asi.paygov.org.in/asi-webapp/#/ticketbooking to skip queues.\n• Pollution-free electric battery carts from parking to Vittala entrance cost ₹20.";
        } else if (q.includes("sunset") || q.includes("sunrise") || q.includes("matanga") || q.includes("malyavanta") || q.includes("hemakuta") || q.includes("anjanadri")) {
          reply = "🌄 *Golden Rules of Hampi Vistas*:\n• **Matanga Hill**: Strictly a **SUNRISE** climb (Day 3, 06:00 AM) in natural dawn light! There are zero lights/railings; descending after sunset is a major hazard.\n• **Hemakuta Hill (Day 1 Sunset)**: Unified with Kadalekalu & Sasivekalu Ganeshas at 04:45 PM when granite is cool.\n• **Malyavanta Hill (Day 2 Sunset)**: Live continuous Ramayana chanting inside sanctum and safe paved road descent.\n• **Anjanadri Hill (Day 3 Sunset)**: Climb the 575 steps at 04:30 PM breezy golden hour, avoiding the scorching 3:00 PM heat!";
        } else if (q.includes("lakshmi") || q.includes("elephant") || q.includes("blessing")) {
          reply = "🐘 *Elephant Lakshmi Factual Update*:\n• In late May 2026, temple elephant Lakshmi was relocated to the Elephant Care Facility (ECF) in Malur, Kolar, for long-term veterinary care (foot rot & arthritis).\n• She is **no longer residing at Virupaksha Temple**, so elephant blessings are no longer offered.";
        } else if (q.includes("coracle") || q.includes("boat") || q.includes("sanapur") || q.includes("river") || q.includes("lake")) {
          reply = "🛶 *Tungabhadra Coracle Rides*:\n• **Day 1**: Short 20-min morning river float along the shaded Kodandarama path.\n• **Day 3**: 45-min granite water canyon coracle float at **Sanapur Lake** (~₹400–₹500 for 2 pax).\n• Mandatory lifejackets are provided; stunning photo ops against boulder cliffs!";
        } else if (q.includes("food") || q.includes("veg") || q.includes("eat") || q.includes("dining") || q.includes("restaurant")) {
          reply = "🍛 *Dining in Hampi & Sanapur*:\n• **Mango Tree Restaurant**: Legendary Hampi institution with floor seating, banana flower curries, Jolada Rotti thalis, and chilled mint coolers.\n• **Kamalapura**: Authentic South Indian vegetarian meals at KSTDC Mayura Bhuvaneshwari.\n• **Sanapur Cafes**: The Goan Corner, Laughing Buddha Cafe, and home-cooked breakfasts at Sri Durga Comfort Stay.";
        } else if (q.includes("sos") || q.includes("emergency") || q.includes("police") || q.includes("hospital")) {
          reply = "🚨 *Emergency Contacts*:\n• Karnataka Police Helpline: 112\n• District Hospital Hosapete (24/7 Trauma): +91 8394 222100\n• Hosapete Town Police: +91 8394 220333\n• Hampi Tourism Info: +91 8394 241339";
        }
      } else if (isChikmagalur) {
        // Chikmagalur Specific
        if (q.includes("bus") || q.includes("ksrtc") || q.includes("timing") || q.includes("transit") || q.includes("sleeper") || q.includes("pnr")) {
          reply = "🚌 *KSRTC Airavat AC Sleeper (Confirmed PNRs)*:\n• **Outbound (Sep 11)**: KSRTC Airavat Multi-Axle (PNR: **KSRTC-BLR-892**, Berths 12 & 13). Departs Majestic/Silk Board at 11:00 PM; arrives Chikmagalur KSRTC stand ~06:30 AM / 09:30 AM.\n• **Return (Sep 14)**: KSRTC Airavat Multi-Axle (PNR: **KSRTC-RET-441**, Berths 18 & 19). Departs Chikmagalur stand at 10:30 PM; arrives Majestic 05:00 AM Tue.";
        } else if (q.includes("basecamp") || q.includes("hotel") || q.includes("tresca") || q.includes("stay") || q.includes("luggage")) {
          reply = "🏨 *Basecamp Stay*: **Tresca A Luxury Hotel** on RG Road, Vijayapura (~850m from KSRTC bus stand, 2 min auto). 9:30 AM early bag drop in 24-hr cloakroom so you can head straight to breakfast and hills unencumbered!";
        } else if (q.includes("scooty") || q.includes("bike") || q.includes("rental")) {
          reply = "🛵 *125cc Scooty Rental*: Collect your 125cc scooty (~₹600/day + ₹1,000 deposit) near the bus stand for Mullayanagiri, Baba Budangiri, and Z-point mountain trails. Return by 08:30 PM on Sep 14 before boarding.";
        } else if (q.includes("mullayanagiri") || q.includes("peak") || q.includes("trek") || q.includes("baba budan")) {
          reply = "⛰️ *Mullayanagiri Peak (1,930m)*: The highest summit in Karnataka! Reach the trailhead by 07:00 AM for brisk golden-hour cloud panoramas before heavy afternoon mist rolls in.";
        } else if (q.includes("coffee") || q.includes("shopping") || q.includes("roast")) {
          reply = "☕ *Chikmagalur Coffee Guide*:\n• **Panduranga Coffee 1938** on MG Road (Grand Aroma Chicory & Pure Roast).\n• **Coffee Roasters Association** on Market Road for Single Estate Arabica Peaberry.";
        } else if (q.includes("sos") || q.includes("emergency") || q.includes("police") || q.includes("hospital")) {
          reply = "🚨 *Emergency Contacts*:\n• Karnataka Police: 112 • Ambulance: 108\n• Malnad Hospital (24/7 Casualty): +91 8262 235555\n• Apollo Pharmacy (Near Tresca): +91 8262 239999";
        }
      } else {
        // Universal / Custom Trip Intelligent Fallback
        if (q.includes("hotel") || q.includes("stay") || q.includes("basecamp")) {
          reply = `🏨 *Basecamp Accommodation*: **${currentTrip?.basecamp?.name || currentTrip?.stays?.[0]?.name || "Basecamp Hotel"}** (${currentTrip?.basecamp?.location || currentTrip?.stays?.[0]?.address || currentTrip?.destination}). Check-in: ${currentTrip?.basecamp?.checkIn || currentTrip?.dates || "Scheduled"}.`;
        } else if (q.includes("itinerary") || q.includes("day 1") || q.includes("plan")) {
          const day1 = currentTrip?.itinerary?.[0];
          reply = `🗺️ *Day 1 Plan (${day1?.title || "Arrival"})*:\n${day1?.stops?.slice(0, 3)?.map((s, idx) => `• Stop ${idx + 1}: ${s.name || s.title} (${s.time || ""})`).join("\n") || "Day 1 itinerary loaded in your timeline tab!"}`;
        } else if (q.includes("sos") || q.includes("emergency") || q.includes("police") || q.includes("hospital")) {
          reply = `🚨 *Emergency Contacts for ${currentTrip?.destination || "Expedition"}*:\n• Police: ${currentTrip?.emergency?.police || "112"}\n• Ambulance: ${currentTrip?.emergency?.ambulance || "108"}\n• Support: ${currentTrip?.emergency?.touristSupport || "112"}`;
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 400);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-[45] w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        title="Trip Assistant & On-Ground Advisor"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Advisor Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[80vh] bg-white dark:bg-darkcard rounded-3xl shadow-2xl border border-slate-200 dark:border-darkborder flex flex-col z-[50] overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">
                  {isVietnam ? "Vietnam Trip Assistant" : `${currentTrip?.title?.split(" ")[0] || "Trip"} Assistant`}
                </h4>
                <span className="text-[10px] text-emerald-400 font-medium">● Local Knowledge Active</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ Prompts */}
          <div className="p-2 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-darkborder flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold whitespace-nowrap hover:border-rose-500 transition shrink-0"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs bg-slate-50 dark:bg-slate-900/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={"flex flex-col " + (m.sender === "user" ? "items-end" : "items-start")}
              >
                <div
                  className={"max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed whitespace-pre-wrap " + (
                    m.sender === "user"
                      ? "bg-indigo-600 text-white font-medium"
                      : "bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder text-slate-800 dark:text-slate-200"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white dark:bg-darkcard border-t border-slate-200 dark:border-darkborder flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about veg food, VAT, cabs..."
              className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

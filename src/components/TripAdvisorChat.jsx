import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, HelpCircle, Shield, Utensils, Bus, Receipt } from "lucide-react";

export default function TripAdvisorChat({ currentTrip }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! I am your Vietnam On-Ground Expedition Advisor. Ask me anything about pure-veg food, private limousines, airport VAT refunds, or senior parent comfort."
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

  const quickQuestions = [
    { label: "🥗 Pure Veg Food", query: "Where are the best pure veg restaurants in Hanoi and Hoi An?" },
    { label: "🚗 DCar Limousines", query: "How do our private 9-seater limousine transfers work?" },
    { label: "💵 Airport VAT Refund", query: "How do I claim the 8.5% VAT cash refund at Noi Bai airport?" },
    { label: "👴 Senior Comfort", query: "What are the senior comfort tips for parents at Marble Mountains and Ba Na Hills?" }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      let reply = "For your 5-adult expedition (Dec 3–10, 2026), your blueprint includes private 9-seater DCar limousines, verified pure veg food, and elevator access at Marble Mountains!";
      const q = query.toLowerCase();

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
                <h4 className="font-bold text-xs leading-none">Vietnam Trip Assistant</h4>
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

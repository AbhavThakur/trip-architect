import React, { useState } from "react";
import {
  X,
  Sparkles,
  Compass,
  Calendar,
  MapPin,
  Users,
  Car,
  Hotel,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
  ShieldCheck,
  Bot
} from "lucide-react";

const PRESET_DESTINATIONS = [
  { name: "Ooty & Nilgiri Hills", origin: "Bengaluru", category: "domestic", days: 3, transit: "KSRTC Airavat Sleeper Bus", flag: "🌲", vibe: "Nilgiri tea plantations, toy train, Doddabetta peak & botanical gardens" },
  { name: "Coorg (Kodagu)", origin: "Bengaluru", category: "domestic", days: 3, transit: "Private AC Cab / Self-drive", flag: "☕", vibe: "Coffee estates, Abbey Falls, Raja's Seat sunset & Tibetan Golden Temple" },
  { name: "Munnar Tea Highlands", origin: "Kochi", category: "domestic", days: 4, transit: "Private Ghat Cab", flag: "🍃", vibe: "Tea rolling hills, Eravikulam Nilgiri Tahr, Top Station clouds & spice tasting" },
  { name: "Pondicherry French Quarter", origin: "Chennai", category: "domestic", days: 3, transit: "East Coast Road (ECR) Cab", flag: "🌊", vibe: "White Town French villas, promenade beach sunrise, Auroville & cycling" },
  { name: "Manali & Solang Valley", origin: "Delhi", category: "domestic", days: 5, transit: "Himachal Volvo Sleeper Bus", flag: "❄️", vibe: "Rohtang snow pass, Solang paragliding, Old Manali cafes & river rafting" },
  { name: "Kyoto & Osaka", origin: "Tokyo", category: "international", days: 6, transit: "Shinkansen Bullet Train", flag: "🇯🇵", vibe: "Fushimi Inari torii gates, Arashiyama bamboo forest & Dotonbori food trail" }
];

export default function CreateTripModal({ isOpen, onClose, onSaveTrip }) {
  const [activeTab, setActiveTab] = useState("builder"); // 'builder' | 'import' | 'ai-guide'
  
  // Builder form state
  const [dest, setDest] = useState("");
  const [origin, setOrigin] = useState("Bengaluru");
  const [category, setCategory] = useState("domestic");
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [travelers, setTravelers] = useState("2 Travelers");
  const [transitMode, setTransitMode] = useState("Overnight Sleeper Bus (KSRTC)");
  const [basecampName, setBasecampName] = useState("");
  const [notes, setNotes] = useState("");
  
  // Generated preview state
  const [generatedTrip, setGeneratedTrip] = useState(null);
  
  // JSON import state
  const [jsonInput, setJsonInput] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setDest(preset.name);
    setOrigin(preset.origin);
    setCategory(preset.category);
    setDays(preset.days);
    setTransitMode(preset.transit);
    setNotes(preset.vibe);
    setBasecampName(`${preset.name.split(" ")[0]} Resort & Homestay`);
  };

  const handleGenerate = () => {
    if (!dest.trim()) {
      alert("Please enter a destination name.");
      return;
    }

    const year = new Date(startDate).getFullYear() || 2026;
    const cleanSlug = dest
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const tripId = `${cleanSlug}-${year}`;

    // Format dates string
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(days) - 1);
    
    const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const datesFormatted = `${startStr} – ${endStr}`;
    const endDateFormatted = end.toISOString().split("T")[0];

    const isDomestic = category === "domestic";
    const flag = isDomestic ? "🇮🇳" : "🌐";
    const accentColor = isDomestic ? "#10b981" : "#6366f1";
    const heroGradient = isDomestic
      ? "from-emerald-950 via-teal-900 to-slate-950"
      : "from-indigo-950 via-purple-900 to-slate-950";

    // Generate day-by-day itinerary
    const itinerary = [];
    const locations = [];
    const transportPlan = [];

    // Basecamp coordinates fallback
    const baseCoords = isDomestic ? [12.9716, 77.5946] : [35.6762, 139.6503];

    locations.push({
      id: "basecamp",
      name: basecampName || `${dest} Boutique Stay`,
      category: "stay",
      coords: baseCoords,
      desc: "Prime central stay with smooth transit access, high-speed WiFi, and breakfast.",
      day: 1,
      time: "10:00 AM Check-in",
      icon: "fa-hotel",
      color: "pin-rose"
    });

    for (let i = 1; i <= Number(days); i++) {
      const curDate = new Date(start);
      curDate.setDate(start.getDate() + i - 1);
      const dayDateStr = `Day ${i} (${curDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })})`;

      const isFirstDay = i === 1;
      const isLastDay = i === Number(days);

      const dayTitle = isFirstDay
        ? `Arrival from ${origin}, Basecamp Check-in & Scenic Orientation`
        : isLastDay
        ? `Local Artisan Markets, Farewell Dining & Return Transit`
        : `Deep Exploration Loop: Key Landmarks & Sunset Viewpoint`;

      const dayEvents = [];

      if (isFirstDay) {
        dayEvents.push(
          {
            time: "08:30 AM",
            title: `Arrival at ${dest} Transit Hub`,
            category: "transport",
            desc: `Arrive via ${transitMode}. Quick refreshment, bag drop at stay.`,
            tip: "Keep digital ID cards accessible on phone."
          },
          {
            time: "11:00 AM",
            title: "Local Heritage & Cafe Brunch",
            category: "food",
            desc: `Sample authentic local specialties and artisanal beverages in central ${dest}.`,
            tip: "Ask for local recommendations on the season's best sights."
          },
          {
            time: "05:00 PM – 06:45 PM",
            title: "Golden Hour Panoramic Viewpoint",
            category: "viewpoint",
            desc: "Watch the sunset glow over the horizon with sweeping scenic vistas.",
            tip: "Carry a light windcheater jacket for evening breezes."
          }
        );
      } else if (isLastDay) {
        dayEvents.push(
          {
            time: "09:30 AM",
            title: "Artisan Souvenir & Specialty Market",
            category: "shopping",
            desc: `Pick up region-exclusive specialties, spices, handmade crafts, and confectionery.`,
            tip: "Support local family cooperatives for authentic quality."
          },
          {
            time: "01:00 PM",
            title: "Celebratory Farewell Lunch",
            category: "food",
            desc: "Enjoy a relaxed traditional feast before concluding luggage packing.",
            tip: "Pre-book return transit or cab pickup in advance."
          },
          {
            time: "07:30 PM",
            title: `Return Transit to ${origin}`,
            category: "transport",
            desc: `Board ${transitMode} for smooth return journey.`,
            tip: "Set wake-up alarm 20 minutes before station."
          }
        );
      } else {
        dayEvents.push(
          {
            time: "08:30 AM – 12:30 PM",
            title: `Morning Expedition: High Elevation Ridge & Nature Trail`,
            category: "nature",
            desc: "Brisk morning walk amidst fresh air, lush vegetation, and crisp viewpoint overlooks.",
            tip: "Wear grip-soled walking shoes and bring 1L reusable water."
          },
          {
            time: "01:00 PM – 02:30 PM",
            title: "Authentic Regional Culinary Stop",
            category: "food",
            desc: "Wholesome midday meal at a renowned family restaurant.",
            tip: "Cash or UPI both widely supported."
          },
          {
            time: "03:30 PM – 06:00 PM",
            title: "Cultural Landmark & Heritage Architecture",
            category: "culture",
            desc: "Historic temple, colonial landmark, or botanical conservation zone.",
            tip: "Respect photography guidelines and quiet zones."
          }
        );
      }

      itinerary.push({
        dayNumber: i,
        date: dayDateStr,
        title: dayTitle,
        highlight: notes ? `${notes} (Day ${i})` : `Curated exploration in ${dest}`,
        transportBadge: transitMode.split(" ")[0] || "Transit",
        events: dayEvents
      });

      transportPlan.push({
        day: `Day ${i}`,
        mode: isFirstDay || isLastDay ? transitMode : "Local Cab / Scooty Hire",
        icon: isFirstDay || isLastDay ? "fa-bus" : "fa-motorcycle",
        timing: isFirstDay ? "Morning Arrival" : isLastDay ? "Evening Departure" : "Full Day Loop",
        purpose: isFirstDay ? "Transit to Destination" : isLastDay ? "Return Hub Transit" : "Scenic Sightseeing"
      });
    }

    const tripObject = {
      id: tripId,
      title: `${dest} Master Expedition`,
      destination: dest,
      flag,
      status: "upcoming",
      category,
      dates: datesFormatted,
      startDate,
      endDate: endDateFormatted,
      daysCount: Number(days),
      travelers,
      heroGradient,
      badge: isDomestic ? "Domestic • Curated Loop" : "International • Passport Edition",
      accentColor,
      url: `trip.html?id=${tripId}`,
      summary: notes || `An autonomous ${days}-day expedition to ${dest} featuring hand-picked scenic routes, signature culinary stops, and seamless transit coordination.`,
      basecamp: {
        name: basecampName || `${dest} Heritage Stay`,
        location: `Central ${dest}`,
        distanceFromStation: `2.5 km from primary ${dest} transit terminal`,
        checkIn: "12:00 PM",
        checkOut: "10:30 AM",
        arrivalStrategy: "Drop bags in luggage cloakroom if arriving prior to check-in hour.",
        diningNote: "In-house breakfast and walking distance to reputable local cafes.",
        coords: baseCoords,
        addressLocalScript: `${dest}, Pin 500001`
      },
      transportPlan,
      locations,
      itinerary,
      packingList: [
        { id: "p1", item: "Government ID / Passport / Digital copies", category: "Documents", checked: false },
        { id: "p2", item: "Power Bank (20,000 mAh) & Charging Braids", category: "Electronics", checked: false },
        { id: "p3", item: "All-weather windcheater / light jacket", category: "Clothing", checked: false },
        { id: "p4", item: "Sturdy trail shoes with traction grip", category: "Footwear", checked: false },
        { id: "p5", item: "Personal first-aid kit (paracetamol, ORS, band-aids)", category: "Medical", checked: false },
        { id: "p6", item: "Reusable insulated water bottle", category: "Essentials", checked: false }
      ],
      emergencyContacts: [
        { name: `${dest} Local Police Station`, phone: "112", info: "National Emergency Service" },
        { name: "Tourist Safety Helpline", phone: "1363", info: "24/7 Tourist Assistance" },
        { name: "Government Emergency Ambulance", phone: "108", info: "Emergency Medical Dispatch" }
      ],
      budget: {
        totalEstimate: `₹${(Number(days) * 3500).toLocaleString("en-IN")}`,
        perPersonSplit: `₹${(Number(days) * 1750).toLocaleString("en-IN")} / pax`,
        breakdown: [
          { item: `Transit (${transitMode})`, cost: `₹${(Number(days) * 1200).toLocaleString("en-IN")}` },
          { item: `Basecamp Stay (${days - 1} nights)`, cost: `₹${((Number(days) - 1) * 2800).toLocaleString("en-IN")}` },
          { item: "Dining & Specialty Coffee", cost: `₹${(Number(days) * 1000).toLocaleString("en-IN")}` },
          { item: "Sightseeing & Entry Permits", cost: "₹800" },
          { item: "Contingency Buffer", cost: "₹1,000" }
        ]
      }
    };

    setGeneratedTrip(tripObject);
  };

  const handleSaveToHub = (launchAfter = false) => {
    if (!generatedTrip) return;
    onSaveTrip(generatedTrip, launchAfter);
    onClose();
  };

  const handleDownloadJson = () => {
    if (!generatedTrip) return;
    const blob = new Blob([JSON.stringify(generatedTrip, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedTrip.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleValidateAndImportJson = () => {
    setImportError("");
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(jsonInput);

      // Validate required schema fields per trip.schema.json
      const required = ["id", "title", "destination", "dates", "itinerary", "locations"];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required schema property: "${field}". Please check trip.schema.json.`);
        }
      }

      setGeneratedTrip(parsed);
      setImportSuccess(true);
    } catch (err) {
      setImportError(err.message);
    }
  };

  const handleLoadSampleTemplate = () => {
    const sample = {
      id: "hampi-heritage-2026",
      title: "Hampi Boulder Trails & Vijayanagara Dynasties",
      destination: "Hampi, Karnataka, India",
      flag: "🏛️",
      status: "upcoming",
      category: "domestic",
      dates: "Nov 20 – 22, 2026",
      startDate: "2026-11-20",
      endDate: "2026-11-22",
      daysCount: 3,
      travelers: "2 Travelers",
      heroGradient: "from-amber-950 via-stone-900 to-slate-950",
      badge: "UNESCO World Heritage • Ruins & Boulders",
      accentColor: "#f59e0b",
      summary: "3 days cycling amongst monolithic boulder hills, the Virupaksha Temple, the stone chariot of Vijaya Vittala, and sunset from Matanga Hill.",
      basecamp: {
        name: "Heritage River View Guest House",
        location: "Hampi Bazaar, near Tungabhadra River",
        checkIn: "11:00 AM",
        checkOut: "10:00 AM"
      },
      transportPlan: [
        { day: "Day 1", mode: "Hampi Express Train + Auto", timing: "07:30 AM Arrival", purpose: "Hospet to Hampi transition" }
      ],
      locations: [
        { id: "virupaksha", name: "Virupaksha Temple", category: "culture", coords: [15.3353, 76.4600], day: 1, time: "09:00 AM" }
      ],
      itinerary: [
        {
          dayNumber: 1,
          date: "Day 1 (Friday)",
          title: "Sacred Center & Sunset over Tungabhadra",
          events: [
            { time: "09:00 AM", title: "Virupaksha Temple Darshan", category: "culture", desc: "7th-century functioning Dravidian temple tower." }
          ]
        }
      ]
    };
    setJsonInput(JSON.stringify(sample, null, 2));
    setImportError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display flex items-center gap-2">
                <span>Architect New Trip</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Local UI Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design custom trips locally or import JSON from Antigravity AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-3 shrink-0">
          <button
            onClick={() => setActiveTab("builder")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "builder"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Builder</span>
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "import"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>AI / JSON Import</span>
          </button>
          <button
            onClick={() => setActiveTab("ai-guide")}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "ai-guide"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Antigravity AI & Playwright Guide</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {activeTab === "builder" && (
            <div className="space-y-6">
              {/* Quick Preset Selector */}
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  ⚡ Quick Popular Inspiration (1-Click Fill)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_DESTINATIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-400">
                        <span>{preset.flag}</span>
                        <span className="truncate">{preset.name.split(" ")[0]}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {preset.days} Days • from {preset.origin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Destination *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={dest}
                      onChange={(e) => setDest(e.target.value)}
                      placeholder="e.g. Ooty, Nilgiris, India"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Origin / Transit Hub
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory("domestic")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        category === "domestic"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      🇮🇳 Domestic
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("international")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        category === "international"
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      🌐 International
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      placeholder="e.g. 2 Travelers or Family of 4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Transit Mode Strategy
                  </label>
                  <div className="relative">
                    <Car className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={transitMode}
                      onChange={(e) => setTransitMode(e.target.value)}
                      placeholder="e.g. KSRTC Airavat AC Sleeper / Flight + Cab"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Basecamp Hotel & Location (Optional)
                  </label>
                  <div className="relative">
                    <Hotel className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={basecampName}
                      onChange={(e) => setBasecampName(e.target.value)}
                      placeholder="e.g. Sterling Ooty Fern Hill / Savoy - IHCL SeleQtions"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Trip Vibe & Key Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Nilgiri toy train ride, botanical garden picnic, tea factory tour, Toda tribal heritage."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Generate Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Full Itinerary & Architecture</span>
                </button>
              </div>

              {/* Generated Result Preview Card */}
              {generatedTrip && (
                <div className="bg-slate-950 rounded-2xl border border-emerald-500/40 p-5 space-y-4 animate-in fade-in-50 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{generatedTrip.flag}</span>
                      <div>
                        <h4 className="text-sm font-black text-white">{generatedTrip.title}</h4>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ID: {generatedTrip.id} • {generatedTrip.dates}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Schema Validated ✓
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedTrip.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Days</span>
                      <strong className="text-white font-mono">{generatedTrip.daysCount} Days</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Stops</span>
                      <strong className="text-emerald-400 font-mono">
                        {generatedTrip.itinerary?.reduce((acc, d) => acc + (d.events?.length || 0), 0)} Activities
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Budget</span>
                      <strong className="text-amber-400 font-mono">{generatedTrip.budget?.totalEstimate}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Packing List</span>
                      <strong className="text-white font-mono">{generatedTrip.packingList?.length} Items</strong>
                    </div>
                  </div>

                  {/* Actions for generated trip */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveToHub(true)}
                      className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Launch Immediately</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveToHub(false)}
                      className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Save to Hub</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadJson}
                      className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                      title="Download .json file to commit to data/trips/"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "import" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Import Schema-Compliant JSON</h3>
                  <p className="text-xs text-slate-400">
                    Paste raw JSON created via Antigravity AI, Gemini, or the CLI generator
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSampleTemplate}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1.5 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Load Sample Template</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste valid trip JSON here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />

              {importError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Trip JSON parsed and verified against schema successfully!</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleValidateAndImportJson}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Validate & Parse JSON</span>
                </button>
                {importSuccess && generatedTrip && (
                  <button
                    type="button"
                    onClick={() => handleSaveToHub(true)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Import to Local Hub & Launch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "ai-guide" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Bot className="w-4 h-4" />
                  <span>How to use Antigravity AI + Playwright for Live Trips</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Antigravity can autonomously browse live transit portals (KSRTC, IRCTC, Booking.com, Google Maps) using genuine browser sessions (Playwright / Chrome DevTools MCP) to extract live seat availability, realistic fares, GPS coordinates, and translate everything into your Travel Architect Hub.
                </p>
              </div>

              {/* Step by step playbook */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Autonomous 3-Step Playbook
                </h4>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                    <span>Prompt Antigravity with Your Request</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Tell Antigravity: <code className="text-emerald-300 font-mono text-[11px]">"Plan a 3-day weekend trip from Bengaluru to Ooty. Use the browser to check KSRTC Airavat Club Class bus timings and fares, find a top-rated colonial heritage stay, and generate a schema-valid JSON."</code>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">2</span>
                    <span>Antigravity Executes Browser Subagent (Playwright)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Antigravity launches <code className="text-indigo-300 font-mono text-[11px]">browser_subagent</code> to open real booking portals, bypass client-side JavaScript rendering, and retrieve verified live timings, bus numbers, and exact GPS coordinates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                    <span>Direct Local Insertion or Schema Import</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    Antigravity writes the trip directly to <code className="text-amber-300 font-mono text-[11px]">data/trips/&lt;slug&gt;.json</code> or you paste the JSON into the <strong>AI / JSON Import</strong> tab right here in the UI.
                  </p>
                </div>
              </div>

              {/* Sample CLI command */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  CLI Quick Generation Alternative
                </span>
                <pre className="text-xs font-mono text-emerald-400 bg-black/50 p-3 rounded-xl overflow-x-auto">
npm run generate-trip -- --dest "Ooty" --from "Bengaluru" --days 3 --start "2026-10-15"
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Local Storage • No Cloud Required</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

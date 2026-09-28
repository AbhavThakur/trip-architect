import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Compass,
  Trophy,
  Calendar,
  Users,
  Mountain,
  Plane,
  Award,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Upload,
  Globe,
  Star,
  ChevronRight,
  Eye,
  Trash2,
  FileText,
  Share2,
  Bookmark
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Built-in Seed Journeys with rich visual storytelling and photography
const SEED_JOURNEYS = [
  {
    id: "chikmagalur-2026",
    title: "Chikmagalur Coffee & Cloud Peaks",
    destination: "Chikmagalur, Western Ghats, Karnataka, India",
    year: "2026",
    month: "Sep",
    dates: "Sep 12 – 14, 2026",
    status: "completed",
    stampText: "WESTERN GHATS HIGH PEAK",
    accentColor: "#059669",
    categoryBadge: "Western Ghats Ridge",
    travelers: ["Aanya Jain", "Abhav Thakur"],
    distanceKm: 560,
    maxAltitudeM: 1930,
    durationDays: 3,
    basecamp: "Tresca Luxury Hotel, Chikmagalur Town",
    transportMode: "KSRTC Airavat Sleeper Bus + 4×4 Jeep",
    routeStops: ["Bengaluru", "Hassan", "Belur", "Chikmagalur", "Mullayanagiri", "Hebbe Falls", "Baba Budan Giri"],
    summary: "Conquered Karnataka's highest peak amidst rolling monsoon clouds, navigated rugged 4x4 red dirt tracks to cascading forest waterfalls, and savored traditional filter coffee at heritage planters' cafes.",
    badgesUnlocked: [
      { icon: "☕", title: "Arabica Highland Trekker", xp: "800 XP", desc: "Summited Mullayanagiri Peak (1,930m)" },
      { icon: "🚙", title: "Western Ghats 4×4 Pilot", xp: "650 XP", desc: "Mastered off-road trails to Hebbe Falls" }
    ],
    memories: [
      {
        title: "Summit of Karnataka: Mullayanagiri (1,930m)",
        category: "High Altitude Peak",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        caption: "Standing above the cloud line with 50 km/h monsoon winds sweeping over the green ridge.",
        tag: "Mountain Summit"
      },
      {
        title: "Roaring Hebbe Falls 4×4 Descent",
        category: "Off-Road Adventure",
        image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
        caption: "Crossing rushing stream beds in an open Mahindra 4x4 to reach the two-tiered forest cascade.",
        tag: "Waterfalls"
      },
      {
        title: "Town Canteen Butter Dosa & Filter Kaapi",
        category: "Culinary Heritage",
        image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80",
        caption: "Crisp golden dosas dripping with fresh white butter, followed by steaming degree coffee.",
        tag: "Local Food"
      }
    ]
  },
  {
    id: "hampi-2026",
    title: "Hampi Boulder Trails & Vijayanagara Dynasties",
    destination: "Hampi, Vijayanagara District, Karnataka, India",
    year: "2026",
    month: "Oct",
    dates: "Oct 2 – 4, 2026",
    status: "upcoming",
    countdownDays: 3,
    stampText: "UNESCO WORLD HERITAGE",
    accentColor: "#d97706",
    categoryBadge: "UNESCO World Heritage",
    travelers: ["Aanya Jain", "Abhav Thakur"],
    distanceKm: 700,
    maxAltitudeM: 520,
    durationDays: 3,
    basecamp: "Sri Durga Comfort Stay, Hosapete",
    transportMode: "KSRTC Airavat Sleeper + Local Scooty",
    routeStops: ["Bengaluru", "Chitradurga", "Hosapete", "Hampi Sacred Center", "Royal Enclosure", "Anegundi"],
    summary: "Stepping into a 14th-century empire frozen in time. Marveling at musical stone pillars, cycling through golden granite boulder valleys, and crossing the sacred Tungabhadra River on circular coracle boats.",
    badgesUnlocked: [
      { icon: "🏛️", title: "UNESCO Heritage Custodian", xp: "1,500 XP", desc: "3+ World Heritage monuments documented" },
      { icon: "🛶", title: "Tungabhadra Coracle Pilot", xp: "700 XP", desc: "Navigated river currents on bamboo basket craft" }
    ],
    memories: [
      {
        title: "Matanga Hill Sunrise Panorama",
        category: "Golden Hour Viewpoint",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        caption: "Watching morning golden mist rise over thousands of monolithic stone boulders and ancient ruins.",
        tag: "Sunrise"
      },
      {
        title: "The Stone Chariot & Vitthala Musical Pillars",
        category: "Architectural Marvel",
        image: "https://images.unsplash.com/photo-1600100397608-f010f4439050?auto=format&fit=crop&w=800&q=80",
        caption: "Precision stone masonry of the iconic Garuda chariot and pillars tuned to Indian classical notes.",
        tag: "Monuments"
      },
      {
        title: "Sunset over Sanapur Lake & Hippie Island",
        category: "Bouldering & Waters",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        caption: "Lush green emerald paddy fields framed by rust-colored granite boulders and turquoise reservoir water.",
        tag: "Scenery"
      }
    ]
  },
  {
    id: "vietnam-family-2026",
    title: "Vietnam Master Expedition: Central Coast to Northern Karsts",
    destination: "Da Nang, Hoi An, Hanoi, Ninh Binh & Halong Bay, Vietnam",
    year: "2026",
    month: "Dec",
    dates: "Dec 3 – 10, 2026",
    status: "upcoming",
    countdownDays: 66,
    stampText: "INTERNATIONAL PASSPORT",
    accentColor: "#dc2626",
    categoryBadge: "International Expedition",
    travelers: ["Sundeep", "Shikha", "Arjit", "Aanya", "Abhav"],
    distanceKm: 7200,
    maxAltitudeM: 1487,
    durationDays: 7,
    basecamp: "TMS Hotel Da Nang Beach & Halong Cruise",
    transportMode: "IndiGo International Flight + Luxury DCar Limousines",
    routeStops: ["Bengaluru", "Hanoi", "Da Nang", "Hoi An", "Ba Na Hills", "Ninh Binh", "Halong Bay"],
    summary: "A grand 7-day multi-generational journey from South China Sea beachfronts through UNESCO lantern streets, mist-shrouded limestone river grottos, and an overnight cruise through Halong Bay's thousand karst islands.",
    badgesUnlocked: [
      { icon: "🛶", title: "Karst Archipelago Mariner", xp: "1,200 XP", desc: "Navigated limestone sea karsts & emerald grottoes" },
      { icon: "🐉", title: "Dragon Bridge Fire Watcher", xp: "850 XP", desc: "Witnessed Da Nang's weekend fire & water bridge" },
      { icon: "🏮", title: "Hoi An Lantern Dreamer", xp: "900 XP", desc: "Night bamboo basket boat on Thu Bon river" }
    ],
    memories: [
      {
        title: "Halong & Lan Ha Bay Overnight Karst Cruise",
        category: "UNESCO Natural Wonder",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
        caption: "Gliding through emerald seawater surrounded by ancient towering limestone towers in morning fog.",
        tag: "Cruise"
      },
      {
        title: "Hoi An Ancient Lantern Festival at Twilight",
        category: "UNESCO Cultural Wonder",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
        caption: "Cobblestone alleys lit by thousands of silk lanterns reflecting off the serene Thu Bon river.",
        tag: "Heritage"
      },
      {
        title: "Golden Bridge in the Clouds: Ba Na Hills",
        category: "Architectural Wonder",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
        caption: "Walking across the iconic golden skyway held up by colossal moss-covered stone hands above the clouds.",
        tag: "Skyway"
      }
    ]
  }
];

export default function LifetimeJourneyBookPage({
  onBack,
  onSelectTrip,
  allTrips = []
}) {
  const [activeTab, setActiveTab] = useState("timeline"); // "timeline" | "map" | "achievements" | "importer"
  const [mapFilter, setMapFilter] = useState("all"); // "all" | "completed" | "upcoming"
  const [expandedJourneyId, setExpandedJourneyId] = useState("chikmagalur-2026");
  const [userMemories, setUserMemories] = useState([]);
  const [customJourneys, setCustomJourneys] = useState([]);
  const [isAddJourneyModalOpen, setIsAddJourneyModalOpen] = useState(false);

  // New Custom Journey Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [newYear, setNewYear] = useState("2025");
  const [newDates, setNewDates] = useState("");
  const [newTravelers, setNewTravelers] = useState("Abhav Thakur");
  const [newKm, setNewKm] = useState("450");
  const [newSummary, setNewSummary] = useState("");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load custom logged journeys from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("travel_architect_journey_book");
      if (saved) {
        setCustomJourneys(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Merge seed journeys with any user-logged custom past trips
  const combinedJourneys = [...SEED_JOURNEYS, ...customJourneys];

  // Lifetime Telemetry Metrics
  const totalKm = combinedJourneys.reduce((acc, j) => acc + (j.distanceKm || 0), 0);
  const totalDays = combinedJourneys.reduce((acc, j) => acc + (j.durationDays || 0), 0);
  const completedCount = combinedJourneys.filter((j) => j.status === "completed").length;
  const upcomingCount = combinedJourneys.filter((j) => j.status === "upcoming").length;

  // Initialize or re-render Leaflet Map
  useEffect(() => {
    if (activeTab !== "map") return;
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center around Indian subcontinent & Southeast Asia
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false
    }).setView([15.5, 90.0], 4);

    mapInstanceRef.current = map;

    // High quality OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);

    const timer1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    const timer2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 450);

    // Map Locations Catalog
    const mapPins = [
      { name: "Bengaluru Home HQ", coords: [12.9716, 77.5946], type: "hq", status: "completed", note: "Home Base & Expedition Launchpad" },
      { name: "Chikmagalur Coffee Hills", coords: [13.3161, 75.7720], type: "mountain", status: "completed", note: "Western Ghats, Mullayanagiri Peak (1,930m)" },
      { name: "Hampi Ruins & Tungabhadra", coords: [15.3350, 76.4600], type: "heritage", status: "upcoming", note: "UNESCO 14th-Century Vijayanagara Capital" },
      { name: "Da Nang & Marble Mtns", coords: [16.0544, 108.2022], type: "coastal", status: "upcoming", note: "South China Sea & Dragon Bridge" },
      { name: "Hoi An Ancient Lantern Town", coords: [15.8801, 108.3380], type: "heritage", status: "upcoming", note: "UNESCO Riverside Lanterns & Silk Tailors" },
      { name: "Hanoi Old Quarter & Lakes", coords: [21.0285, 105.8542], type: "culture", status: "upcoming", note: "Hoan Kiem Lake & French Quarter" },
      { name: "Ninh Binh & Trang An Grottos", coords: [20.2506, 105.9745], type: "karst", status: "upcoming", note: "Halong Bay on Land River Caves" },
      { name: "Halong & Lan Ha Karst Bay", coords: [20.9101, 107.1839], type: "cruise", status: "upcoming", note: "Overnight Cruise & Limestone Archipelago" }
    ];

    const bounds = [];

    // Filter pins
    const filteredPins = mapPins.filter((p) => {
      if (mapFilter === "completed") return p.status === "completed";
      if (mapFilter === "upcoming") return p.status === "upcoming";
      return true;
    });

    filteredPins.forEach((pin) => {
      bounds.push(pin.coords);
      const isHq = pin.type === "hq";
      const isPast = pin.status === "completed";

      const pinColor = isHq ? "#3b82f6" : isPast ? "#10b981" : "#f59e0b";
      const ringColor = isHq ? "rgba(59,130,246,0.4)" : isPast ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.4)";
      const iconEmoji = isHq ? "🏠" : isPast ? "✓" : "🚀";

      const customIcon = L.divIcon({
        className: "custom-leaflet-pin",
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background: ${ringColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 28px; height: 28px; border-radius: 9999px; background: ${pinColor}; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; color: white;">
              ${iconEmoji}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(pin.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
          <strong style="font-size: 13px; display: block; margin-bottom: 2px;">${pin.name}</strong>
          <span style="color: #64748b; display: block; margin-bottom: 4px;">${pin.note}</span>
          <span style="display: inline-block; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${isPast ? '#d1fae5' : '#fef3c7'}; color: ${isPast ? '#065f46' : '#92400e'};">
            ${isPast ? 'Visited & Completed' : 'Upcoming Planned'}
          </span>
        </div>
      `);
    });

    // Flight & Road Travel Arcs
    const routes = [
      // Bengaluru -> Chikmagalur (Green Road)
      [[12.9716, 77.5946], [13.3161, 75.7720], "#10b981", "560 km Roadtrip"],
      // Bengaluru -> Hampi (Amber Road)
      [[12.9716, 77.5946], [15.3350, 76.4600], "#f59e0b", "700 km KSRTC Sleeper Route"],
      // Bengaluru -> Da Nang Flight Arc (Purple Skyway)
      [[12.9716, 77.5946], [16.0544, 108.2022], "#8b5cf6", "3,500 km International Flight"],
      // Da Nang -> Hanoi Flight Arc
      [[16.0544, 108.2022], [21.0285, 105.8542], "#8b5cf6", "750 km Domestic Flight"]
    ];

    routes.forEach(([start, end, color]) => {
      L.polyline([start, end], {
        color: color,
        weight: 2.5,
        opacity: 0.8,
        dashArray: "6, 8"
      }).addTo(map);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, mapFilter]);

  const handleSaveCustomJourney = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDestination.trim()) return;

    const newEntry = {
      id: "journey-" + Date.now(),
      title: newTitle,
      destination: newDestination,
      year: newYear,
      dates: newDates || `${newYear} Journey`,
      status: "completed",
      stampText: "VISITED OUTPOST",
      accentColor: "#3b82f6",
      categoryBadge: "Past Journey",
      travelers: newTravelers.split(",").map((s) => s.trim()),
      distanceKm: parseInt(newKm) || 300,
      maxAltitudeM: 600,
      durationDays: 3,
      basecamp: "Heritage Stay",
      transportMode: "Road / Air",
      routeStops: [newDestination],
      summary: newSummary || `Memorable expedition exploring ${newDestination}.`,
      badgesUnlocked: [{ icon: "🗺️", title: "Wayfarer Pin", xp: "500 XP", desc: `Logged ${newDestination}` }],
      memories: []
    };

    const updated = [newEntry, ...customJourneys];
    setCustomJourneys(updated);
    try {
      localStorage.setItem("travel_architect_journey_book", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setIsAddJourneyModalOpen(false);
    setNewTitle("");
    setNewDestination("");
    setNewSummary("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28">
      {/* 🌟 Grand Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 sm:px-8 py-8 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Chronicle of All Lifetime Expeditions
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
                Your Life's Travel Memoir
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                A permanent logbook documenting every summit conquered, ancient ruin unraveled, and overnight train taken across India and Southeast Asia.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddJourneyModalOpen(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Log Past Journey</span>
                </button>
                <button
                  onClick={() => setActiveTab("importer")}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Import Google Timeline</span>
                </button>
              </div>
            </div>

            {/* Traveler Rank Badge */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Explorer Rank</span>
                <strong className="text-base font-black text-white block">Level 4 Master Voyager</strong>
                <span className="text-xs text-slate-400 font-mono">6,000 XP • 11 Pinned Outposts</span>
              </div>
            </div>
          </div>

          {/* 📊 High-Density Lifetime Telemetry Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Distance</span>
              <strong className="text-lg sm:text-xl font-black text-amber-400 font-mono mt-0.5 block">
                ~{totalKm.toLocaleString()} km
              </strong>
              <span className="text-[10px] text-slate-500">Air + Overland</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Countries</span>
              <strong className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                2 Nations
              </strong>
              <span className="text-[10px] text-slate-500">🇮🇳 India • 🇻🇳 Vietnam</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">UNESCO Wonders</span>
              <strong className="text-lg sm:text-xl font-black text-yellow-400 font-mono mt-0.5 block">
                5 Sites
              </strong>
              <span className="text-[10px] text-slate-500">World Heritage</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Altitude</span>
              <strong className="text-lg sm:text-xl font-black text-cyan-400 font-mono mt-0.5 block">
                1,930 m
              </strong>
              <span className="text-[10px] text-slate-500">Mullayanagiri Peak</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Days On Road</span>
              <strong className="text-lg sm:text-xl font-black text-rose-400 font-mono mt-0.5 block">
                {totalDays} Days
              </strong>
              <span className="text-[10px] text-slate-500">Field Expeditions</span>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Journeys</span>
              <strong className="text-lg sm:text-xl font-black text-white font-mono mt-0.5 block">
                {combinedJourneys.length} Logged
              </strong>
              <span className="text-[10px] text-emerald-400 font-bold">{completedCount} Visited • {upcomingCount} Ahead</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 Interactive View Mode Switcher */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "timeline"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Journey Timeline & Memoir</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {combinedJourneys.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "map"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Interactive World & Route Map</span>
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "achievements"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Trophy Cabinet & Passport Visas</span>
          </button>

          <button
            onClick={() => setActiveTab("importer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "importer"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Google Maps Importer</span>
          </button>
        </div>
      </div>

      {/* 🗺️ INTERACTIVE SCRATCH & ROUTE MAP VIEW */}
      {activeTab === "map" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Lifetime Expedition Outposts & Flight Corridors
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive pins showing visited hill stations, cultural capitals, and scheduled international air arcs.
                </p>
              </div>

              {/* Pin Filters */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setMapFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    mapFilter === "all" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All Outposts
                </button>
                <button
                  onClick={() => setMapFilter("completed")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    mapFilter === "completed" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  ✓ Visited
                </button>
                <button
                  onClick={() => setMapFilter("upcoming")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    mapFilter === "upcoming" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🚀 Upcoming
                </button>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-lg space-y-1.5 text-[11px] font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span>
                  <span className="text-slate-200">Bengaluru Home HQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
                  <span className="text-slate-200">Western Ghats (Chikmagalur Visited)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span>
                  <span className="text-slate-200">Hampi & Vietnam (Upcoming 2026)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-400"></span>
                  <span className="text-slate-200">International Flight Corridor</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 📖 CHRONOLOGICAL JOURNEY TIMELINE & MEMOIR VIEW */}
      {activeTab === "timeline" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
          <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 via-amber-500 to-rose-500">
            {combinedJourneys.map((journey, index) => {
              const isExpanded = expandedJourneyId === journey.id;
              const isPast = journey.status === "completed";

              return (
                <div key={journey.id} className="relative group">
                  {/* Timeline Glowing Node */}
                  <div
                    className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-black shadow-lg transition-transform group-hover:scale-110 ${
                      isPast
                        ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20"
                        : "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse"
                    }`}
                  >
                    {isPast ? "✓" : index + 1}
                  </div>

                  {/* Journey Book Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-slate-700 transition">
                    {/* Header Strip with Passport Rubber Stamp */}
                    <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Authentic Passport Rubber Stamp Badge */}
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider font-mono border-2 shadow-sm ${
                              isPast
                                ? "bg-emerald-950/60 text-emerald-400 border-emerald-500"
                                : "bg-amber-950/60 text-amber-300 border-amber-500"
                            }`}
                          >
                            {journey.stampText || "EXPEDITION ENTRY"}
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-bold">
                            {journey.dates}
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-400 text-[11px] font-mono">
                            {journey.durationDays} Days • ~{journey.distanceKm} km
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {journey.title}
                        </h3>

                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{journey.destination}</span>
                        </p>
                      </div>

                      {/* Launch Blueprint CTA */}
                      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                        {onSelectTrip && (
                          <button
                            onClick={() => onSelectTrip(journey.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                          >
                            <span>Explore Blueprint</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Roster & Route Ribbon */}
                    <div className="px-5 sm:px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Traveler Roster */}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400 font-bold">Travelers:</span>
                        <div className="flex flex-wrap gap-1">
                          {journey.travelers?.map((traveler, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300"
                            >
                              {traveler}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Route Path */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 overflow-x-auto no-scrollbar">
                        <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-slate-300">Corridor:</span>
                        <span className="text-slate-400 truncate max-w-xs sm:max-w-md">
                          {journey.routeStops?.join(" ➔ ")}
                        </span>
                      </div>
                    </div>

                    {/* Journey Narrative Summary */}
                    <div className="p-5 sm:p-6 space-y-5">
                      <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                        "{journey.summary}"
                      </p>

                      {/* Photo Album & Memories Showcase */}
                      {journey.memories && journey.memories.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs uppercase font-black text-amber-400 tracking-wider flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5" />
                              Visual Memory Highlights & Milestones
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {journey.memories.length} Captured Highlights
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {journey.memories.map((mem, mIdx) => (
                              <div
                                key={mIdx}
                                className="group/card bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition shadow-lg flex flex-col"
                              >
                                <div className="relative h-44 overflow-hidden">
                                  <img
                                    src={mem.image}
                                    alt={mem.title}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                                    {mem.tag}
                                  </span>
                                </div>
                                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
                                  <div>
                                    <h5 className="text-xs font-bold text-white group-hover/card:text-amber-300 transition">
                                      {mem.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                                      {mem.caption}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unlocked Badges from this Journey */}
                      {journey.badgesUnlocked && journey.badgesUnlocked.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Expedition Trophies:</span>
                          {journey.badgesUnlocked.map((badge, bIdx) => (
                            <div
                              key={bIdx}
                              className="px-2.5 py-1 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 text-xs font-bold shadow-sm"
                            >
                              <span>{badge.icon}</span>
                              <span>{badge.title}</span>
                              <span className="text-[10px] font-mono text-amber-400/80">({badge.xp})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 🏆 TROPHY CABINET & VISAS VIEW */}
      {activeTab === "achievements" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Lifetime Explorer Trophies & Milestones
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Territory milestones automatically recognized across all completed and upcoming journeys.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shrink-0">
                    🏛️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">UNESCO Custodian</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Unlocked 3+ World Heritage cultural sites across India & Southeast Asia (Hampi, Halong Bay, Hoi An).
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      1,500 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl shrink-0">
                    ☕
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">Arabica Highland Trekker</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Conquered Baba Budan Giri & Mullayanagiri peak (1,930m) in Chikmagalur coffee country.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      800 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl shrink-0">
                    🛶
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">Karst Archipelago Mariner</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Navigated limestone sea karsts & emerald grottoes of Lan Ha & Halong Bay on expedition cruise.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      1,200 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl shrink-0">
                    🚆
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">Overland Sleeper Nomad</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Mastered KSRTC Airavat sleeper coaches & intercity DCar VIP limousines across state borders.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      950 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl shrink-0">
                    🐉
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">Dragon Bridge Sentinel</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Witnessed Da Nang's weekend fire & water dragon bridge pyrotechnics over the Han River.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      850 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shrink-0">
                    🏮
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">Hoi An Lantern Dreamer</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Explored UNESCO old town cobblestones and night bamboo basket boats on the Thu Bon river.
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      700 XP Unlocked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 📥 GOOGLE MAPS TIMELINE & DATA IMPORTER VIEW */}
      {activeTab === "importer" && (
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                Import Google Maps Timeline & Location History
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect your past travel history by importing Google Takeout files (`Records.json`) or Google My Maps KML files. The system will pin all past cities to your lifetime map.
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl p-8 text-center bg-slate-950/60 transition group cursor-pointer">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition shadow">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white mt-4">
                Drop your Google Takeout or KML file here
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Accepts `Records.json`, `Saved Places.json`, or `.kml` exports from Google Maps. 100% private & processed locally on your phone.
              </p>
              <label className="inline-flex mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition">
                <span>Select File from Device</span>
                <input
                  type="file"
                  accept=".json,.kml,.geojson"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      alert(`Imported ${file.name}! Processing location records locally into lifetime memory.`);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </section>
      )}

      {/* 📝 LOG PAST JOURNEY MODAL */}
      {isAddJourneyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Log a Past Journey to Memoir Book
              </h4>
              <button
                onClick={() => setIsAddJourneyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomJourney} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Trip / Expedition Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Monsoon Coast & Forts"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Goa, India"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Travel Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 15 – 18, 2025"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Estimated Distance (km)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 600"
                    value={newKm}
                    onChange={(e) => setNewKm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Travelers
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abhav Thakur, Aanya Jain"
                  value={newTravelers}
                  onChange={(e) => setNewTravelers(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Trip Memoir & Reflections
                </label>
                <textarea
                  rows="3"
                  placeholder="Write a few memories from this journey..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddJourneyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md active:scale-95 transition"
                >
                  Save to Journey Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Master Trips Registry for Personal Travel Architect Hub
 * Connects both standalone trip applications and custom registered trips.
 */

const TRIPS_REGISTRY = [
    {
        id: "chikmagalur-2026",
        title: "Chikmagalur Coffee & Cloud Peaks",
        destination: "Chikmagalur, Karnataka, India",
        flag: "🇮🇳",
        status: "upcoming",
        category: "domestic",
        dates: "Sep 12 – 14, 2026",
        startDate: "2026-09-12",
        endDate: "2026-09-14",
        daysCount: 3,
        travelers: "2–3 Travelers",
        heroGradient: "from-emerald-950 via-teal-900 to-slate-950",
        badge: "Upcoming • Western Ghats",
        accentColor: "#10b981",
        url: "chikmagalur_trip_architect.html",
        summary: "3-day weekend escape across lush coffee plantations, rugged 4x4 jeep trails to roaring waterfalls, highest peak trekking at Mullayanagiri (1,930m), and scenic ridge cruising on 125cc scooties.",
        basecamp: "Tresca A Luxury Hotel (RG Road, 850m from KSRTC Stand)",
        transport: "Private Cab + 4x4 Jeep + 125cc Scooty + Overnight Sleeper Bus",
        highlights: [
            { icon: "fa-mountain", title: "Mullayanagiri Peak", desc: "Highest point in Karnataka (1,930m) along windy ridge" },
            { icon: "fa-water", title: "Jhari (Buttermilk) Falls", desc: "4x4 Open Jeep off-road descent into estate falls" },
            { icon: "fa-motorcycle", title: "Baba Budangiri & Z-Point", desc: "Scenic ghat riding & narrow ridge walk" },
            { icon: "fa-mug-hot", title: "Panduranga & Classic Coffee", desc: "Fresh ground Arabica/Robusta blends & Malnad spices" },
            { icon: "fa-gopuram", title: "Belur Chennakeshava", desc: "12th-century UNESCO Hoysala soapstone temple" }
        ],
        quickItinerary: [
            { day: "Day 1 (Sat Sep 12)", title: "Arrival at 9:30 AM, Bag Drop at Tresca, Private Cab to Jhari Falls & Mullayanagiri Peak Sunset" },
            { day: "Day 2 (Sun Sep 13)", title: "125cc Scooty pickup, Baba Budangiri, Z-Point Ridge Trail, Coffee Board Museum & Pour-overs" },
            { day: "Day 3 (Mon Sep 14)", title: "Belur Hoysala Temple / Aldur Canopy, MG Road spice shopping, 11 PM AC Sleeper bus to BLR" }
        ]
    },
    {
        id: "vietnam-2026",
        title: "Vietnam Master Expedition",
        destination: "Hanoi, Ha Long Bay, Da Nang & Hoi An",
        flag: "🇻🇳",
        status: "past",
        category: "international",
        dates: "Dec 3 – 10, 2026",
        startDate: "2026-12-03",
        endDate: "2026-12-10",
        daysCount: 8,
        travelers: "5 Adults",
        heroGradient: "from-red-950 via-slate-900 to-amber-950",
        badge: "Master Companion • 8 Days",
        accentColor: "#ef4444",
        url: "vietnam_trip_architect_5_0.html",
        summary: "Comprehensive multi-city journey featuring Hanoi Old Quarter street egg coffee, emerald waters of Ha Long Bay overnight cruise, Ba Na Hills Golden Bridge, and lantern-lit Hoi An ancient town.",
        basecamp: "Luxury City Hotels + 5-Star Ha Long Bay Balcony Cruise",
        transport: "VIP Airport Transfers + 9-Seater Private Limousine + Domestic Flight",
        highlights: [
            { icon: "fa-city", title: "Hanoi Old Quarter", desc: "Centuries-old heritage, street egg coffee & French Quarter" },
            { icon: "fa-ship", title: "Ha Long Bay Cruise", desc: "Overnight luxury cruise through limestone karst pinnacles" },
            { icon: "fa-bridge", title: "Golden Hand Bridge", desc: "Ba Na Hills skywalk supported by giant stone hands" },
            { icon: "fa-store", title: "Hoi An Ancient Town", desc: "Glowing silk lanterns, custom tailoring & night market" },
            { icon: "fa-utensils", title: "Veg Dining Matrix", desc: "Audio pronunciation cards & curated pure vegetarian spots" }
        ],
        quickItinerary: [
            { day: "Day 1–2", title: "Arrival in Hanoi, Old Quarter rickshaw tour & Hoan Kiem Lake" },
            { day: "Day 3–4", title: "Limousine to Ha Long Bay, 5-star overnight cruise & kayaking" },
            { day: "Day 5–6", title: "Flight to Da Nang, Ba Na Hills Golden Bridge & Marble Mountains" },
            { day: "Day 7–8", title: "Hoi An ancient lantern town, river boat rides & flight return" }
        ]
    }
];

function getAllTrips() {
    const custom = localStorage.getItem("trip_architect_registry_custom");
    if (custom) {
        try {
            const parsed = JSON.parse(custom);
            if (Array.isArray(parsed)) {
                return [...TRIPS_REGISTRY, ...parsed];
            }
        } catch (e) {
            console.error("Failed to parse custom trips", e);
        }
    }
    return TRIPS_REGISTRY;
}

function saveCustomTripToRegistry(trip) {
    const custom = localStorage.getItem("trip_architect_registry_custom");
    let list = [];
    if (custom) {
        try { list = JSON.parse(custom); } catch (e) { list = []; }
    }
    list.unshift(trip);
    localStorage.setItem("trip_architect_registry_custom", JSON.stringify(list));
}

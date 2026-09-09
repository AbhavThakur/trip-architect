# 🤖 AGENTS.md — AI Maintenance Playbook for Travel Architect Hub

> **Operating Manual for Coding AI Agents (Antigravity, Cursor, Copilot, Claude, ChatGPT)**  
> This file instructs AI agents on how to maintain, update, and add new trips to this repository with zero hallucinations and 100% adherence to established patterns.

---

## 🏛️ System Architecture

This repository uses a **hybrid architecture** that balances lightweight JSON data modeling with deep, customizable standalone experiences:

```text
trip-architect/
├── index.html                       # 🧭 Master Travel Hub & Trip Selector
├── trip.html                        # ⚡ Universal Dynamic JSON Trip Runner (?id=<slug>)
├── trips_registry.js                # 📋 Central Registry of all active & archived trips
├── trip.schema.json                 # 📐 Formal JSON Schema definition for trips
├── data/
│   └── trips/
│       └── <trip-slug>.json         # 📄 Structured trip JSON files (e.g. chikmagalur-2026.json)
├── chikmagalur_trip_architect.html  # ⛰️ Standalone companion for Chikmagalur
├── vietnam_trip_architect_5_0.html  # 🇻🇳 Standalone companion for Vietnam (custom audio & FX)
└── trip_template.html               # 📐 Blank standalone HTML template
```

---

## 🛠️ How an AI Agent Adds a New Trip

When the user asks you to add a new trip (e.g. *"Plan a 4-day trip to Goa in November"* or pastes raw booking notes):

### Step 1: Extract & Structure Data
Extract:
- **ID / Slug**: lowercase hyphenated (e.g. `goa-2026`)
- **Title, Destination, Flag emoji**
- **Dates & Duration**
- **GPS Coordinates** for key spots: `[latitude, longitude]`
- **Day-by-Day Itinerary** with times, categories, and practical tips
- **Basecamp / Stay**: hotel name, check-in/out, arrival strategy, local script address
- **Transport Strategy**: cab, scooty, ferry, or flights
- **Packing Checklist**: 6–8 critical items
- **Emergency SOS Contacts**: local hospital, police, tourist helpline
- **Budget / Cost Estimate**: shared transport & per-person split

### Step 2: Create the Trip JSON File
Create a new file at:  
`data/trips/<trip-slug>.json`

Validate it against [`trip.schema.json`](trip.schema.json).  
*Reference [`data/trips/chikmagalur-2026.json`](data/trips/chikmagalur-2026.json) as the gold standard.*

### Step 3: Register in `trips_registry.js`
Open `trips_registry.js` and add an entry to the `TRIPS_REGISTRY` array:

```javascript
{
    id: "goa-2026",
    title: "Goa Sunshine & Coastal Loops",
    destination: "North & South Goa, India",
    flag: "🌴",
    status: "upcoming", // or "past"
    category: "domestic", // "domestic" | "international" | "roadtrip"
    dates: "Nov 12 – 16, 2026",
    startDate: "2026-11-12",
    endDate: "2026-11-16",
    daysCount: 4,
    travelers: "2 Travelers",
    heroGradient: "from-blue-950 via-teal-900 to-slate-950",
    badge: "Coastal • Beach Escape",
    accentColor: "#06b6d4",
    url: "trip.html?id=goa-2026", // Uses the universal engine!
    summary: "Beach hopping, vintage Latin Quarter fontainhas walks, and sunset cruise.",
    basecamp: "Heritage Villa, Anjuna",
    transport: "Self-drive Thar / Scooty",
    highlights: [
        { icon: "fa-umbrella-beach", title: "Ashwem Beach", desc: "Tranquil sands & seaside cafes" },
        { icon: "fa-church", title: "Old Goa Churches", desc: "Basilica of Bom Jesus" }
    ],
    quickItinerary: [
        { day: "Day 1", title: "Arrival, Thar pickup, sunset at Chapora Fort" },
        { day: "Day 2", title: "Fontainhas heritage walk & Mandovi river dinner cruise" }
    ]
}
```

### Step 4: Verify
- Check that `trip.html?id=<trip-slug>` loads cleanly.
- Verify Leaflet pins appear in the map bounds.
- Verify `index.html` shows the new trip card with its preview drawer working.

---

## 🎨 UI & Design Rules for AI Agents

1. **Color Gradients**: Use deep, elegant Tailwind gradients (e.g. `from-emerald-950 via-teal-900 to-slate-950`, `from-rose-950 via-slate-900 to-amber-950`). Never use generic neon bright colors.
2. **Category Marker Pins**:
   - `stay` / Hotel → `pin-rose` (`fa-hotel`)
   - `nature` / Falls / Coast → `pin-cyan` (`fa-water` or `fa-tree`)
   - `viewpoint` / Peak / Ridge → `pin-emerald` (`fa-mountain`)
   - `food` / Cafes / Dining → `pin-amber` (`fa-utensils` or `fa-mug-hot`)
   - `culture` / Temples / Heritage → `pin-purple` (`fa-gopuram` or `fa-landmark`)
   - `transport` / Rentals / Stations → `pin-blue` (`fa-car` or `fa-motorcycle`)
   - `shopping` / Spices / Markets → `pin-blue` (`fa-bag-shopping`)
3. **No Placeholders**: Always supply realistic GPS coordinates, local language translation if applicable, and actual operating tips.
4. **Offline First**: All assets must work with standard CDNs or cached via `sw.js`.

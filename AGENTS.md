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

You can add a new trip using either the **Automated Generator CLI** (recommended) or the **Manual Step-by-Step** process.

### Option A: Automated CLI Generation (Fastest & Schema-Safe)
Run:
```bash
npm run generate-trip -- --dest "<Destination>" --from "<Origin>" --days <N> --start "YYYY-MM-DD"
```
This automatically:
1. Validates against [`trip.schema.json`](trip.schema.json).
2. Saves both `data/trips/<slug>.json` and `src/data/trips/<slug>.json`.
3. Registers the trip in `trips_registry.js` (Standalone Hub) and `src/data/trips/registry.js` (React PWA).

---

### Option B: Manual Step-by-Step Creation
Extract:
- **ID / Slug**: lowercase hyphenated (e.g. `ooty-2026`)
- **Title, Destination, Flag emoji**
- **Dates & Duration**
- **GPS Coordinates** for key spots: `[latitude, longitude]`
- **Day-by-Day Itinerary** with times, categories, and practical tips
- **Basecamp / Stay**: hotel name, check-in/out, arrival strategy, local script address
- **Transport Strategy**: cab, scooty, ferry, or flights
- **Pre-Departure & Gear Checklist (`checklist` & `packingList`)**: ALWAYS mandatory for every trip. Include a rich phased checklist (`checklist`) covering:
  1. *Rentals & Commute*: Valid Driving License, 360° vehicle inspection video, rider & pillion helmets, fuel pumps, and rental breakdown contacts.
  2. *Important Things to Carry*: Terrain-appropriate shoes with rubber grip, UV sunglasses, broad-rimmed sun hat, high SPF 50+ sunscreen, insulated water bottle, modest temple attire.
  3. *Travel Documentation & Offline Bookings*: Original Govt photo ID, offline PNR tickets/boarding passes, pre-booked monument QR tickets, downloaded offline map area.
  4. *Health, Hydration & First Aid*: Electrolytes (ORS/Electral), blister band-aids, pain relief spray/balm, mosquito repellent (Odomos), personal prescription medicines.
  5. *Electronics, Tech & Cash*: High-capacity power bank (10k–20k mAh), microfiber lens cloth, waterproof phone pouch, small cash denominations (₹10, ₹20, ₹50, ₹100).
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
    id: "ooty-2026",
    title: "Ooty & Nilgiri Hills Expedition",
    destination: "Ooty, Nilgiris, Tamil Nadu, India",
    flag: "🌲",
    status: "upcoming", // or "past"
    category: "domestic", // "domestic" | "international" | "roadtrip"
    dates: "Oct 15 – 18, 2026",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    daysCount: 3,
    travelers: "2 Travelers",
    heroGradient: "from-emerald-950 via-teal-900 to-slate-950",
    badge: "Hill Station • Nilgiri Highlands",
    accentColor: "#10b981",
    url: "trip.html?id=ooty-2026", // Uses the universal engine!
    summary: "Nilgiri toy train ride, botanical garden picnic, tea factory tour, and Doddabetta peak views.",
    basecamp: "Sterling Ooty Fern Hill",
    transport: "KSRTC Airavat Sleeper Bus + Local Cab",
    highlights: [
        { icon: "fa-train", title: "Nilgiri Mountain Railway", desc: "UNESCO heritage toy train ride" },
        { icon: "fa-leaf", title: "Tea Plantations & Factory", desc: "Fresh CTC & orthodox tea tasting" }
    ],
    quickItinerary: [
        { day: "Day 1", title: "Arrival, check-in, Doddabetta peak & botanical gardens" },
        { day: "Day 2", title: "Toy train ride to Coonoor, tea factory tour & Sim's park" }
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

---

## 🔒 Strict Trip Data Isolation & Zero Cross-Contamination Rule

**CRITICAL MANDATE FOR ALL AI AGENTS & DEVELOPERS:**
1. **Never Hardcode Fallbacks to Specific Trips**:
   - Never write fallbacks like `trip?.id || "hampi-2026"` or `trip?.quickBookings || [ ...hampi items... ]`.
   - Never default generic strings to one destination's hotels, buses, or local languages (e.g. defaulting non-Vietnam trips to Kannada or Hampi stays).
2. **Dynamic Derivation**:
   - If a trip does not provide explicit `quickBookings`, derive them dynamically from that specific trip's `flights`, `stays`, `transit`, and `limoTransfers`. If none exist, display a clean empty state (`[]`), NEVER another trip's reservations.
3. **State & Cache Isolation**:
   - All browser storage keys must be scoped to the specific trip ID (e.g., `travel_architect_bookings_${tripId}`).
   - When switching trips, components must reset internal state and reload data strictly for the new trip ID.


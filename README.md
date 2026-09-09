# 🧭 Travel Architect Hub

> **Personal Travel Architect & AI-Maintained Expedition Engine**  
> An offline-first, mobile-optimized progressive web application (PWA) to architect, navigate, and preserve road trips and international journeys.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-trip--architect--plan.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://trip-architect-plan.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-violet.svg)](manifest.json)
[![AI Maintained](https://img.shields.io/badge/AI%20Maintained-AGENTS.md-amber.svg)](AGENTS.md)

---

## 🌟 Overview & Architecture

Travel Architect Hub solves the problem of fragmented travel notes and scattered documents by establishing a **Hybrid AI-Maintained Architecture**:

1. **Master Selection Deck (`index.html`)**: Executive Bento Box 2.0 interface with multi-trip search, category filters, interactive preview drawer, budget calculator, and an in-browser **AI Itinerary Copilot**.
2. **Universal Dynamic JSON Runner (`trip.html?id=<slug>`)**: A unified, responsive trip viewer that dynamically parses and renders rich itineraries from `data/trips/<slug>.json` (or browser storage). Features synchronized Leaflet maps, day filters, interactive packing checklists, driver cards, and SOS contacts.
3. **Dedicated Bespoke Companions**: High-polish custom single-page apps (`vietnam_trip_architect_5_0.html` and `chikmagalur_trip_architect.html`) with embedded audio phrasebooks, currency converters, and local cultural guides.
4. **AI Maintenance Engine (`AGENTS.md` & `trip.schema.json`)**: A formalized contract and JSON schema enabling any AI coding agent (Antigravity, Cursor, Claude, Copilot) or in-browser model (Gemini 2.5 Flash) to generate and integrate complete trips with zero hallucination.

```text
trip-architect/
├── index.html                       # 🧭 Master Hub & Deck (Bento 2.0 UI + AI Copilot Modal)
├── trip.html                        # ⚡ Universal Dynamic Trip Engine (?id=<slug>)
├── trips_registry.js                # 📋 Central Registry of active, upcoming & past journeys
├── trip.schema.json                 # 📐 Formal JSON Schema defining trip structure
├── AGENTS.md                        # 🤖 AI Agent Playbook for auto-generating & maintaining trips
├── data/
│   └── trips/
│       └── chikmagalur-2026.json    # 📄 Chikmagalur master plan in pure structured JSON
├── chikmagalur_trip_architect.html  # ⛰️ Chikmagalur 3-Day Standalone Companion (12 GPS pins)
├── vietnam_trip_architect_5_0.html  # 🇻🇳 Vietnam 8-Day Master Companion (v5.0 with Audio/VND)
├── trip_template.html               # 📐 Turn-Key Blueprint Template for custom standalone pages
├── manifest.json                    # 📱 PWA installation manifest (iOS/Android home screen)
├── sw.js                            # ⚡ Offline Service Worker caching & PWA engine
├── vercel.json                      # ▲ Vercel zero-config deployment rules
├── netlify.toml                     # 🌐 Netlify deployment configuration
├── package.json                     # 📦 Project metadata & dev scripts
└── styles.css                       # 🎨 Shared Liquid Glass styling & design tokens
```

---

## 🚀 Key Features

### 1. Master Command Hub (`index.html`)
- **Executive Bento 2.0 Deck**: Live trip countdowns, altitude chips, weather badges, and expedition stats.
- **Search & Category Filters**: Search sights, towns, and food across all expeditions (All, Domestic, International, Upcoming, Completed).
- **Slide-Over Quick Preview Drawer**: Inspect full day-by-day plans without leaving the central hub.
- **Budget & Shared Cost Splitter**: Pre-calculated group splits for cabs, 4x4 jeeps, and rental scooties.
- **🪄 In-Browser AI Itinerary Copilot**: Paste raw text, WhatsApp flight notes, or booking emails. Supports Google Gemini API key or automatic local heuristic parser to create ready-to-run trips instantly.

### 2. Universal Dynamic JSON Engine (`trip.html`)
- **Zero-Code Trip Ingestion**: Simply add `data/trips/<slug>.json` to render a complete interactive trip experience.
- **Synchronized Leaflet GPS Map**: Automatically computes bounds and plots all itinerary spots with custom pins and popups.
- **Interactive Packing Checklist**: Category grouping (Clothing, Documents, Tech, Toiletries) with live progress bar and local storage state.
- **Emergency & Driver Cards**: One-tap phone dialing, WhatsApp messaging, and Kannada/local language driver instruction cards.

### 3. Dedicated Bespoke Companions
- **Chikmagalur (`chikmagalur_trip_architect.html`)**: 12 GPS pins covering Mullayanagiri (1,930m peak), Jhari Falls 4x4 route, Hirekolale Lake, Baba Budangiri, Z-Point, and Panduranga Coffee, with scooty guidelines and Kannada cab prompts.
- **Vietnam (`vietnam_trip_architect_5_0.html`)**: Complete 8-day expedition with VND currency converter, interactive Vietnamese audio flashcards, grab safety tips, and packing trackers.

---

## 🤖 How AI Maintains This Website

We designed this repository so AI assistants can do 100% of the heavy lifting.

### Method 1: Ask Any AI Coding Assistant (Antigravity / Cursor / Copilot)
Simply prompt the AI:
> *"Here is my itinerary for 4 days in Hampi / Bali / Ladakh. Please add it to my Trip Architect using the `AGENTS.md` playbook."*

The AI will:
1. Validate against [trip.schema.json](trip.schema.json).
2. Write `data/trips/<slug>.json`.
3. Register the trip in [trips_registry.js](trips_registry.js).
4. The trip immediately appears on the Hub and opens in `trip.html?id=<slug>`.

### Method 2: Use the In-Browser AI Copilot (No Code)
1. Open the [Live Site](https://trip-architect-plan.vercel.app/) or `index.html`.
2. Click **`🪄 AI Copilot`** in the top navigation.
3. Paste unformatted notes or hotel confirmations.
4. Click **Parse with AI** — the trip is instantly saved to your browser and launches in `trip.html`.

### Method 3: Standalone Custom HTML
Duplicate `trip_template.html`, customize, and link in `trips_registry.js` for trips that need custom audio, custom converters, or unique visual shaders.

---

## 💻 Local Development

Run locally with any static web server:

```bash
# Python 3
python3 -m http.server 3000

# or Node.js
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 🚢 Deployment

The repository is configured for zero-config continuous deployment:

### Vercel (Current Production)
Pushing to the `main` branch automatically triggers deployment to:
**[https://trip-architect-plan.vercel.app/](https://trip-architect-plan.vercel.app/)**

### Netlify
Connect this repository to Netlify; `netlify.toml` handles caching headers and PWA service workers out-of-the-box.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

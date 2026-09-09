# 🧭 Travel Architect Hub

> **Personal Travel Architect & Master Multi-Trip Hub**  
> An offline-first, mobile-optimized progressive web application (PWA) to architect, navigate, and preserve road trips and international expeditions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-blue.svg)](manifest.json)

---

## 🌟 Overview & Architecture

Travel Architect Hub solves the problem of fragmented travel notes and scattered documents by establishing a **Centralized Selection Deck** paired with **Standalone, Deep-Dive Trip Companions**.

```text
trip-architect/
├── index.html                       # 🧭 Master Hub & Trip Selection Deck (Bento 2.0 UI)
├── trips_registry.js                # 📋 Central Registry of all active & archived journeys
├── chikmagalur_trip_architect.html  # ⛰️ Chikmagalur 3-Day Master Companion
├── vietnam_trip_architect_5_0.html  # 🇻🇳 Vietnam 8-Day Master Companion (v5.0)
├── trip_template.html               # 📐 Turn-Key Blueprint Template for future trips
├── manifest.json                    # 📱 PWA installation manifest (iOS/Android home screen)
├── sw.js                            # ⚡ Offline Service Worker caching
├── vercel.json                      # ▲ Vercel zero-config deployment rules
├── netlify.toml                     # 🌐 Netlify deployment configuration
├── package.json                     # 📦 Project metadata & dev scripts
└── styles.css                       # 🎨 Design system & Liquid Glass tokens
```

---

## 🚀 Key Features

### 1. Master Command Hub (`index.html`)
- **Executive Bento 2.0 Deck**: Live trip countdowns, altitude & weather chips, and expedition stats.
- **Instant Search & Category Filters**: Search sights, towns, and food across all journeys.
- **Slide-over Quick Preview Drawer**: View day-by-day plans without leaving the central hub.
- **Budget & Shared Cost Splitter**: Pre-calculated group splits for cabs, 4x4 jeeps, and scooty rentals.
- **One-Click Trip Generator**: Add new journeys directly in the browser with instant local storage persistence.

### 2. Chikmagalur Master Companion (`chikmagalur_trip_architect.html`)
- **Interactive Day-by-Day Timeline**: Hour-by-hour milestones with strategy tips.
- **Synchronized Leaflet Map**: 12 custom pins across Mullayanagiri (1,930m peak), Jhari Falls, Hirekolale Lake, Baba Budangiri, Z-Point, and Panduranga Coffee.
- **Auto / Driver Card in Kannada**: Local language translation (`ಟ್ರೆಸ್ಕಾ ಎ ಲಕ್ಸುರಿ ಹೋಟೆಲ್...`) with one-tap Google Maps directions.
- **Tresca 9:30 AM Strategy**: Cloakroom bag drop guide and RG Road dining logistics.
- **125cc Scooty Guidelines**: Mountain power advice and rental hub locations.
- **Packing Progress Tracker**: Real-time percentage counter with automatic browser persistence.
- **Emergency SOS Directory**: Quick dial for KSRTC inquiry, Forest Checkpost, and District Hospital.

### 3. Vietnam Master Companion (`vietnam_trip_architect_5_0.html`)
- Comprehensive 8-day expedition across Hanoi, Ha Long Bay luxury cruise, Da Nang Golden Bridge, and Hoi An lantern ancient town.
- Real-time VND ⇄ INR Currency Converter.
- Pure vegetarian dining matrix & Vietnamese audio pronunciation flashcards.
- 9-Seater Luxury Limousine logistics matrix & airport VIP immigration fast-track.
- Direct **`← Trip Hub`** navigation button to return to the selection deck.

### 4. Offline-First PWA (Progressive Web App)
- Works without internet when driving through mountain ghats or cruising bays.
- Installable directly to your iPhone or Android home screen with full-screen experience.

---

## 🛠️ Local Development

To run the project locally on your machine:

### Option A: Open directly in your browser
Double-click `index.html` or run:
```bash
open index.html
```

### Option B: Run a local static server
```bash
npm run dev
# Or
npx serve . -l 3000
```
Open `http://localhost:3000` in your browser.

---

## 🚢 Deployment

### 1. Deploy to Vercel (Recommended)
Using the Vercel CLI:
```bash
npx vercel
```
Or connect this repository directly in the [Vercel Dashboard](https://vercel.com/new).

### 2. Deploy to Netlify
Using the Netlify CLI:
```bash
npx netlify deploy --prod
```
Or drag and drop this project folder in the [Netlify App](https://app.netlify.com/drop).

### 3. Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Branch**, select `main` and root `/` folder, then click **Save**.

---

## ➕ How to Add Your Next Trip

### Method A: In-Browser (Instant)
1. Click **`+ Add Trip`** in the top navigation bar of `index.html`.
2. Fill in the destination, dates, and basecamp.
3. The trip card is immediately created and saved in your browser's local storage.

### Method B: Dedicated Standalone HTML Companion
1. Duplicate `trip_template.html` and name it after your destination (e.g. `japan_trip_architect.html` or `goa_trip_architect.html`).
2. Add your custom itinerary points and Leaflet map GPS coordinates.
3. Add one entry in `trips_registry.js`:
```javascript
{
    id: "japan-2027",
    title: "Japan Autumn Expedition",
    destination: "Tokyo, Kyoto & Osaka, Japan",
    flag: "🇯🇵",
    status: "upcoming",
    category: "international",
    dates: "Nov 5 – 15, 2027",
    url: "japan_trip_architect.html",
    summary: "Autumn foliage, bullet trains, and Kyoto shrine walks.",
    basecamp: "Hotel Gracery Shinjuku",
    transport: "JR Shinkansen Pass + Tokyo Metro",
    highlights: [ ... ]
}
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

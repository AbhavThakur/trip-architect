#!/usr/bin/env node
/**
 * 🧭 Master Travel Architect — Autonomous Trip Generator CLI
 * 
 * Generates production-ready, schema-validated trip JSON files adhering to trip.schema.json,
 * automatically registers them into trips_registry.js, and syncs to both standalone and React PWA hubs.
 * 
 * Usage:
 *   node scripts/generate_trip.mjs --dest "Goa" --from "Bengaluru" --days 4
 *   node scripts/generate_trip.mjs --dest "Hampi" --from "Bengaluru" --days 3 --start "2026-11-12"
 *   node scripts/generate_trip.mjs --import path/to/trip.json
 *   node scripts/generate_trip.mjs --list
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

// Category pin mapping per AGENTS.md
const CATEGORY_PIN_MAP = {
  stay: { color: 'pin-rose', icon: 'fa-hotel' },
  nature: { color: 'pin-cyan', icon: 'fa-water' },
  viewpoint: { color: 'pin-emerald', icon: 'fa-mountain' },
  food: { color: 'pin-amber', icon: 'fa-utensils' },
  culture: { color: 'pin-purple', icon: 'fa-landmark' },
  transport: { color: 'pin-blue', icon: 'fa-bus' },
  shopping: { color: 'pin-blue', icon: 'fa-bag-shopping' }
};

/**
 * Generates a comprehensive phased pre-departure checklist covering:
 * 1. Rentals & autonomous commute (DL, vehicle check video, helmets, fuel)
 * 2. Essential gear & weather protection (sun, hydration, footwear, attire)
 * 3. Travel documentation & offline bookings (Govt ID, tickets, passes, offline maps)
 * 4. Health, hydration & first aid (ORS, blister care, pain relief, insect repellent)
 * 5. Electronics, photography & cash practicalities (power bank, lens care, pouch, cash)
 */
export function buildDefaultPhasedChecklist(destination = "Destination", params = {}) {
  const destName = (destination || "Destination").split(",")[0].trim();
  return [
    {
      phase: "Phase 1: Rentals & Autonomous Commute",
      badge: "Transport",
      items: [
        {
          id: "chk_rent_1",
          text: "Original Driving License (Physical Card or DigiLocker / mParivahan)",
          desc: `Mandatory for scooter / car handover in ${destName}. Ensure license category covers two-wheeler / LMV.`,
          defaultChecked: true
        },
        {
          id: "chk_rent_2",
          text: "Vehicle Inspection & 360° Walkaround Video",
          desc: "Inspect brakes, headlights, fuel level, mirrors, and tires; record a 30-sec timestamped video before leaving shop.",
          defaultChecked: true
        },
        {
          id: "chk_rent_3",
          text: "Helmets for Both Rider & Pillion",
          desc: "Mandatory traffic safety law across national & state highways; verify functional strap & clear visor.",
          defaultChecked: true
        },
        {
          id: "chk_rent_4",
          text: "Locate Fuel Pumps & Keep Fuel Cash Reserve",
          desc: `Note nearest petrol stations in ${destName} and keep ₹500 cash handy for refueling.`,
          defaultChecked: false
        },
        {
          id: "chk_rent_5",
          text: "Store Rental Vendor & Local Breakdown Contacts",
          desc: "Keep local mechanic or breakdown support number saved on phone for remote stretches.",
          defaultChecked: false
        }
      ]
    },
    {
      phase: "Phase 2: Important Things to Carry (Weather & Terrain)",
      badge: "Gear & Attire",
      items: [
        {
          id: "chk_gear_1",
          text: "Broad-Rimmed Sun Hat / UPF Cap & UV400 Polarized Sunglasses",
          desc: "Crucial protection against intense sun glare across outdoor sightseeing points.",
          defaultChecked: true
        },
        {
          id: "chk_gear_2",
          text: "Broad-Spectrum Sunscreen (SPF 50+) & Lip Balm",
          desc: "Reapply every 2–3 hours during outdoor explorations to prevent sunburn.",
          defaultChecked: true
        },
        {
          id: "chk_gear_3",
          text: "Sturdy Walking Shoes / Trail Sneakers with Rubber Traction",
          desc: "Non-slip footwear essential for stone steps, boulder viewpoints, and heritage walking trails.",
          defaultChecked: true
        },
        {
          id: "chk_gear_4",
          text: "Insulated 1L Reusable Water Bottles",
          desc: "Stay hydrated throughout the day; refill at basecamp before morning departure.",
          defaultChecked: true
        },
        {
          id: "chk_gear_5",
          text: "Breathable Lightweight Clothing (Temple-Appropriate)",
          desc: "Pack comfortable cottons covering shoulders and knees for active heritage shrines.",
          defaultChecked: false
        },
        {
          id: "chk_gear_6",
          text: "Compact Lightweight Daypack / Sling Bag",
          desc: "Comfortable bag to hold water, sunscreen, and valuables during scooter or walking excursions.",
          defaultChecked: false
        }
      ]
    },
    {
      phase: "Phase 3: Travel Documentation & Bookings",
      badge: "Mandatory",
      items: [
        {
          id: "chk_doc_1",
          text: "Government Photo ID (Aadhaar / Passport / DL)",
          desc: "Required for hotel check-ins, transit terminals, and monument entry checks.",
          defaultChecked: true
        },
        {
          id: "chk_doc_2",
          text: "Confirmed Transit Tickets & Boarding Passes (Offline Copies)",
          desc: "Download offline PDF copies of bus/flight/train tickets with PNRs saved.",
          defaultChecked: true
        },
        {
          id: "chk_doc_3",
          text: "Monument Entry Passes & Activity Vouchers",
          desc: "Pre-book online entry passes (ASI / State Tourism) to avoid long ticket queues.",
          defaultChecked: true
        },
        {
          id: "chk_doc_4",
          text: "Offline Google Maps / Area Map Download",
          desc: `Download the offline map area for ${destName} for seamless navigation without network.`,
          defaultChecked: true
        }
      ]
    },
    {
      phase: "Phase 4: Health, Hydration & First Aid",
      badge: "Wellness",
      items: [
        {
          id: "chk_med_1",
          text: "Oral Rehydration Salts (ORS / Electral Sachets)",
          desc: "Add to water bottle during outdoor excursions to prevent dehydration and fatigue.",
          defaultChecked: true
        },
        {
          id: "chk_med_2",
          "text": "Blister Band-Aids & Antiseptic Wipes",
          desc: "Instant treatment for heel blisters or trail scrapes after long walking days.",
          defaultChecked: true
        },
        {
          id: "chk_med_3",
          text: "Pain Relief Spray or Balm (Volini / Moov)",
          desc: "Quick relief for calf muscle tiredness after hill walks or step climbs.",
          defaultChecked: false
        },
        {
          id: "chk_med_4",
          text: "Mosquito Repellent (Odomos Cream / Spray)",
          desc: "Protection for riverside trails, garden cafes, and evening outdoor dining.",
          defaultChecked: false
        },
        {
          id: "chk_med_5",
          text: "Personal Travel Medical Kit",
          desc: "Paracetamol, antacids, anti-diarrheal, and regular prescription medications.",
          defaultChecked: false
        }
      ]
    },
    {
      phase: "Phase 5: Electronics, Tech & Cash",
      badge: "Essentials",
      items: [
        {
          id: "chk_elec_1",
          text: "10,000–20,000 mAh High-Capacity Power Bank & Cables",
          desc: "Continuous GPS route navigation and photography drain batteries rapidly.",
          defaultChecked: true
        },
        {
          id: "chk_elec_2",
          text: "Microfiber Lens Cleaning Cloth",
          desc: "Keep camera lenses and sunglasses clean from dust and fingerprints.",
          defaultChecked: false
        },
        {
          id: "chk_elec_3",
          text: "Waterproof Phone Pouch / Rain Sleeve",
          desc: "Essential for boat rides, coracle floats, water attractions, or unexpected rain.",
          defaultChecked: false
        },
        {
          id: "chk_elec_4",
          text: "Cash in Small Denominations (₹10, ₹20, ₹50, ₹100)",
          desc: "Crucial for local parking, temple shoe stands, coconut vendors, and spots with patchy UPI.",
          defaultChecked: true
        }
      ]
    }
  ];
}

// Curated high-fidelity templates for popular destinations
const POPULAR_DESTINATION_DATA = {
  goa: {
    title: "Goa Sunshine, Coastal Loops & Latin Quarters",
    destination: "North & South Goa, India",
    flag: "🌴",
    category: "domestic",
    badge: "Coastal • Beach & Heritage Escape",
    accentColor: "#06b6d4",
    heroGradient: "from-blue-950 via-teal-900 to-slate-950",
    summary: "A 4-day coastal expedition featuring vintage Latin Quarter Fontainhas heritage walks, beach hopping across Ashwem and Mandrem, sunset dinner cruises on the Mandovi river, and scenic coastal road cruising on 125cc scooties.",
    mapCenter: [15.4989, 73.8278],
    mapZoom: 11,
    basecamp: {
      name: "Heritage Villa & Resort, Anjuna",
      location: "Near Anjuna Flea Market Road, North Goa",
      distanceFromStation: "18 km (~30 mins) from Thivim Railway Station / 42 km from MOPA Airport",
      checkIn: "01:00 PM",
      checkOut: "11:00 AM",
      arrivalStrategy: "Arrive at 10:30 AM. Drop luggage in resort cloakroom, pick up 125cc scooty rentals at front gate, and grab fresh avocado toast & iced poi sandwiches at Baba Au Rhum before check-in.",
      diningNote: "Walking distance to Anjuna beach shacks (Curlies, Cafe Liliput) and boutique dining (Burger Factory, Gunpowder in Assagao).",
      coords: [15.5808, 73.7431],
      addressLocalScript: "हेरिटेज व्हिला आणि रिसॉर्ट, अंजुना, बार्देश, उत्तर गोवा - ४०३५०९"
    },
    transportPlan: [
      { day: "Day 1 (Thursday)", mode: "Overnight Train/Bus ➔ 125cc Scooty", icon: "fa-motorcycle", timing: "10:30 AM Scooty Pickup", purpose: "Pickup 125cc scooties for flexible coastal loop riding across Anjuna, Vagator & Chapora Fort sunset." },
      { day: "Day 2 (Friday)", mode: "125cc Scooty Loop", icon: "fa-motorcycle", timing: "09:00 AM – 06:00 PM", purpose: "Northern beach hopping via Siolim bridge to Morjim, Ashwem & tranquil Mandrem beach cafes." },
      { day: "Day 3 (Saturday)", mode: "Private AC Cab", icon: "fa-car", timing: "09:30 AM – 09:30 PM", purpose: "Full-day heritage loop: Fontainhas Portuguese Latin quarter walk, Old Goa churches, and Mandovi sunset river cruise." },
      { day: "Day 4 (Sunday)", mode: "125cc Scooty + Airport/Train Transfer", icon: "fa-plane-departure", timing: "Return Scooty 05:00 PM", purpose: "Mapusa spice and cashew market shopping, late lunch at Gunpowder Assagao, transfer to MOPA Airport / Thivim." }
    ],
    locations: [
      { id: "basecamp", name: "Heritage Villa Resort, Anjuna", category: "stay", coords: [15.5808, 73.7431], desc: "Lush tropical resort with pool and scooty parking. 5 mins to beach.", day: 1, time: "10:30 AM Arrival", icon: "fa-hotel", color: "pin-rose" },
      { id: "baba-au-rhum", name: "Baba Au Rhum Cafe", category: "food", coords: [15.5835, 73.7547], desc: "Legendary bamboo grove French bakery, gourmet burgers & artisanal coffee.", day: 1, time: "11:30 AM", icon: "fa-utensils", color: "pin-amber" },
      { id: "chapora-fort", name: "Chapora Fort (Dil Chahta Hai)", category: "viewpoint", coords: [15.6059, 73.7388], desc: "Historic red laterite fort overlooking Vagator beach and Ozran cliffline for iconic sunset.", day: 1, time: "05:00 PM – 06:45 PM", icon: "fa-mountain", color: "pin-emerald" },
      { id: "ashwem-beach", name: "Ashwem & Mandrem Sands", category: "nature", coords: [15.6582, 73.7169], desc: "Uncrowded soft white sands with shallow warm surf and chic seaside shacks.", day: 2, time: "10:00 AM – 02:00 PM", icon: "fa-water", color: "pin-cyan" },
      { id: "assagao-cafes", name: "Assagao Design & Dining Corridor", category: "food", coords: [15.5921, 73.7745], desc: "Tree-shaded village with restored Indo-Portuguese villas, Gunpowder & Jamun.", day: 2, time: "07:30 PM", icon: "fa-bowl-food", color: "pin-amber" },
      { id: "fontainhas", name: "Fontainhas Latin Quarter", category: "culture", coords: [15.4989, 73.8322], desc: "UNESCO recognized quarter with pastel yellow, blue, and terracotta Portuguese houses.", day: 3, time: "10:30 AM – 01:30 PM", icon: "fa-landmark", color: "pin-purple" },
      { id: "bom-jesus", name: "Basilica of Bom Jesus (Old Goa)", category: "culture", coords: [15.5009, 73.9116], desc: "16th century baroque church housing the sacred relics of St. Francis Xavier.", day: 3, time: "02:30 PM – 04:30 PM", icon: "fa-church", color: "pin-purple" },
      { id: "mandovi-cruise", name: "Mandovi Sunset Catamaran Cruise", category: "nature", coords: [15.4998, 73.8291], desc: "1-hour river sunset sail with Goan folk music, breeze, and views of Panaji skyline.", day: 3, time: "05:30 PM – 07:00 PM", icon: "fa-ship", color: "pin-cyan" },
      { id: "mapusa-market", name: "Mapusa Friday / Spice Market", category: "shopping", coords: [15.5935, 73.8143], desc: "Authentic local market for Goan cashews, Kokum butter, Feni, and choriz sausages.", day: 4, time: "11:00 AM – 01:00 PM", icon: "fa-bag-shopping", color: "pin-blue" }
    ],
    itinerary: [
      {
        dayNumber: 1,
        date: "Day 1 (Thursday)",
        title: "North Goa Arrival, Scooty Pickup & Chapora Sunset",
        highlight: "125cc scooty loop across Anjuna, Vagator cliffs, and iconic sunset at Chapora Fort",
        transportBadge: "125cc Scooty",
        events: [
          { time: "10:30 AM", title: "Arrival & Luggage Drop at Heritage Villa", category: "stay", locationId: "basecamp", desc: "Check in or drop bags securely in cloakroom. Freshen up and collect keys for two 125cc Activas/Avenis at resort gate.", tip: "Carry original driving license and ₹1,000 security deposit for rental." },
          { time: "11:45 AM", title: "Late Breakfast at Baba Au Rhum", category: "food", locationId: "baba-au-rhum", desc: "Shaded bamboo garden cafe. Enjoy freshly baked croissants, wood-fired tartines, and cold brew coffee.", tip: "Outdoor seating under canopy is coolest." },
          { time: "02:00 PM – 04:30 PM", title: "Anjuna Beach Chill & Ocean Swim", category: "nature", locationId: "basecamp", desc: "Stroll along Anjuna rocky shoreline, watch parasailers, and relax on beach loungers with fresh lime soda.", tip: "Keep valuables in waterproof pouch." },
          { time: "05:15 PM – 06:45 PM", title: "Sunset at Chapora Fort Cliffline", category: "viewpoint", locationId: "chapora-fort", desc: "Climb red laterite ramparts made famous by Dil Chahta Hai. 360-degree vista of Vagator beach and Arabian Sea as the sun sinks.", tip: "Wear sports shoes for the rocky path up to the fort." },
          { time: "08:00 PM", title: "Dinner & Cocktails in Vagator", category: "food", desc: "Greek dining at Thalassa or casual dinner at Burger Factory Anjuna.", tip: "Book sunset cliff tables at least 24 hours in advance." }
        ]
      },
      {
        dayNumber: 2,
        date: "Day 2 (Friday)",
        title: "Siolim Coastal Bridge, Ashwem & Mandrem Tranquility",
        highlight: "Quiet northern sands, gentle surf, beach shacks, and chic village dinner in Assagao",
        transportBadge: "125cc Scooty",
        events: [
          { time: "09:30 AM", title: "Scenic Ride across Siolim Bridge", category: "exploration", desc: "Cruise over the wide Chapora river bridge into peaceful North Goa countryside with palm-lined backwaters.", tip: "Smooth expressway tarmac; drive within 40 km/h." },
          { time: "10:30 AM – 02:00 PM", title: "Ashwem Beach Lounge & Lunch", category: "nature", locationId: "ashwem-beach", desc: "Wide white sands with shallow, clear waters ideal for swimming. Lunch at La Plage or silent beach shack.", tip: "Rent a sunbed with beach umbrella for ₹200–300." },
          { time: "03:00 PM – 05:00 PM", title: "Mandrem Sweet Water Creek", category: "nature", desc: "Cross the wooden footbridge over the freshwater lagoon running parallel to the sea.", tip: "Spot kingfishers and river crabs in the mangroves." },
          { time: "07:30 PM", title: "Culinary Dinner in Assagao", category: "food", locationId: "assagao-cafes", desc: "Dine under banyan trees at Gunpowder (Kerala spice curries & appams) or Jamun.", tip: "Order the Malabar prawn or paneer ghee roast with coin parottas." }
        ]
      },
      {
        dayNumber: 3,
        date: "Day 3 (Saturday)",
        title: "Fontainhas Latin Heritage Walk & Mandovi River Cruise",
        highlight: "Pastel Portuguese villas, 16th-century Bom Jesus Basilica, and golden hour river catamaran cruise",
        transportBadge: "Private AC Cab",
        events: [
          { time: "09:30 AM", title: "Private Cab Pickup to Panaji", category: "transport", desc: "Air-conditioned cab picks up from villa, avoiding city parking hassles.", tip: "Driver waits throughout the day with AC on." },
          { time: "10:30 AM – 01:00 PM", title: "Fontainhas Latin Quarter Walking Tour", category: "culture", locationId: "fontainhas", desc: "Wander narrow cobblestone streets, vibrant blue and mustard homes, terracotta roofs, and visit 31st January Bakery for warm bebinca.", tip: "Photographer paradise: respect residents' private gates." },
          { time: "01:30 PM", title: "Traditional Goan Lunch at Viva Panjim", category: "food", desc: "Heritage home serving Goan fish curry thali, mushroom xacuti, and local bread.", tip: "Cash preferred in older heritage alleys." },
          { time: "02:45 PM – 04:30 PM", title: "Old Goa Heritage & Basilica of Bom Jesus", category: "culture", locationId: "bom-jesus", desc: "UNESCO World Heritage site with baroque gilded wood carvings and St. Francis Xavier's tomb.", tip: "Knees and shoulders must be covered inside cathedral." },
          { time: "05:30 PM – 07:00 PM", title: "Mandovi Sunset River Cruise", category: "nature", locationId: "mandovi-cruise", desc: "Catamaran cruise along Panaji waterfront with lively Goan folk music, breeze, and sunset view of Atal Setu bridge.", tip: "Board at Santa Monica Jetty near Panaji bridge." },
          { time: "08:30 PM", title: "Return to Anjuna Villa", category: "stay", locationId: "basecamp", desc: "Relax by the illuminated swimming pool with evening drinks.", tip: "" }
        ]
      },
      {
        dayNumber: 4,
        date: "Day 4 (Sunday)",
        title: "Mapusa Spice Hauls, Souvenirs & Airport Departure",
        highlight: "Goan cashews, Kokum butter, artisanal ceramic tiles, and smooth departure transfer",
        transportBadge: "125cc Scooty + Cab",
        events: [
          { time: "09:00 AM", title: "Breakfast & Villa Check-out", category: "stay", locationId: "basecamp", desc: "Pack luggage and complete check-out. Bags held in concierge locker.", tip: "Request late check-out or shower facility if flight is late." },
          { time: "10:30 AM – 12:30 PM", title: "Mapusa Cashew & Spice Shopping", category: "shopping", locationId: "mapusa-market", desc: "Buy W240/W180 roasted salted jumbo cashews, authentic kokum butter, and feni bottles.", tip: "Insist on vacuum-sealed tins for travel freshness." },
          { time: "01:00 PM", title: "Farewell Goan Lunch", category: "food", desc: "Relaxed garden lunch before heading to airport.", tip: "" },
          { time: "03:30 PM", title: "Airport / Railway Transfer", category: "transport", desc: "Direct private cab transfer to MOPA International Airport (GOX) or Thivim Station.", tip: "Reach airport 2 hours before domestic departure." }
        ]
      }
    ],
    highlights: [
      { icon: "fa-umbrella-beach", title: "Ashwem Beach", desc: "Tranquil sands, shallow turquoise waters & seaside cafes" },
      { icon: "fa-landmark", title: "Fontainhas Heritage Walk", desc: "Vibrant Latin Quarter pastel Portuguese architecture" },
      { icon: "fa-mountain", title: "Chapora Fort Sunset", desc: "Panoramic view over Vagator cliffs & Arabian Sea" },
      { icon: "fa-ship", title: "Mandovi River Cruise", desc: "Evening golden hour catamaran sailing in Panaji" }
    ],
    quickItinerary: [
      { day: "Day 1", title: "Arrival, 125cc Scooty pickup, Anjuna beach relax & sunset at Chapora Fort" },
      { day: "Day 2", title: "Siolim coastal ride to Ashwem/Mandrem & romantic dinner in Assagao" },
      { day: "Day 3", title: "Fontainhas Latin Quarter heritage walk, Old Goa churches & Mandovi sunset cruise" },
      { day: "Day 4", title: "Mapusa spice and cashew shopping, seaside lunch & airport departure" }
    ],
    checklist: buildDefaultPhasedChecklist("Goa", { pax: 2 }),
    packingList: [
      { id: "p1", item: "Polarized Sunglasses & Sunscreen (SPF 50+)", category: "Sun & Beach", checked: true },
      { id: "p2", item: "Quick-Dry Microfiber Beach Towels", category: "Sun & Beach", checked: true },
      { id: "p3", item: "Valid Driver's License (for Scooty Rental)", category: "Documents", checked: true },
      { id: "p4", item: "Waterproof Phone Pouch for Boat Cruises", category: "Electronics", checked: false },
      { id: "p5", item: "Breathable Linen Shirts & Shorts", category: "Clothing", checked: false },
      { id: "p6", item: "Slip-on Sandals & Walking Shoes for Heritage Walk", category: "Footwear", checked: false },
      { id: "p7", item: "Mosquito Repellent Ointment (Odomos)", category: "Health & Pharma", checked: false }
    ],
    emergencyContacts: [
      { name: "Goa Tourist Police Helpline", phone: "1364", info: "24/7 dedicated tourist safety & dispute resolution" },
      { name: "Manipal Hospital, Dona Paula", phone: "+91 832 304 8800", info: "Premier multi-specialty 24/7 hospital in Panaji" },
      { name: "Anjuna Police Station", phone: "+91 832 227 3233", info: "Local North Goa jurisdiction" },
      { name: "Goa State Emergency Ambulance", phone: "108", info: "Government emergency medical dispatch" }
    ],
    budget: {
      totalEstimate: "₹24,500 – ₹32,000",
      perPersonSplit: "₹12,250 – ₹16,000 / pax (2 Travelers)",
      breakdown: [
        { item: "Heritage Villa / Resort (3 Nights)", cost: "₹12,000" },
        { item: "125cc Scooty Rental (4 Days @ ₹450/day + fuel)", cost: "₹2,600" },
        { item: "Private Day Cab (Fontainhas & Old Goa)", cost: "₹2,800" },
        { item: "Mandovi Sunset Cruise Tickets (2 pax)", cost: "₹1,200" },
        { item: "Seafood & Cafe Dining (Breakfast, Lunch, Dinner)", cost: "₹9,000" },
        { item: "Spices, Cashews & Local Souvenirs", cost: "₹3,500" }
      ]
    }
  },
  hampi: {
    title: "Hampi Ruins, Boulders & Tungabhadra Sunset Loops",
    destination: "Hampi, Vijayanagara, Karnataka, India",
    flag: "🏛️",
    category: "weekend",
    badge: "UNESCO World Heritage • Boulders & Ruins",
    accentColor: "#f59e0b",
    heroGradient: "from-amber-950 via-stone-900 to-slate-950",
    summary: "A 3-day journey through the majestic 14th-century capital of the Vijayanagara Empire. Explore monolithic stone chariots, coracle boat rides across the Tungabhadra, sunset atop Matanga Hill, and hipster cafe culture in Sanapur.",
    mapCenter: [15.3350, 76.4600],
    mapZoom: 12,
    basecamp: {
      name: "Sri Durga Comfort Stay / Sanapur Homestay",
      location: "Sunrise Road, Sanapur, North Hampi",
      distanceFromStation: "14 km from Hospet Central / Munirabad Station",
      checkIn: "12:00 PM",
      checkOut: "10:30 AM",
      arrivalStrategy: "Arrive at Hosapete Central via KSRTC sleeper. Collect rental scooter from Ravi Bike Rental at Munirabad Station. Ride to Sri Durga Comfort Stay in Sanapur to drop bags.",
      diningNote: "Wholesome South Indian breakfasts, Mango Tree thalis, and Sanapur cafe culture.",
      coords: [15.3484, 76.4365],
      addressLocalScript: "ಶ್ರೀ ದುರ್ಗಾ ಕಂಫರ್ಟ್ ಸ್ಟೇ, ಸನಾಪುರ, ಹಂಪಿ, ಕರ್ನಾಟಕ - ೫೮೩೨೩೪"
    },
    transportPlan: [
      { day: "Day 1 (Friday)", mode: "Overnight Hampi Express ➔ Local Moped", icon: "fa-motorcycle", timing: "08:30 AM Moped Pickup", purpose: "Pickup 100cc moped/scooty for visiting Virupaksha, Hemakuta hill sunset, and riverside ruins." },
      { day: "Day 2 (Saturday)", mode: "E-Cart + Coracle Boat", icon: "fa-ship", timing: "09:00 AM – 06:00 PM", purpose: "Battery operated vehicle in monument zone to Stone Chariot & Vittala temple, round coracle ride on Tungabhadra." },
      { day: "Day 3 (Sunday)", mode: "Moped Loop ➔ Train Transfer", icon: "fa-train", timing: "Sanapur Lake morning, 07:00 PM train", purpose: "Sanapur lake boulder jump, Anjanadri hill monkeys, evening train back to Bengaluru." }
    ],
    locations: [
      { id: "virupaksha", name: "Virupaksha Temple", category: "culture", coords: [15.3354, 76.4601], desc: "7th-century operating Shiva temple with iconic 50m gopuram.", day: 1, time: "09:30 AM", icon: "fa-gopuram", color: "pin-purple" },
      { id: "hemakuta", name: "Hemakuta Hill Sunset", category: "viewpoint", coords: [15.3338, 76.4592], desc: "Pre-Vijayanagara cluster of temples with panoramic sunset over banana plantations.", day: 1, time: "05:00 PM – 06:30 PM", icon: "fa-mountain", color: "pin-emerald" },
      { id: "vittala", name: "Vittala Temple & Stone Chariot", category: "culture", coords: [15.3436, 76.4754], desc: "Architectural masterpiece with famous stone chariot and musical pillars.", day: 2, time: "09:30 AM – 12:30 PM", icon: "fa-landmark", color: "pin-purple" },
      { id: "coracle", name: "Tungabhadra Coracle Ride", category: "nature", coords: [15.3460, 76.4720], desc: "Traditional woven circular coracle boat ride through granite gorge waters.", day: 2, time: "03:30 PM – 05:00 PM", icon: "fa-water", color: "pin-cyan" },
      { id: "sanapur", name: "Sanapur Lake & Boulder Cliffs", category: "nature", coords: [15.3680, 76.4390], desc: "Scenic reservoir flanked by massive balanced granite boulders.", day: 3, time: "10:00 AM – 01:00 PM", icon: "fa-water", color: "pin-cyan" }
    ],
    itinerary: [
      {
        dayNumber: 1,
        date: "Day 1 (Friday)",
        title: "Hospet Train Arrival, Virupaksha & Hemakuta Sunset",
        highlight: "Monolithic statues, 7th-century Virupaksha gopuram, and golden hour atop Hemakuta Hill",
        transportBadge: "100cc Moped",
        events: [
          { time: "07:30 AM", title: "Hospet Junction Arrival & Auto Transfer", category: "transport", desc: "Arrive via overnight Hampi Express. Take pre-fixed auto to Kamalapur guesthouse.", tip: "Auto fare is ~₹250–300 to Kamalapur." },
          { time: "08:45 AM", title: "Breakfast & Moped Pickup", category: "food", desc: "Crisp Mysore Masala dosas and filter coffee in Kamalapur. Collect moped rental with two helmets.", tip: "Check moped brakes and fuel level before riding." },
          { time: "10:00 AM – 01:00 PM", title: "Virupaksha Temple & Sasivekalu Ganesha", category: "culture", locationId: "virupaksha", desc: "Explore the ancient active Shiva temple, inverted pinhole camera shadow of gopuram, and 8-foot monolithic mustard Ganesha.", tip: "Remove footwear at temple entrance; socks recommended as granite gets warm." },
          { time: "01:30 PM", title: "Traditional Thali Lunch at Mango Tree", category: "food", desc: "Iconic garden restaurant serving fresh curries, banana flower salad, and cold lassis.", tip: "Relax in floor cushion seating area." },
          { time: "05:00 PM – 06:45 PM", title: "Hemakuta Hill Sunset Panorama", category: "viewpoint", locationId: "hemakuta", desc: "Climb gentle sloping granite hill overlooking ruins and lush green banana trees as the sky turns crimson.", tip: "Sit on high rock plateau for best sunset photos." }
        ]
      },
      {
        dayNumber: 2,
        date: "Day 2 (Saturday)",
        title: "Vittala Stone Chariot, Royal Enclosure & Coracle Ride",
        highlight: "Iconic stone chariot, musical pillars, Lotus Mahal, and Tungabhadra river boat ride",
        transportBadge: "E-Cart + Coracle",
        events: [
          { time: "09:00 AM – 12:30 PM", title: "Vittala Temple & Monolithic Stone Chariot", category: "culture", locationId: "vittala", desc: "Take battery-operated e-cart to the grand Vittala complex. Marvel at stone chariot wheels and 56 musical pillars.", tip: "ASI composite ticket (₹40) covers both Vittala and Zenana enclosure." },
          { time: "01:00 PM", title: "Lunch Break in Kamalapur", category: "food", desc: "Authentic North Karnataka Jolada Rotti thali with stuffed brinjal and shenga chutney.", tip: "" },
          { time: "02:30 PM – 04:00 PM", title: "Lotus Mahal & Elephant Stables", category: "culture", desc: "Indo-Islamic secular architecture with domed chambers where royal elephants were housed.", tip: "Well manicured green lawns for shady rest." },
          { time: "04:30 PM – 06:00 PM", title: "Tungabhadra Coracle Boat Ride", category: "nature", locationId: "coracle", desc: "Round basket boat trip along churning granite river waters with views of ruined aqueducts.", tip: "Negotiate round trip fare (~₹400–600 per boat)." }
        ]
      },
      {
        dayNumber: 3,
        date: "Day 3 (Sunday)",
        title: "Sanapur Lake, Anjanadri Hill & Night Train Departure",
        highlight: "Anegundi boulder landscapes, Hanuman birthplace hill climb, and night train return",
        transportBadge: "Moped + Train",
        events: [
          { time: "08:30 AM", title: "Cross River to Hippie Side (Anegundi)", category: "exploration", desc: "Drive moped across the bridge towards Sanapur reservoir and tranquil paddy fields.", tip: "Very peaceful, scenic riding roads." },
          { time: "10:00 AM – 01:00 PM", title: "Sanapur Lake Boulder Cliffs & Cafe", category: "nature", locationId: "sanapur", desc: "Watch cliff jumpers and relax with wood-fired pizza and fresh juices at nearby cafes.", tip: "Avoid swimming in deep reservoir currents." },
          { time: "02:30 PM – 04:30 PM", title: "Anjanadri Hill Panoramic Climb", category: "viewpoint", desc: "575 whitewashed stone steps to the mythic birthplace of Lord Hanuman with sweeping 360-degree views.", tip: "Watch out for playful monkeys; keep food inside bags." },
          { time: "06:30 PM", title: "Return Moped & Hospet Station Drop", category: "transport", desc: "Fuel top-up, return moped keys in Kamalapur, and auto transfer to Hospet Junction.", tip: "Board Hampi Express back to Bengaluru." }
        ]
      }
    ],
    highlights: [
      { icon: "fa-monument", title: "Vittala Stone Chariot", desc: "World famous 16th-century monolithic stone chariot" },
      { icon: "fa-ship", title: "Tungabhadra Coracle", desc: "Thrilling traditional circular boat ride down granite gorges" },
      { icon: "fa-mountain", title: "Hemakuta Hill Sunset", desc: "Golden hour over ancient ruined temples and boulder valleys" },
      { icon: "fa-gopuram", title: "Virupaksha Gopuram", desc: "Active 50m temple tower with resident temple elephant" }
    ],
    quickItinerary: [
      { day: "Day 1", title: "Hospet train arrival, Virupaksha temple, riverside ruins & Hemakuta hill sunset" },
      { day: "Day 2", title: "Vittala Temple stone chariot, Lotus Mahal, Elephant Stables & Coracle boat ride" },
      { day: "Day 3", title: "Sanapur Lake cliff views, Anjanadri hill trek, Mango Tree lunch & night train" }
    ],
    checklist: buildDefaultPhasedChecklist("Hampi", { pax: 2 }),
    packingList: [
      { id: "h1", item: "Wide Brim Hat & Cotton Scarf (Dry heat protection)", category: "Sun & Heat", checked: true },
      { id: "h2", item: "Sturdy Hiking Shoes with Grip (Boulder climbing)", category: "Footwear", checked: true },
      { id: "h3", item: "Electrolyte Packets (ORS) & 2L Water Bottle", category: "Health & Energy", checked: true },
      { id: "h4", item: "Cash (ATMs inside monument zone are scarce)", category: "Finance", checked: true },
      { id: "h5", item: "Modest Temple Attire (Shoulders & knees covered)", category: "Clothing", checked: false },
      { id: "h6", item: "Sunglasses & SPF 50 Sunscreen", category: "Sun & Heat", checked: false }
    ],
    emergencyContacts: [
      { name: "Hampi Police Station", phone: "+91 8394 241 241", info: "Hampi Monument Police Aid Post" },
      { name: "100-Bed Government Hospital, Hospet", phone: "+91 8394 222 222", info: "Primary emergency medical care in Hospet" },
      { name: "Karnataka Tourist Help Desk", phone: "1800 425 4646", info: "State-wide tourist assistance" }
    ],
    budget: {
      totalEstimate: "₹14,000 – ₹18,000",
      perPersonSplit: "₹7,000 – ₹9,000 / pax (2 Travelers)",
      breakdown: [
        { item: "Overnight Hampi Express 3AC (2 Pax Roundtrip)", cost: "₹3,400" },
        { item: "Kamalapur Resort / Guesthouse (2 Nights)", cost: "₹6,000" },
        { item: "Moped / Scooty Rental + Fuel (3 Days)", cost: "₹1,800" },
        { item: "Monument Entry Tickets & Coracle Ride", cost: "₹1,600" },
        { item: "Food & Cafes (Mango Tree, Laughing Buddha)", cost: "₹3,500" }
      ]
    }
  }
};

/**
 * Generate a dynamic fallback itinerary when Gemini API key is not supplied
 */
function generateDynamicFallback(params) {
  const slug = params.dest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + (params.start ? params.start.slice(0, 4) : '2026');
  const days = parseInt(params.days, 10) || 3;
  const startDate = params.start || '2026-11-12';
  const startObj = new Date(startDate);
  const endObj = new Date(startObj);
  endObj.setDate(startObj.getDate() + days - 1);
  const endDate = endObj.toISOString().slice(0, 10);
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDates = `${monthNames[startObj.getMonth()]} ${startObj.getDate()} – ${monthNames[endObj.getMonth()]} ${endObj.getDate()}, ${startObj.getFullYear()}`;

  // Check if we have pre-curated template for Goa or Hampi
  const destLower = params.dest.toLowerCase();
  if (destLower.includes('goa') && POPULAR_DESTINATION_DATA.goa) {
    const d = { ...POPULAR_DESTINATION_DATA.goa };
    d.id = slug;
    d.startDate = startDate;
    d.endDate = endDate;
    d.dates = formattedDates;
    d.daysCount = days;
    d.travelers = params.pax || "2 Travelers";
    d.url = `trip.html?id=${slug}`;
    return d;
  }
  if (destLower.includes('hampi') && POPULAR_DESTINATION_DATA.hampi) {
    const d = { ...POPULAR_DESTINATION_DATA.hampi };
    d.id = slug;
    d.startDate = startDate;
    d.endDate = endDate;
    d.dates = formattedDates;
    d.daysCount = days;
    d.travelers = params.pax || "2 Travelers";
    d.url = `trip.html?id=${slug}`;
    return d;
  }

  // Generic dynamic fallback adhering strictly to schema
  const capitalDest = params.dest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const defaultCenter = [12.9716, 77.5946]; // Default South India coords

  const locations = [];
  const itinerary = [];
  const quickItinerary = [];

  for (let i = 1; i <= days; i++) {
    const curDate = new Date(startObj);
    curDate.setDate(startObj.getDate() + i - 1);
    const dayStr = `Day ${i}`;
    const dateFormatted = `${monthNames[curDate.getMonth()]} ${curDate.getDate()}`;

    // Locations for this day
    const locId = `loc-d${i}`;
    locations.push({
      id: locId,
      name: `${capitalDest} Key Highlight ${i}`,
      category: i === 1 ? 'stay' : i % 2 === 0 ? 'nature' : 'culture',
      coords: [defaultCenter[0] + (i * 0.02), defaultCenter[1] + (i * 0.02)],
      desc: `Curated sightseeing stop for ${capitalDest} expedition.`,
      day: i,
      time: i === 1 ? "10:00 AM Arrival" : "09:30 AM Morning Loop",
      icon: i === 1 ? "fa-hotel" : i % 2 === 0 ? "fa-water" : "fa-landmark",
      color: i === 1 ? "pin-rose" : i % 2 === 0 ? "pin-cyan" : "pin-purple"
    });

    // Itinerary for this day
    itinerary.push({
      dayNumber: i,
      date: `${curDate.toLocaleDateString('en-US', { weekday: 'short' })}, ${dateFormatted}`,
      title: i === 1 ? `Arrival in ${capitalDest} & Exploration` : `Scenic Trails & Local Highlights`,
      highlight: `Discovering regional architecture, viewpoints & local cuisines`,
      transportBadge: i === 1 ? "Private Cab Pickup" : "Local Scooty / Auto Loop",
      events: [
        {
          time: "09:30 AM",
          title: `Morning Kickoff & Sightseeing`,
          category: "exploration",
          locationId: locId,
          desc: `Commence exploratory itinerary across ${capitalDest}.`,
          tip: "Carry water bottle and comfortable walking shoes."
        },
        {
          time: "01:30 PM",
          title: `Local Culinary Experience`,
          category: "food",
          desc: `Taste regional specialties at renowned local restaurant.`,
          tip: "Vegetarian thalis and fresh beverages available."
        },
        {
          time: "05:00 PM",
          title: `Golden Hour Sunset Viewpoint`,
          category: "nature",
          desc: `Relax at prominent viewpoint for dusk photography and panoramic views.`,
          tip: "Arrive 30 minutes before sunset for best vantage point."
        }
      ]
    });

    quickItinerary.push({
      day: dayStr,
      title: i === 1 ? `Arrival, check-in & introductory sightseeing` : `Exploration loop, viewpoints & regional cuisine`
    });
  }

  return {
    id: slug,
    title: `${capitalDest} Master Expedition`,
    destination: `${capitalDest}, India`,
    flag: "🧭",
    status: "upcoming",
    category: params.category || "domestic",
    dates: formattedDates,
    startDate: startDate,
    endDate: endDate,
    daysCount: days,
    travelers: params.pax || "2 Travelers",
    heroGradient: "from-slate-950 via-teal-950 to-emerald-950",
    badge: `${capitalDest} • Curated Expedition`,
    accentColor: "#10b981",
    url: `trip.html?id=${slug}`,
    summary: `A ${days}-day curated expedition across ${capitalDest}, featuring scenic viewpoints, local cuisine, and verified routes.`,
    mapCenter: defaultCenter,
    mapZoom: 11,
    basecamp: {
      name: `${capitalDest} Heritage Hotel & Stay`,
      location: `Central ${capitalDest}`,
      distanceFromStation: "10 mins from main transit station",
      checkIn: "12:00 PM",
      checkOut: "11:00 AM",
      arrivalStrategy: "Drop luggage in cloakroom on morning arrival, freshen up, and head out for initial exploration.",
      diningNote: "In-house dining with local specialties and continental breakfast.",
      coords: defaultCenter,
      addressLocalScript: `${capitalDest} Hotel, Station Road`
    },
    transportPlan: [
      { day: "Day 1", mode: "Arrival Transfer + Local Cab", icon: "fa-car", timing: "09:30 AM", purpose: "Station / Airport pickup to basecamp." },
      { day: `Day 2–${days}`, mode: "125cc Scooty / Local Cab", icon: "fa-motorcycle", timing: "Full Day", purpose: "Flexible exploration across all key spots." }
    ],
    locations: locations,
    itinerary: itinerary,
    highlights: [
      { icon: "fa-map-pin", title: `${capitalDest} Highlights`, desc: `Top-rated scenic and cultural landmarks` },
      { icon: "fa-utensils", title: "Regional Dining", desc: "Authentic local delicacies and cafes" },
      { icon: "fa-camera", title: "Golden Hour Viewpoints", desc: "Photogenic sunset points and natural overlooks" }
    ],
    quickItinerary: quickItinerary,
    checklist: buildDefaultPhasedChecklist(capitalDest, params),
    packingList: [
      { id: "p1", item: "Valid Government ID & Driver's License", category: "Documents", checked: true },
      { id: "p2", item: "Power Bank (10,000+ mAh) & Charging Cables", category: "Electronics", checked: true },
      { id: "p3", item: "Comfortable Walking / Trekking Shoes", category: "Footwear", checked: true },
      { id: "p4", item: "Sunglasses & High SPF Sunscreen", category: "Sun Protection", checked: false },
      { id: "p5", item: "Personal Medications & First Aid Kit", category: "Health", checked: false },
      { id: "p6", item: "Light Jacket or Windcheater", category: "Clothing", checked: false }
    ],
    emergencyContacts: [
      { name: `${capitalDest} Tourist Police Helpline`, phone: "112", info: "24/7 emergency dispatch" },
      { name: "Government General Hospital", phone: "108", info: "24/7 emergency medical service" }
    ],
    budget: {
      totalEstimate: `₹${(days * 4500).toLocaleString('en-IN')} – ₹${(days * 6500).toLocaleString('en-IN')}`,
      perPersonSplit: `₹${Math.round(days * 2500).toLocaleString('en-IN')} / person (${params.pax || '2 Travelers'})`,
      breakdown: [
        { item: `Hotel & Basecamp Stay (${days - 1} Nights)`, cost: `₹${((days - 1) * 3200).toLocaleString('en-IN')}` },
        { item: "Local Transport & Scooty / Cab", cost: `₹${(days * 1200).toLocaleString('en-IN')}` },
        { item: "Food & Dining Experience", cost: `₹${(days * 1500).toLocaleString('en-IN')}` },
        { item: "Entry Tickets & Activities", cost: `₹${(days * 600).toLocaleString('en-IN')}` }
      ]
    }
  };
}

/**
 * Call Gemini 2.5 API with structured JSON output if API key is provided
 */
async function generateWithGemini(params, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `
You are the Master Travel Architect for Travel Architect Hub.
You generate production-ready, highly accurate trip JSON data adhering strictly to the JSON schema.
Ensure all GPS coordinates [latitude, longitude] are authentic and geographically accurate.
Ensure category pin colors follow AGENTS.md:
- stay -> pin-rose, fa-hotel
- nature -> pin-cyan, fa-water or fa-tree
- viewpoint -> pin-emerald, fa-mountain
- food -> pin-amber, fa-utensils
- culture -> pin-purple, fa-landmark or fa-gopuram
- transport -> pin-blue, fa-car or fa-bus
- shopping -> pin-blue, fa-bag-shopping

Always provide exact Indian Rupee (INR) costs, realistic local timings, and authentic local script addresses for auto/taxi drivers.
`;

  const userQuery = `
Generate a complete, rich travel architect trip JSON for:
Destination: ${params.dest}
Origin: ${params.from || "Bengaluru"}
Duration: ${params.days || 3} Days
Dates: Starting ${params.start || "2026-11-12"}
Travelers: ${params.pax || "2 Travelers"}
Category: ${params.category || "domestic"}
Specific preferences: ${params.prompt || "Curated mix of viewpoints, food, culture, and nature"}

Return ONLY a valid JSON object matching the trip schema (no markdown, no backticks, pure JSON).
`;

  console.log(`🤖 Contacting Gemini 2.5 Flash for authentic itinerary generation...`);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini API");

  return JSON.parse(text);
}

/**
 * Validate trip data against fundamental trip schema rules
 */
function validateTripData(data) {
  const errors = [];
  if (!data.id) errors.push("Missing 'id' slug");
  if (!data.title) errors.push("Missing 'title'");
  if (!data.destination) errors.push("Missing 'destination'");
  if (!data.dates) errors.push("Missing 'dates'");
  if (!Array.isArray(data.itinerary) || data.itinerary.length === 0) {
    errors.push("Missing or empty 'itinerary' array");
  }
  if (!Array.isArray(data.locations) || data.locations.length === 0) {
    errors.push("Missing or empty 'locations' array");
  } else {
    data.locations.forEach((loc, i) => {
      if (!loc.coords || loc.coords.length !== 2) {
        errors.push(`Location #${i + 1} (${loc.name || 'unnamed'}) is missing valid [lat, lng] coords`);
      }
    });
  }
  return errors;
}

/**
 * Register trip into trips_registry.js and sync files
 */
function saveAndRegisterTrip(trip) {
  // Ensure rich phased checklist is always present with rental, gear, doc, and medical essentials
  if (!Array.isArray(trip.checklist) || trip.checklist.length === 0) {
    trip.checklist = buildDefaultPhasedChecklist(trip.destination, trip);
  }
  // Ensure flat packingList is always present for backward compatibility
  if (!Array.isArray(trip.packingList) || trip.packingList.length === 0) {
    trip.packingList = trip.checklist.flatMap((phase, pIdx) =>
      (phase.items || []).map((item, iIdx) => ({
        id: item.id || `p_${pIdx + 1}_${iIdx + 1}`,
        item: item.text,
        category: phase.badge || (phase.phase ? phase.phase.replace(/^Phase\s*\d+:\s*/i, "") : "Gear"),
        checked: !!item.defaultChecked
      }))
    );
  }

  const slug = trip.id;
  const jsonContent = JSON.stringify(trip, null, 2);

  // 1. Save to data/trips/<slug>.json
  const dataTripsDir = path.join(ROOT_DIR, 'data', 'trips');
  if (!fs.existsSync(dataTripsDir)) fs.mkdirSync(dataTripsDir, { recursive: true });
  const dataPath = path.join(dataTripsDir, `${slug}.json`);
  fs.writeFileSync(dataPath, jsonContent, 'utf8');
  console.log(`✅ Saved standalone trip JSON: ${path.relative(ROOT_DIR, dataPath)}`);

  // 2. Save to src/data/trips/<slug>.json for React PWA
  const srcTripsDir = path.join(ROOT_DIR, 'src', 'data', 'trips');
  if (!fs.existsSync(srcTripsDir)) fs.mkdirSync(srcTripsDir, { recursive: true });
  const srcPath = path.join(srcTripsDir, `${slug}.json`);
  fs.writeFileSync(srcPath, jsonContent, 'utf8');
  console.log(`✅ Synced React PWA trip JSON: ${path.relative(ROOT_DIR, srcPath)}`);

  // 3. Register in trips_registry.js (Standalone Hub)
  const registryJsPath = path.join(ROOT_DIR, 'trips_registry.js');
  if (fs.existsSync(registryJsPath)) {
    let regCode = fs.readFileSync(registryJsPath, 'utf8');
    if (!regCode.includes(`"${slug}"`) && !regCode.includes(`'${slug}'`)) {
      // Build registry card entry
      const newCard = {
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        flag: trip.flag || "✈️",
        status: trip.status || "upcoming",
        category: trip.category || "domestic",
        dates: trip.dates,
        startDate: trip.startDate,
        endDate: trip.endDate,
        daysCount: trip.daysCount,
        travelers: trip.travelers || "2 Travelers",
        heroGradient: trip.heroGradient || "from-slate-950 via-teal-900 to-slate-950",
        badge: trip.badge || `${trip.destination.split(',')[0]} Escape`,
        accentColor: trip.accentColor || "#10b981",
        url: `trip.html?id=${slug}`,
        summary: trip.summary || "",
        basecamp: trip.basecamp?.name || "Confirmed Basecamp",
        transport: trip.transportPlan?.[0]?.mode || "Cab & Local Transit",
        highlights: trip.highlights || [],
        quickItinerary: trip.quickItinerary || []
      };

      const cardStr = JSON.stringify(newCard, null, 4);
      // Insert right after TRIPS_REGISTRY = [
      regCode = regCode.replace(/const TRIPS_REGISTRY = \[/, `const TRIPS_REGISTRY = [\n    ${cardStr},`);
      fs.writeFileSync(registryJsPath, regCode, 'utf8');
      console.log(`✅ Registered in trips_registry.js`);
    } else {
      console.log(`ℹ️ Trip '${slug}' is already registered in trips_registry.js`);
    }
  }

  // 4. Update src/data/trips/registry.js (React Web App)
  const srcRegistryPath = path.join(ROOT_DIR, 'src', 'data', 'trips', 'registry.js');
  if (fs.existsSync(srcRegistryPath)) {
    let srcRegCode = fs.readFileSync(srcRegistryPath, 'utf8');
    const varName = slug.replace(/[^a-zA-Z0-9]/g, '_');
    if (!srcRegCode.includes(`import ${varName} from`)) {
      // Add import at top
      srcRegCode = `import ${varName} from './${slug}.json';\n` + srcRegCode;
      // Add to STATIC_TRIPS
      srcRegCode = srcRegCode.replace(/export const STATIC_TRIPS = \[/, `export const STATIC_TRIPS = [\n  ${varName},`);
      fs.writeFileSync(srcRegistryPath, srcRegCode, 'utf8');
      console.log(`✅ Registered in src/data/trips/registry.js`);
    }
  }

  console.log(`\n🎉 Trip '${trip.title}' successfully generated and registered!`);
  console.log(`\n🔗 View Live in Browser:`);
  console.log(`   • React Web App:      http://localhost:5173/?trip=${slug}`);
  console.log(`   • Standalone Runner:  http://localhost:5173/trip.html?id=${slug}\n`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dest' || arg === '--destination') params.dest = args[++i];
    else if (arg === '--from' || arg === '--origin') params.from = args[++i];
    else if (arg === '--days') params.days = parseInt(args[++i], 10);
    else if (arg === '--start') params.start = args[++i];
    else if (arg === '--pax') params.pax = args[++i];
    else if (arg === '--category') params.category = args[++i];
    else if (arg === '--prompt') params.prompt = args[++i];
    else if (arg === '--api-key') params.apiKey = args[++i];
    else if (arg === '--import') params.importFile = args[++i];
    else if (arg === '--list') params.list = true;
    else if (arg === '--help' || arg === '-h') params.help = true;
  }
  return params;
}

async function main() {
  const params = parseArgs();

  if (params.help) {
    console.log(`
🧭 Master Travel Architect — Generator CLI

Options:
  --dest <destination>    Target destination (e.g. "Goa", "Hampi", "Coorg", "Vietnam")
  --from <city>           Departure origin city (default: "Bengaluru")
  --days <number>         Trip duration in days (default: 3 or 4)
  --start <YYYY-MM-DD>    Trip start date (default: next upcoming weekend)
  --pax <travelers>       Traveler count description (e.g. "2 Travelers", "Family of 4")
  --category <type>       "domestic" | "international" | "roadtrip" | "weekend"
  --prompt <notes>        Custom notes, e.g. "Beach shacks, scooter riding, Latin quarter"
  --api-key <key>         Gemini API Key (reads GEMINI_API_KEY from .env by default)
  --import <file.json>    Import and register an existing trip JSON file
  --list                  List all currently registered trips
  --help                  Show this help screen

Examples:
  npm run generate-trip -- --dest "Goa" --days 4 --start "2026-11-12"
  npm run generate-trip -- --dest "Hampi" --from "Bengaluru" --days 3
  npm run generate-trip -- --import ./my_custom_trip.json
`);
    return;
  }

  if (params.list) {
    const registryJsPath = path.join(ROOT_DIR, 'trips_registry.js');
    console.log(`📋 Listing registered trips from trips_registry.js:`);
    const regCode = fs.readFileSync(registryJsPath, 'utf8');
    const matches = regCode.matchAll(/(?:"id"|id):\s*"([^"]+)"[\s\S]*?(?:"title"|title):\s*"([^"]+)"/g);
    for (const match of matches) {
      console.log(`   • [${match[1]}] ${match[2]}`);
    }
    return;
  }

  // Handle direct JSON import
  if (params.importFile) {
    const fullPath = path.resolve(process.cwd(), params.importFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Error: Import file not found: ${fullPath}`);
      process.exit(1);
    }
    const raw = fs.readFileSync(fullPath, 'utf8');
    const tripData = JSON.parse(raw);
    const errors = validateTripData(tripData);
    if (errors.length > 0) {
      console.error(`❌ Schema Validation Errors in ${params.importFile}:`);
      errors.forEach(e => console.error(`   - ${e}`));
      process.exit(1);
    }
    saveAndRegisterTrip(tripData);
    return;
  }

  // Destination is required if not importing or listing
  if (!params.dest) {
    console.log(`ℹ️ No destination specified. Defaulting to: "Goa" (4 Days).`);
    console.log(`💡 Tip: Run 'npm run generate-trip -- --dest "Hampi" --days 3' for custom trips.\n`);
    params.dest = "Goa";
    params.days = params.days || 4;
    params.start = params.start || "2026-11-12";
  }

  const apiKey = params.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  let tripData;
  if (apiKey) {
    try {
      tripData = await generateWithGemini(params, apiKey);
    } catch (err) {
      console.warn(`⚠️ Gemini API call failed: ${err.message}.`);
      console.log(`🔄 Falling back to high-fidelity curated architectural generator...`);
      tripData = generateDynamicFallback(params);
    }
  } else {
    console.log(`ℹ️ No GEMINI_API_KEY detected in .env. Using high-fidelity curated generator...`);
    tripData = generateDynamicFallback(params);
  }

  // Validate
  const errors = validateTripData(tripData);
  if (errors.length > 0) {
    console.error(`❌ Validation warnings:`);
    errors.forEach(e => console.error(`   - ${e}`));
  }

  // Save and Register
  saveAndRegisterTrip(tripData);
}

main().catch(err => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});

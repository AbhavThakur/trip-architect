/**
 * Master Trips Database for Personal Travel Architect Hub
 * Pre-loaded with Chikmagalur 2026 Master Plan & Vietnam 2026 Expedition
 */

const DEFAULT_TRIPS = [
    {
        id: "chikmagalur-2026",
        title: "Chikmagalur Coffee & Cloud Peaks",
        destination: "Chikmagalur, Karnataka, India",
        flag: "🇮🇳",
        status: "upcoming",
        dates: "Sep 12 – 14, 2026",
        startDate: "2026-09-12",
        endDate: "2026-09-14",
        travelers: "2–3 Travelers",
        heroGradient: "from-emerald-900 via-teal-950 to-slate-950",
        accentColor: "#10b981",
        badge: "Hill Station • Western Ghats",
        summary: "A 3-day weekend escape across lush coffee plantations, rugged 4x4 trails to roaring waterfalls, highest peak trekking at Mullayanagiri, and scenic ridge cruising on 125cc scooties.",
        basecamp: {
            name: "Tresca A Luxury Hotel",
            location: "RG Road, Vijayapura (Opp. Renukacharya Kalyana Mantapa)",
            distanceFromStation: "850 meters (~2 mins by auto) from KSRTC Main Bus Stand",
            checkIn: "12:00 PM",
            checkOut: "11:00 AM",
            arrivalStrategy: "Arrive at 9:30 AM (2.5 hrs before check-in). Drop bags securely at the 24-hr cloakroom, freshen up in the lobby washroom, change into hill clothes, and head out immediately for breakfast and sightseeing without luggage.",
            diningNote: "Modern rooms with clean amenities; no in-house full kitchen. RG Road features premier dining within a 2-5 min walk (Vishnu Delicacy, Town Caffee, Kailash Parbat, Hotel Matsya).",
            coords: [13.3182, 75.7788],
            addressKannada: "ಟ್ರೆಸ್ಕಾ ಎ ಲಕ್ಸುರಿ ಹೋಟೆಲ್, ಆರ್.ಜಿ. ರಸ್ತೆ, ವಿಜಯಪುರ, ಚಿಕ್ಕಮಗಳೂರು"
        },
        transportPlan: [
            {
                day: "Saturday (Day 1)",
                mode: "Private Sightseeing Cab + 4x4 Jeep",
                icon: "fa-taxi",
                timing: "~10:30 AM to 07:00 PM",
                purpose: "Picks up directly at Tresca Hotel, tackles steep hairpins, Jhari falls jeep switch point, Mullayanagiri climb, and sunset."
            },
            {
                day: "Sunday (Day 2)",
                mode: "125cc Scooty Rental",
                icon: "fa-motorcycle",
                timing: "Pickup 09:00 AM near KSRTC Bus Stand",
                purpose: "Cruise scenic plantation loops, winding roads to Baba Budangiri, Z-Point trek, and plantation cafe hopping."
            },
            {
                day: "Monday (Day 3)",
                mode: "125cc Scooty + Overnight Sleeper Bus",
                icon: "fa-bus",
                timing: "Return Scooty by 08:30 PM • Bus at 11:00 PM",
                purpose: "Option A (Belur Hoysala Temple) or Option B (Aldur green corridor & Siri Coffee) + town spice & coffee shopping. Overnight AC Sleeper bus back to Bengaluru."
            }
        ],
        mapCenter: [13.3650, 75.7500],
        mapZoom: 11,
        locations: [
            {
                id: "loc-tresca",
                name: "Tresca A Luxury Hotel",
                category: "stay",
                coords: [13.3182, 75.7788],
                desc: "Base camp on RG Road. 850m from KSRTC stand. 24-hr luggage cloakroom.",
                day: 1,
                time: "09:30 AM Arrival",
                icon: "fa-hotel",
                color: "pin-rose"
            },
            {
                id: "loc-vishnu",
                name: "Vishnu Delicacy / Town Caffee",
                category: "food",
                coords: [13.3195, 75.7765],
                desc: "Quick South Indian breakfast and artisanal filter coffee right on RG Road.",
                day: 1,
                time: "10:15 AM",
                icon: "fa-utensils",
                color: "pin-amber"
            },
            {
                id: "loc-jhari",
                name: "Jhari (Buttermilk) Falls",
                category: "nature",
                coords: [13.4116, 75.7663],
                desc: "Switch to 4x4 open jeep (~₹800) at estate checkpost for thrilling muddy off-road ride.",
                day: 1,
                time: "11:45 AM – 01:45 PM",
                icon: "fa-water",
                color: "pin-cyan"
            },
            {
                id: "loc-siri-lunch",
                name: "Siri Cafe / Countryside Lunch",
                category: "food",
                coords: [13.3361, 75.7631],
                desc: "Malnad lunch stop along the hill route before the afternoon climb.",
                day: 1,
                time: "02:00 PM – 03:00 PM",
                icon: "fa-bowl-food",
                color: "pin-amber"
            },
            {
                id: "loc-mullayanagiri",
                name: "Mullayanagiri Peak",
                category: "viewpoint",
                coords: [13.3911, 75.7214],
                desc: "Highest point in Karnataka (1,930m). Stone steps along windy ridge with drifting clouds.",
                day: 1,
                time: "03:30 PM – 05:30 PM",
                icon: "fa-mountain",
                color: "pin-emerald"
            },
            {
                id: "loc-hirekolale",
                name: "Hirekolale Lake",
                category: "viewpoint",
                coords: [13.3639, 75.7275],
                desc: "Tranquil stone embankment to watch the golden sunset reflecting over mountain waters.",
                day: 1,
                time: "05:45 PM – 06:45 PM",
                icon: "fa-sun",
                color: "pin-purple"
            },
            {
                id: "loc-scooty-hub",
                name: "Scooty Rental Hub (Happy Go / Royal Brothers)",
                category: "transport",
                coords: [13.3155, 75.7730],
                desc: "Walk 500m towards KSRTC Bus Stand / Barlane Rd. Collect 125cc scooter.",
                day: 2,
                time: "09:30 AM",
                icon: "fa-motorcycle",
                color: "pin-blue"
            },
            {
                id: "loc-baba-budangiri",
                name: "Baba Budangiri & Z-Point",
                category: "nature",
                coords: [13.4241, 75.7672],
                desc: "Winding ghat roads through coffee estates. Dramatic narrow ridge walk with deep valley drops.",
                day: 2,
                time: "10:00 AM – 01:30 PM",
                icon: "fa-person-hiking",
                color: "pin-emerald"
            },
            {
                id: "loc-coffee-museum",
                name: "Coffee Museum & Plantation Cafe",
                category: "culture",
                coords: [13.3276, 75.7766],
                desc: "Coffee Board of India museum + fresh artisanal pour-overs at Cafe Agape or World of Coffee.",
                day: 2,
                time: "03:30 PM – 05:30 PM",
                icon: "fa-mug-hot",
                color: "pin-amber"
            },
            {
                id: "loc-belur",
                name: "Belur Chennakeshava Temple (Option A)",
                category: "culture",
                coords: [13.1623, 75.8601],
                desc: "12th-century UNESCO heritage Hoysala soapstone temple with intricate star-shaped architecture.",
                day: 3,
                time: "11:30 AM – 03:00 PM",
                icon: "fa-gopuram",
                color: "pin-purple"
            },
            {
                id: "loc-siri-coffee",
                name: "Siri Coffee & Aldur Corridor (Option B)",
                category: "nature",
                coords: [13.3361, 75.7631],
                desc: "Canopy tree route to iconic giant female sculpture with lush garden seating.",
                day: 3,
                time: "11:30 AM – 03:00 PM",
                icon: "fa-tree",
                color: "pin-emerald"
            },
            {
                id: "loc-shopping",
                name: "Panduranga & Classic Coffee (MG Road)",
                category: "shopping",
                coords: [13.3175, 75.7745],
                desc: "Fresh ground Arabica/Robusta blends, green cardamom, black pepper, cinnamon, and fresh banana chips.",
                day: 3,
                time: "05:00 PM – 07:30 PM",
                icon: "fa-bag-shopping",
                color: "pin-blue"
            },
            {
                id: "loc-ksrtc",
                name: "KSRTC Main Bus Stand",
                category: "transport",
                coords: [13.3149, 75.7722],
                desc: "Board 11:00 PM AC Sleeper bus back to Bengaluru (arrives ~05:00 AM Tuesday).",
                day: 3,
                time: "10:15 PM Boarding",
                icon: "fa-bus",
                color: "pin-blue"
            }
        ],
        itinerary: [
            {
                dayNumber: 1,
                date: "Saturday, Sep 12, 2026",
                title: "Waterfalls, Cloud Walks & Sunset",
                highlight: "Private Cab + 4x4 Off-Road Jeep",
                transportBadge: "Cab + Jeep",
                events: [
                    {
                        time: "09:30 AM – 10:15 AM",
                        title: "Arrival & Strategic Bag Drop at Tresca",
                        category: "logistics",
                        locationId: "loc-tresca",
                        desc: "Arrive in Chikmagalur. Take a 2-min auto (850m) to Tresca A Luxury Hotel. Drop bags at 24-hr cloakroom, freshen up in lobby washroom, change into comfortable hill attire.",
                        tip: "Don't wait for standard 12:00 PM check-in; get out into the hills immediately without luggage!",
                        badge: "Bag Drop"
                    },
                    {
                        time: "10:15 AM – 10:45 AM",
                        title: "South Indian Breakfast & Filter Kaapi",
                        category: "food",
                        locationId: "loc-vishnu",
                        desc: "Quick crispy dosas, idli-vada, and piping hot Chikmagalur filter coffee at Vishnu Delicacy or Town Caffee on RG Road.",
                        tip: "Fuel up well before the mountain drive.",
                        badge: "Breakfast"
                    },
                    {
                        time: "11:00 AM",
                        title: "Private Cab Pickup at Tresca",
                        category: "transport",
                        locationId: "loc-tresca",
                        desc: "Your pre-arranged private cab picks you up directly from hotel porch to handle hairpin ghat curves.",
                        tip: "Keep a light rain jacket/windcheater and cash handy.",
                        badge: "Cab Pickup"
                    },
                    {
                        time: "11:45 AM – 01:45 PM",
                        title: "Jhari (Buttermilk) Falls Off-Roading",
                        category: "nature",
                        locationId: "loc-jhari",
                        desc: "Cab drops at estate checkpost. Switch to local 4x4 open jeep (~₹800 per jeep) for a thrilling, muddy off-road descent through private coffee plantations to the roaring falls.",
                        tip: "Wear water-resistant footwear with good grip. Rocky surfaces can be slippery.",
                        badge: "Must Visit"
                    },
                    {
                        time: "02:00 PM – 03:00 PM",
                        title: "Countryside Malnad Lunch",
                        category: "food",
                        locationId: "loc-siri-lunch",
                        desc: "Relaxed lunch stop at Siri Cafe or a traditional Malnad eatery along the route.",
                        tip: "Try local Akki Roti or mild coconut vegetable curry.",
                        badge: "Lunch"
                    },
                    {
                        time: "03:30 PM – 05:30 PM",
                        title: "Mullayanagiri Peak Climb (Highest in Karnataka)",
                        category: "viewpoint",
                        locationId: "loc-mullayanagiri",
                        desc: "Afternoon timing is strategic: morning tourist rush has cleared. Climb the stone steps along the windy ridge to the 1,930m peak for panoramic views through drifting mist.",
                        tip: "Can get very windy and chilly; zip up your windcheaters.",
                        badge: "Peak Trek"
                    },
                    {
                        time: "05:45 PM – 06:45 PM",
                        title: "Hirekolale Lake Golden Hour",
                        category: "viewpoint",
                        locationId: "loc-hirekolale",
                        desc: "Descend from the hills and stop at Hirekolale Lake. Sit on the stone embankment watching the tranquil sunset reflecting across the mountain waters.",
                        tip: "Terrific spot for calm landscape photography.",
                        badge: "Sunset"
                    },
                    {
                        time: "07:15 PM – 08:30 PM",
                        title: "Formal Check-in & Hot Shower",
                        category: "logistics",
                        locationId: "loc-tresca",
                        desc: "Cab drops you back at Tresca. Collect bags, complete room check-in, unpack, and enjoy a long hot shower.",
                        tip: "Rest up your legs after the Mullayanagiri stone steps.",
                        badge: "Check-in"
                    },
                    {
                        time: "08:30 PM onwards",
                        title: "Dinner at The Estate Cafe or RG Road",
                        category: "food",
                        locationId: "loc-vishnu",
                        desc: "Enjoy a relaxed dinner at The Estate Cafe or stroll along RG Road for dinner at Kailash Parbat or Hotel Matsya.",
                        tip: "Early night sleep for Sunday morning scooty cruising!",
                        badge: "Dinner"
                    }
                ]
            },
            {
                dayNumber: 2,
                date: "Sunday, Sep 13, 2026",
                title: "Ridge Views & Plantation Cruising",
                highlight: "125cc Scooty Freedom Day",
                transportBadge: "125cc Scooty",
                events: [
                    {
                        time: "08:30 AM – 09:15 AM",
                        title: "Breakfast on RG Road",
                        category: "food",
                        locationId: "loc-vishnu",
                        desc: "Fresh morning breakfast on RG Road within walking distance from Tresca.",
                        tip: "Carry your physical driver's license for scooter rental.",
                        badge: "Breakfast"
                    },
                    {
                        time: "09:30 AM",
                        title: "Collect 125cc Scooters near KSRTC Stand",
                        category: "transport",
                        locationId: "loc-scooty-hub",
                        desc: "Walk 500m towards KSRTC Bus Stand / Barlane Road to collect 125cc scooter (Happy Go Rentals or Royal Brothers).",
                        tip: "If 2 traveling: 1 scooty (125cc). If 3 traveling: rent 2 scooties to avoid hefty mountain traffic fines and ensure uphill power.",
                        badge: "Rental Pickup"
                    },
                    {
                        time: "10:00 AM – 01:30 PM",
                        title: "Baba Budangiri & Z-Point Ridge Trail",
                        category: "nature",
                        locationId: "loc-baba-budangiri",
                        desc: "Ride up the winding, scenic ghat roads through dense coffee estates to Baba Budangiri. Embark on the panoramic walk towards Z-Point (Kemmanagundi)—a narrow ridge trail with dramatic drops and lush valleys.",
                        tip: "Ride carefully around estate hairpin curves; honk on blind turns.",
                        badge: "Scenic Ride"
                    },
                    {
                        time: "02:00 PM – 03:00 PM",
                        title: "Estate-facing Lunch or Dhaba",
                        category: "food",
                        locationId: "loc-siri-lunch",
                        desc: "Lunch at an estate-facing cafe or local roadside dhaba along the descent.",
                        tip: "Try freshly made Neer Dosa or local Thali.",
                        badge: "Lunch"
                    },
                    {
                        time: "03:30 PM – 05:30 PM",
                        title: "Coffee Museum & Plantation Cafe Pour-overs",
                        category: "culture",
                        locationId: "loc-coffee-museum",
                        desc: "Ride back towards town along KM Road to visit the Coffee Museum (run by Coffee Board of India) to learn coffee harvesting, roasting, and bean classification. Stop by Cafe Agape or World of Coffee for artisanal pour-overs.",
                        tip: "Ask the barista about Malnad peaberry roast profiles.",
                        badge: "Coffee Culture"
                    },
                    {
                        time: "07:30 PM onwards",
                        title: "Evening Town Cruising & Dinner",
                        category: "food",
                        locationId: "loc-tresca",
                        desc: "Cruise through the evening breeze in town, grab dinner, and return to Tresca for a restful night.",
                        tip: "Fuel up the scooty if needle is low for Monday morning.",
                        badge: "Evening Chill"
                    }
                ]
            },
            {
                dayNumber: 3,
                date: "Monday, Sep 14, 2026",
                title: "Heritage, Coffee Shopping & Departure",
                highlight: "Belur / Aldur + Spice Shopping + Sleeper Bus",
                transportBadge: "Scooty + Sleeper Bus",
                events: [
                    {
                        time: "08:30 AM – 10:30 AM",
                        title: "Breakfast & Packing Up",
                        category: "logistics",
                        locationId: "loc-tresca",
                        desc: "Pack bags, have breakfast on RG Road, prepare daypacks for the final afternoon.",
                        tip: "Separate your bus travel clothes into a top pouch.",
                        badge: "Packing"
                    },
                    {
                        time: "11:00 AM",
                        title: "Check-out & Luggage Cloakroom Drop",
                        category: "logistics",
                        locationId: "loc-tresca",
                        desc: "Check out of Tresca. Hand backpacks to front desk reception to hold safely in the cloakroom for the entire day.",
                        tip: "Reception is 24-hr staffed, so collection at 9 PM is seamless.",
                        badge: "Check-out"
                    },
                    {
                        time: "11:30 AM – 03:00 PM",
                        title: "Choice of Final Day Route (By Scooty)",
                        category: "culture",
                        locationId: "loc-belur",
                        desc: "Choose between two outstanding experiences:\n• Option A: 25 km ride to Belur to witness the 12th-century Hoysala Chennakeshava Temple.\n• Option B: Scenic cruise down Aldur/Mudigere canopy road, stopping at Siri Coffee sculpture gardens.",
                        tip: "Belur has smooth, flat highway riding; Aldur has tree-shaded plantation twists.",
                        badge: "Choice Route"
                    },
                    {
                        time: "03:30 PM – 04:30 PM",
                        title: "Late Town Lunch",
                        category: "food",
                        locationId: "loc-vishnu",
                        desc: "Savor a leisurely late lunch at a top town restaurant.",
                        tip: "Stay hydrated after the afternoon ride.",
                        badge: "Lunch"
                    },
                    {
                        time: "05:00 PM – 07:30 PM",
                        title: "Coffee & Malnad Spice Shopping on MG Road",
                        category: "shopping",
                        locationId: "loc-shopping",
                        desc: "• Fresh Ground Coffee: Freshly roasted Arabica/Robusta blends at Panduranga Coffee or Classic Coffee.\n• Malnad Spices: Whole green cardamom, black pepper, and cinnamon bark.\n• Local Snacks: Hot banana and jackfruit chips.",
                        tip: "Panduranga Coffee grinds your beans on the spot to match your home brewer (filter/French press/aeropress).",
                        badge: "Shopping Hub"
                    },
                    {
                        time: "08:00 PM",
                        title: "Scooty Return & Deposit Settlement",
                        category: "transport",
                        locationId: "loc-scooty-hub",
                        desc: "Return scooty to rental hub, collect security deposit, and hand back helmets.",
                        tip: "Inspect vehicle with the vendor to close the return slip cleanly.",
                        badge: "Scooty Return"
                    },
                    {
                        time: "08:30 PM – 09:45 PM",
                        title: "Freshen Up at Tresca & Dinner",
                        category: "logistics",
                        locationId: "loc-tresca",
                        desc: "Walk back to Tresca, collect bags from cloakroom, change into cozy bus clothes, and enjoy a sit-down dinner nearby.",
                        tip: "No rush—you are only 850m from the bus stand.",
                        badge: "Dinner & Rest"
                    },
                    {
                        time: "10:15 PM – 11:30 PM",
                        title: "Board Overnight KSRTC AC Sleeper to BLR",
                        category: "transport",
                        locationId: "loc-ksrtc",
                        desc: "Take a 2-min auto (or easy 8-min walk) to KSRTC Bus Stand. Board 11:00 PM AC Sleeper bus back to Bengaluru. Arrives Tuesday ~05:00 AM.",
                        tip: "Set an alarm for 04:45 AM approaching Majestic/Yeshwantpur.",
                        badge: "Bus Departure"
                    }
                ]
            }
        ],
        packingList: [
            { id: "p1", item: "Valid Physical Driver's License (mandatory for scooty)", category: "Documents", checked: false },
            { id: "p2", item: "Cash ₹1,500–₹2,000 for Jhari Falls 4x4 Jeep & checkposts", category: "Essentials", checked: false },
            { id: "p3", item: "Light Windcheater / Rain Jacket (windy at Mullayanagiri)", category: "Clothing", checked: false },
            { id: "p4", item: "Comfortable trekking / walking shoes with good tread", category: "Clothing", checked: false },
            { id: "p5", item: "Sunglasses & UV Sunscreen for scooty cruising", category: "Personal Care", checked: false },
            { id: "p6", item: "Power Bank & Phone Bike Mount (if available)", category: "Electronics", checked: false },
            { id: "p7", item: "Offline Google Maps downloaded for Chikmagalur district", category: "Digital", checked: false },
            { id: "p8", item: "Tote bag or extra space in backpack for coffee & spices", category: "Shopping", checked: false }
        ]
    },
    {
        id: "vietnam-2026",
        title: "Vietnam Master Expedition",
        destination: "Hanoi, Ha Long Bay, Da Nang & Hoi An",
        flag: "🇻🇳",
        status: "past",
        dates: "Dec 3 – 10, 2026",
        startDate: "2026-12-03",
        endDate: "2026-12-10",
        travelers: "5 Adults",
        heroGradient: "from-red-950 via-slate-900 to-amber-950",
        accentColor: "#ef4444",
        badge: "International • 8 Days",
        summary: "Comprehensive multi-city expedition across Hanoi Old Quarter, emerald waters of Ha Long Bay overnight cruise, Ba Na Hills Golden Bridge, and lantern-lit Hoi An ancient town.",
        externalLink: "../vietnam_trip_architect_5_0.html",
        basecamp: {
            name: "Multi-City Accommodations",
            location: "Hanoi • Ha Long Bay Cruise • Da Nang / Hoi An",
            distanceFromStation: "Full 9-Seater Private Limousine Service",
            checkIn: "Multiple",
            checkOut: "Multiple",
            arrivalStrategy: "Pre-arranged luxury limousine transfers, VIP fast-track airport immigration, and curated senior-comfort pacing.",
            diningNote: "Extensive pure vegetarian dining matrix & Vietnamese audio pronunciation cards included.",
            coords: [21.0285, 105.8542]
        },
        transportPlan: [
            {
                day: "Dec 3–5",
                mode: "9-Seater Luxury Limousine",
                icon: "fa-van-shuttle",
                timing: "Airport transfers & Hanoi city touring",
                purpose: "Spacious captain chairs for 5 adults with ample luggage volume."
            },
            {
                day: "Dec 5–6",
                mode: "5-Star Ha Long Luxury Cruise",
                icon: "fa-ship",
                timing: "Overnight Bay Cruise",
                purpose: "Private balcony suites through limestone karst pinnacles."
            },
            {
                day: "Dec 6–10",
                mode: "Domestic Flight + Limousine",
                icon: "fa-plane",
                timing: "Da Nang / Hoi An exploration",
                purpose: "Marble Mountains, Golden Bridge, and Hoi An lantern boat rides."
            }
        ],
        mapCenter: [16.0544, 108.2022],
        mapZoom: 6,
        locations: [
            {
                id: "loc-hanoi",
                name: "Hanoi Old Quarter & Hoan Kiem",
                category: "culture",
                coords: [21.0285, 105.8542],
                desc: "Centuries-old architecture, street egg coffee, and historic French Quarter.",
                day: 1,
                time: "Dec 3",
                icon: "fa-landmark",
                color: "pin-amber"
            },
            {
                id: "loc-halong",
                name: "Ha Long Bay (Limestone Karsts)",
                category: "nature",
                coords: [20.9101, 107.1839],
                desc: "UNESCO World Heritage site with emerald waters and hidden caves.",
                day: 3,
                time: "Dec 5",
                icon: "fa-water",
                color: "pin-cyan"
            },
            {
                id: "loc-danang",
                name: "Da Nang & Golden Hand Bridge",
                category: "viewpoint",
                coords: [15.9953, 107.9965],
                desc: "Ba Na Hills cable car to the iconic giant hands holding the golden sky walkway.",
                day: 5,
                time: "Dec 7",
                icon: "fa-bridge",
                color: "pin-emerald"
            },
            {
                id: "loc-hoian",
                name: "Hoi An Ancient Town",
                category: "culture",
                coords: [15.8801, 108.3380],
                desc: "Preserved trading port, glowing silk lanterns, custom tailoring, and riverside night markets.",
                day: 6,
                time: "Dec 8",
                icon: "fa-store",
                color: "pin-purple"
            }
        ],
        itinerary: [
            {
                dayNumber: 1,
                date: "Day 1: Arrival Hanoi",
                title: "Welcome to Vietnam",
                highlight: "Hanoi Old Quarter & Hoan Kiem",
                transportBadge: "Private Limousine",
                events: [
                    {
                        time: "Morning / Afternoon",
                        title: "Airport Arrival & Hotel Check-in",
                        category: "logistics",
                        locationId: "loc-hanoi",
                        desc: "VIP arrival transfer in 9-seater luxury limousine to Hanoi Old Quarter hotel.",
                        tip: "Use the built-in FX converter for VND.",
                        badge: "Arrival"
                    }
                ]
            },
            {
                dayNumber: 2,
                date: "Day 3–4: Ha Long Bay",
                title: "Overnight Luxury Cruise",
                highlight: "Emerald Waters & Karst Islands",
                transportBadge: "Cruise Ship",
                events: [
                    {
                        time: "Full Day",
                        title: "Cruising & Kayaking",
                        category: "nature",
                        locationId: "loc-halong",
                        desc: "Sail through thousands of jagged limestone islands with cooking classes, cave tours, and sunset deck dining.",
                        tip: "Spectacular sunrise tai chi on deck.",
                        badge: "UNESCO Site"
                    }
                ]
            }
        ],
        packingList: [
            { id: "pv1", item: "Passports (valid 6+ months) & Vietnam e-Visas", category: "Documents", checked: true },
            { id: "pv2", item: "Universal power adapters", category: "Electronics", checked: true },
            { id: "pv3", item: "Light warm layers for Hanoi winter evenings", category: "Clothing", checked: true },
            { id: "pv4", item: "Comfortable walking sneakers", category: "Clothing", checked: true }
        ]
    }
];

// Provide helper to get trips from LocalStorage or fall back to defaults
function getStoredTrips() {
    try {
        const custom = localStorage.getItem("trip_architect_custom_trips");
        if (custom) {
            const parsed = JSON.parse(custom);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn("Could not load custom trips from localStorage, using defaults", e);
    }
    return DEFAULT_TRIPS;
}

function saveTripsToStorage(trips) {
    try {
        localStorage.setItem("trip_architect_custom_trips", JSON.stringify(trips));
    } catch (e) {
        console.error("Failed to save trips to localStorage", e);
    }
}

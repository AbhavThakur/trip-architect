/**
 * Personal Travel Architect & Trip Hub - Core Application Logic
 */

let state = {
    trips: [],
    activeTripId: "chikmagalur-2026",
    viewMode: "trip", // "catalog" or "trip"
    activeTab: "itinerary", // "itinerary", "logistics", "packing", "guide"
    activeDay: "all",
    activeTransportFilter: "all",
    map: null,
    markers: {},
    isLightMode: false,
    seniorMode: false
};

// Initialize app once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    state.trips = getStoredTrips();
    
    // Check local storage for theme
    if (localStorage.getItem("trip_architect_theme") === "light") {
        state.isLightMode = true;
        document.body.classList.add("light-theme");
    }

    // Check URL parameters or hash
    const hash = window.location.hash.replace("#", "");
    if (hash === "catalog") {
        state.viewMode = "catalog";
    } else if (hash && state.trips.some(t => t.id === hash)) {
        state.activeTripId = hash;
        state.viewMode = "trip";
    }

    renderApp();
    setupLiveClocks();
});

function setupLiveClocks() {
    function update() {
        const now = new Date();
        const timeEl = document.getElementById("header-live-time");
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    }
    update();
    setInterval(update, 1000);
}

function toggleTheme() {
    state.isLightMode = !state.isLightMode;
    if (state.isLightMode) {
        document.body.classList.add("light-theme");
        localStorage.setItem("trip_architect_theme", "light");
    } else {
        document.body.classList.remove("light-theme");
        localStorage.setItem("trip_architect_theme", "dark");
    }
    const icon = document.getElementById("theme-toggle-icon");
    if (icon) {
        icon.className = state.isLightMode ? "fa-solid fa-sun text-amber-400" : "fa-solid fa-moon text-slate-300";
    }
    // Update map style if initialized
    if (state.map) {
        const mapWrapper = document.getElementById("map-wrapper");
        if (mapWrapper) {
            if (state.isLightMode) {
                mapWrapper.classList.remove("dark-map");
            } else {
                mapWrapper.classList.add("dark-map");
            }
        }
    }
}

function toggleSeniorMode() {
    state.seniorMode = !state.seniorMode;
    const btn = document.getElementById("senior-mode-btn");
    if (btn) {
        if (state.seniorMode) {
            btn.classList.add("bg-emerald-600", "text-white");
            btn.classList.remove("bg-slate-800", "text-slate-300");
        } else {
            btn.classList.remove("bg-emerald-600", "text-white");
            btn.classList.add("bg-slate-800", "text-slate-300");
        }
    }
    renderActiveTabContent();
}

function setViewMode(mode, tripId = null) {
    state.viewMode = mode;
    if (tripId) {
        state.activeTripId = tripId;
    }
    window.location.hash = mode === "catalog" ? "catalog" : state.activeTripId;
    renderApp();
}

function renderApp() {
    renderTopNavbar();
    if (state.viewMode === "catalog") {
        document.getElementById("catalog-view").classList.remove("hidden");
        document.getElementById("trip-view").classList.add("hidden");
        renderCatalog();
    } else {
        document.getElementById("catalog-view").classList.add("hidden");
        document.getElementById("trip-view").classList.remove("hidden");
        renderTripView();
    }
}

function renderTopNavbar() {
    const tripSelector = document.getElementById("trip-quick-selector");
    if (!tripSelector) return;

    let optionsHtml = state.trips.map(trip => `
        <option value="${trip.id}" ${trip.id === state.activeTripId && state.viewMode === 'trip' ? 'selected' : ''}>
            ${trip.flag} ${trip.title} (${trip.dates})
        </option>
    `).join("");

    tripSelector.innerHTML = `
        <option value="catalog" ${state.viewMode === 'catalog' ? 'selected' : ''}>📚 View All Trips (Hub)</option>
        <optgroup label="Your Trips">
            ${optionsHtml}
        </optgroup>
    `;

    tripSelector.onchange = (e) => {
        if (e.target.value === "catalog") {
            setViewMode("catalog");
        } else {
            setViewMode("trip", e.target.value);
        }
    };
}

/* =========================================================================
   CATALOG (ALL TRIPS) VIEW
   ========================================================================= */

function renderCatalog() {
    const upcomingContainer = document.getElementById("upcoming-trips-grid");
    const pastContainer = document.getElementById("past-trips-grid");
    if (!upcomingContainer || !pastContainer) return;

    const upcoming = state.trips.filter(t => t.status === "upcoming");
    const past = state.trips.filter(t => t.status === "past");

    document.getElementById("stat-total-trips").textContent = state.trips.length;
    document.getElementById("stat-upcoming").textContent = upcoming.length;
    document.getElementById("stat-past").textContent = past.length;

    upcomingContainer.innerHTML = upcoming.map(trip => createTripCardHtml(trip, true)).join("") || `
        <div class="col-span-full p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            <i class="fa-solid fa-calendar-plus text-3xl mb-3 text-slate-500"></i>
            <p>No upcoming trips planned yet. Click "+ Plan New Trip" above!</p>
        </div>
    `;

    pastContainer.innerHTML = past.map(trip => createTripCardHtml(trip, false)).join("") || `
        <div class="col-span-full p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
            <i class="fa-solid fa-box-archive text-3xl mb-3 text-slate-500"></i>
            <p>No archived trips in history yet.</p>
        </div>
    `;
}

function createTripCardHtml(trip, isUpcoming) {
    const countdown = getCountdownString(trip.startDate);
    return `
        <div class="glass-panel rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-800 hover:border-slate-700 flex flex-col group">
            <div class="bg-gradient-to-r ${trip.heroGradient || 'from-slate-900 to-indigo-950'} p-5 relative">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/40 text-amber-300 backdrop-blur-md border border-white/10">
                        ${trip.badge || 'Expedition'}
                    </span>
                    <span class="text-2xl">${trip.flag}</span>
                </div>
                <h3 class="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    ${trip.title}
                </h3>
                <p class="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                    <i class="fa-solid fa-location-dot text-emerald-400"></i> ${trip.destination}
                </p>
                ${isUpcoming && countdown ? `
                    <div class="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                        <i class="fa-regular fa-clock animate-pulse"></i> ${countdown}
                    </div>
                ` : ''}
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Travel Dates</span>
                            <span class="font-bold text-slate-200 mt-0.5 block">${trip.dates}</span>
                        </div>
                        <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Travelers</span>
                            <span class="font-bold text-slate-200 mt-0.5 block">${trip.travelers}</span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        ${trip.summary}
                    </p>
                </div>

                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    ${trip.externalLink ? `
                        <a href="${trip.externalLink}" target="_blank" class="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Master V5
                        </a>
                    ` : ''}
                    <button onclick="setViewMode('trip', '${trip.id}')" class="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                        <i class="fa-solid fa-compass"></i> Launch Itinerary
                    </button>
                    ${trip.id !== 'chikmagalur-2026' && trip.id !== 'vietnam-2026' ? `
                        <button onclick="deleteCustomTrip('${trip.id}')" class="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors" title="Delete Trip">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function getCountdownString(startDateStr) {
    if (!startDateStr) return null;
    const target = new Date(startDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff < 0) return "Happening Now / Completed";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Starts Tomorrow!" : `Starts in ${days} days`;
}

/* =========================================================================
   INDIVIDUAL TRIP COMPANION VIEW
   ========================================================================= */

function renderTripView() {
    const trip = state.trips.find(t => t.id === state.activeTripId) || state.trips[0];
    if (!trip) return;

    // Render Hero Header
    document.getElementById("trip-hero-flag").textContent = trip.flag;
    document.getElementById("trip-hero-title").textContent = trip.title;
    document.getElementById("trip-hero-dates").textContent = trip.dates;
    document.getElementById("trip-hero-travelers").textContent = trip.travelers;
    document.getElementById("trip-hero-summary").textContent = trip.summary;
    
    // Basecamp chip
    const basecampChip = document.getElementById("trip-basecamp-chip");
    if (basecampChip && trip.basecamp) {
        basecampChip.innerHTML = `
            <i class="fa-solid fa-hotel text-amber-400"></i>
            <span>Base: <strong>${trip.basecamp.name}</strong></span>
        `;
        basecampChip.classList.remove("hidden");
    } else if (basecampChip) {
        basecampChip.classList.add("hidden");
    }

    // Set Driver Modal Data
    const driverBtn = document.getElementById("btn-driver-modal");
    if (driverBtn && trip.basecamp) {
        driverBtn.classList.remove("hidden");
    } else if (driverBtn) {
        driverBtn.classList.add("hidden");
    }

    // Render Subtabs Navigation
    renderSubtabs();

    // Render Active Tab Content
    renderActiveTabContent();

    // Initialize or Update Map
    setTimeout(() => {
        initOrUpdateMap(trip);
    }, 100);
}

function renderSubtabs() {
    const tabs = [
        { id: "itinerary", label: "Itinerary & Map", icon: "fa-route" },
        { id: "logistics", label: "Basecamp & Transport", icon: "fa-hotel" },
        { id: "packing", label: "Checklist & Gear", icon: "fa-list-check" },
        { id: "guide", label: "Food & Shopping", icon: "fa-mug-hot" }
    ];

    const navContainer = document.getElementById("trip-subtabs-nav");
    if (!navContainer) return;

    navContainer.innerHTML = tabs.map(tab => {
        const isActive = state.activeTab === tab.id;
        return `
            <button onclick="switchTripTab('${tab.id}')" 
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
                    isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }">
                <i class="fa-solid ${tab.icon}"></i> ${tab.label}
            </button>
        `;
    }).join("");
}

function switchTripTab(tabId) {
    state.activeTab = tabId;
    renderSubtabs();
    renderActiveTabContent();
    if (tabId === "itinerary" && state.map) {
        setTimeout(() => state.map.invalidateSize(), 200);
    }
}

function renderActiveTabContent() {
    const trip = state.trips.find(t => t.id === state.activeTripId);
    if (!trip) return;

    const itineraryTab = document.getElementById("tab-content-itinerary");
    const logisticsTab = document.getElementById("tab-content-logistics");
    const packingTab = document.getElementById("tab-content-packing");
    const guideTab = document.getElementById("tab-content-guide");

    [itineraryTab, logisticsTab, packingTab, guideTab].forEach(el => el && el.classList.add("hidden"));

    if (state.activeTab === "itinerary") {
        if (itineraryTab) {
            itineraryTab.classList.remove("hidden");
            renderItineraryTab(trip);
        }
    } else if (state.activeTab === "logistics") {
        if (logisticsTab) {
            logisticsTab.classList.remove("hidden");
            renderLogisticsTab(trip);
        }
    } else if (state.activeTab === "packing") {
        if (packingTab) {
            packingTab.classList.remove("hidden");
            renderPackingTab(trip);
        }
    } else if (state.activeTab === "guide") {
        if (guideTab) {
            guideTab.classList.remove("hidden");
            renderGuideTab(trip);
        }
    }
}

/* =========================================================================
   ITINERARY & MAP SUBTAB
   ========================================================================= */

function renderItineraryTab(trip) {
    // Day Filter Buttons
    const dayFilterContainer = document.getElementById("day-filter-bar");
    if (dayFilterContainer && trip.itinerary) {
        let dayPills = `
            <button onclick="filterDay('all')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                state.activeDay === 'all' ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-sm' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }">
                All Days
            </button>
        `;
        dayPills += trip.itinerary.map(day => `
            <button onclick="filterDay(${day.dayNumber})" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                state.activeDay === day.dayNumber ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }">
                <span>Day ${day.dayNumber}</span>
                <span class="text-[10px] opacity-75 font-normal">(${day.transportBadge})</span>
            </button>
        `).join("");
        dayFilterContainer.innerHTML = dayPills;
    }

    // Render Timeline Events
    const timelineContainer = document.getElementById("timeline-events-container");
    if (!timelineContainer || !trip.itinerary) return;

    let filteredDays = trip.itinerary;
    if (state.activeDay !== "all") {
        filteredDays = trip.itinerary.filter(d => d.dayNumber === state.activeDay);
    }

    let html = "";
    filteredDays.forEach(day => {
        html += `
            <div class="mb-8">
                <div class="flex items-center justify-between gap-3 mb-4 sticky top-[138px] z-20 bg-slate-950/90 backdrop-blur-md py-2 border-b border-slate-800">
                    <div>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 font-mono">Day ${day.dayNumber} • ${day.date}</span>
                        <h4 class="text-base font-extrabold text-white">${day.title}</h4>
                    </div>
                    <span class="px-2.5 py-1 bg-slate-900 border border-slate-700/80 text-amber-300 font-bold text-[11px] rounded-lg">
                        <i class="fa-solid fa-van-shuttle mr-1"></i> ${day.highlight}
                    </span>
                </div>

                <div class="space-y-4 pl-2 border-l-2 border-slate-800/80 ml-2">
                    ${day.events.map(event => createEventCardHtml(event, day.dayNumber)).join("")}
                </div>
            </div>
        `;
    });

    timelineContainer.innerHTML = html || `
        <div class="p-8 text-center bg-slate-900/40 rounded-xl text-slate-400">
            No events found for this selection.
        </div>
    `;
}

function createEventCardHtml(event, dayNumber) {
    const isSeniorHighlight = state.seniorMode && (event.category === 'nature' || event.category === 'viewpoint');
    return `
        <div id="event-card-${event.locationId || Math.random()}" 
             class="timeline-event-card glass-panel p-4 rounded-xl relative -ml-[13px] border border-slate-800/80 shadow-md ${
                isSeniorHighlight ? 'ring-2 ring-emerald-500/50 bg-emerald-950/20' : ''
             }">
            <div class="flex items-start justify-between gap-3 mb-1.5">
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                        ${dayNumber}
                    </span>
                    <span class="text-xs font-mono font-bold text-slate-300">${event.time}</span>
                </div>
                <div class="flex items-center gap-1.5">
                    ${event.badge ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                            ${event.badge}
                        </span>
                    ` : ''}
                    ${event.locationId ? `
                        <button onclick="focusLocationOnMap('${event.locationId}')" class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700/60 hover:bg-emerald-600 text-white flex items-center gap-1 active:scale-95" title="Show on Map">
                            <i class="fa-solid fa-map-pin text-gold-300"></i> Map
                        </button>
                    ` : ''}
                </div>
            </div>

            <h5 class="text-sm font-bold text-white mb-1.5">${event.title}</h5>
            <p class="text-xs text-slate-300 leading-relaxed mb-2 whitespace-pre-line">${event.desc}</p>

            ${event.tip ? `
                <div class="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200/90 flex items-start gap-2">
                    <i class="fa-solid fa-lightbulb text-amber-400 mt-0.5 shrink-0"></i>
                    <div>
                        <strong class="font-bold text-amber-300">Strategy Tip:</strong> ${event.tip}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function filterDay(day) {
    state.activeDay = day;
    renderItineraryTab(state.trips.find(t => t.id === state.activeTripId));
    // Filter map markers
    if (state.map && state.markers) {
        Object.entries(state.markers).forEach(([locId, markerData]) => {
            if (day === "all" || markerData.day === day) {
                markerData.marker.addTo(state.map);
            } else {
                markerData.marker.remove();
            }
        });
    }
}

/* =========================================================================
   LOGISTICS & STAY SUBTAB
   ========================================================================= */

function renderLogisticsTab(trip) {
    const container = document.getElementById("tab-content-logistics");
    if (!container) return;

    const basecamp = trip.basecamp;
    const transport = trip.transportPlan;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Stay & Early Arrival Strategy -->
            <div class="glass-panel p-5 rounded-2xl border border-slate-800">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-lg">
                        <i class="fa-solid fa-hotel"></i>
                    </div>
                    <div>
                        <h4 class="text-base font-extrabold text-white">${basecamp ? basecamp.name : 'Accommodations'}</h4>
                        <p class="text-xs text-slate-400">${basecamp ? basecamp.location : ''}</p>
                    </div>
                </div>

                ${basecamp ? `
                    <div class="space-y-4 text-xs">
                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <span class="text-amber-400 font-bold block mb-1">
                                <i class="fa-solid fa-location-crosshairs mr-1"></i> Strategic Proximity
                            </span>
                            <p class="text-slate-300 leading-relaxed">${basecamp.distanceFromStation}</p>
                            <div class="mt-2 text-slate-400 font-mono text-[11px]">
                                Check-in: <strong>${basecamp.checkIn}</strong> • Check-out: <strong>${basecamp.checkOut}</strong>
                            </div>
                        </div>

                        <div class="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30">
                            <span class="text-emerald-400 font-bold block mb-1">
                                <i class="fa-solid fa-clock-rotate-left mr-1"></i> 9:30 AM Arrival Bag Drop Protocol
                            </span>
                            <p class="text-slate-200 leading-relaxed">${basecamp.arrivalStrategy}</p>
                        </div>

                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <span class="text-blue-400 font-bold block mb-1">
                                <i class="fa-solid fa-utensils mr-1"></i> Dining & RG Road Connectivity
                            </span>
                            <p class="text-slate-300 leading-relaxed">${basecamp.diningNote}</p>
                        </div>

                        ${basecamp.addressKannada ? `
                            <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-slate-400 text-[10px] uppercase font-bold">Kannada Taxi Address Card</span>
                                    <button onclick="navigator.clipboard.writeText('${basecamp.addressKannada}')" class="text-xs text-amber-400 hover:text-amber-300">
                                        <i class="fa-regular fa-copy"></i> Copy
                                    </button>
                                </div>
                                <div class="font-sans text-sm font-semibold text-emerald-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                    ${basecamp.addressKannada}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : `
                    <p class="text-xs text-slate-400">No basecamp data defined for this trip.</p>
                `}
            </div>

            <!-- Hybrid Transport Structure -->
            <div class="glass-panel p-5 rounded-2xl border border-slate-800">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-lg">
                        <i class="fa-solid fa-van-shuttle"></i>
                    </div>
                    <div>
                        <h4 class="text-base font-extrabold text-white">Hybrid Transport Structure</h4>
                        <p class="text-xs text-slate-400">Tailored by terrain & comfort requirements</p>
                    </div>
                </div>

                <div class="space-y-3.5">
                    ${transport ? transport.map(t => `
                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                            <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 text-sm mt-0.5">
                                <i class="fa-solid ${t.icon || 'fa-car'}"></i>
                            </div>
                            <div class="text-xs flex-1">
                                <div class="flex items-center justify-between gap-2">
                                    <h5 class="font-bold text-white">${t.day}</h5>
                                    <span class="text-[11px] text-amber-400 font-mono font-semibold">${t.timing}</span>
                                </div>
                                <p class="text-emerald-300 font-semibold mt-0.5">${t.mode}</p>
                                <p class="text-slate-300 mt-1 leading-relaxed">${t.purpose}</p>
                            </div>
                        </div>
                    `).join("") : `
                        <p class="text-xs text-slate-400">No transport plan specified.</p>
                    `}
                </div>
            </div>
        </div>
    `;
}

/* =========================================================================
   PACKING CHECKLIST SUBTAB
   ========================================================================= */

function renderPackingTab(trip) {
    const container = document.getElementById("tab-content-packing");
    if (!container) return;

    const list = trip.packingList || [];
    const savedStates = JSON.parse(localStorage.getItem(`packing_${trip.id}`) || "{}");

    container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 max-w-3xl mx-auto">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                <div>
                    <h4 class="text-lg font-extrabold text-white">Pre-Departure & Gear Checklist</h4>
                    <p class="text-xs text-slate-400">Checked items are automatically saved in local browser storage</p>
                </div>
                <button onclick="resetPackingChecklist('${trip.id}')" class="text-xs text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <i class="fa-solid fa-rotate-left mr-1"></i> Reset
                </button>
            </div>

            <div class="space-y-3">
                ${list.map(item => {
                    const isChecked = savedStates[item.id] !== undefined ? savedStates[item.id] : item.checked;
                    return `
                        <label class="flex items-start gap-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 cursor-pointer transition-colors group">
                            <input type="checkbox" 
                                   onchange="togglePackingItem('${trip.id}', '${item.id}', this.checked)"
                                   ${isChecked ? 'checked' : ''} 
                                   class="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700">
                            <div class="flex-1 text-xs">
                                <span class="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono mr-1.5">
                                    ${item.category}
                                </span>
                                <span class="${isChecked ? 'line-through text-slate-500' : 'text-slate-200'} font-medium">
                                    ${item.item}
                                </span>
                            </div>
                        </label>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}

function togglePackingItem(tripId, itemId, checked) {
    const key = `packing_${tripId}`;
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    saved[itemId] = checked;
    localStorage.setItem(key, JSON.stringify(saved));
    renderPackingTab(state.trips.find(t => t.id === tripId));
}

function resetPackingChecklist(tripId) {
    localStorage.removeItem(`packing_${tripId}`);
    renderPackingTab(state.trips.find(t => t.id === tripId));
}

/* =========================================================================
   FOOD & SHOPPING GUIDE SUBTAB
   ========================================================================= */

function renderGuideTab(trip) {
    const container = document.getElementById("tab-content-guide");
    if (!container) return;

    if (trip.id === "chikmagalur-2026") {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Coffee & Spice Shopping -->
                <div class="glass-panel p-5 rounded-2xl border border-slate-800">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-700 flex items-center justify-center text-white text-lg">
                            <i class="fa-solid fa-mug-hot"></i>
                        </div>
                        <div>
                            <h4 class="text-base font-extrabold text-white">Chikmagalur Coffee & Spices</h4>
                            <p class="text-xs text-slate-400">Authentic plantation roasts & Malnad spices</p>
                        </div>
                    </div>

                    <div class="space-y-3.5 text-xs">
                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-amber-300 text-sm mb-1">Panduranga Coffee (MG Road)</h5>
                            <p class="text-slate-300 leading-relaxed">
                                Famous legacy roaster since 1938. Get whole beans or customized fine-ground blends (e.g. 80:20 Arabica:Chicory or 100% Pure Malnad Peaberry). Ground fresh right in front of you.
                            </p>
                        </div>

                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-amber-300 text-sm mb-1">Classic Coffee & Coffee Board Museum</h5>
                            <p class="text-slate-300 leading-relaxed">
                                Single-origin micro-lots from higher altitude estates. Learn the wet vs dry processing classification at the Coffee Board Museum on KM Road.
                            </p>
                        </div>

                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-emerald-300 text-sm mb-1">Malnad Spice Checklist</h5>
                            <ul class="list-disc list-inside text-slate-300 space-y-1 mt-1">
                                <li>Whole Green Cardamom (8mm premium grade pods)</li>
                                <li>Sun-dried Black Peppercorns</li>
                                <li>Cassia / True Cinnamon Bark rolls</li>
                                <li>Freshly fried hot banana and jackfruit chips on Market Road</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Culinary Highlights -->
                <div class="glass-panel p-5 rounded-2xl border border-slate-800">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-lg">
                            <i class="fa-solid fa-utensils"></i>
                        </div>
                        <div>
                            <h4 class="text-base font-extrabold text-white">Recommended Food & Cafes</h4>
                            <p class="text-xs text-slate-400">Local flavors & scenic coffee terraces</p>
                        </div>
                    </div>

                    <div class="space-y-3.5 text-xs">
                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-emerald-300 text-sm mb-1">Vishnu Delicacy / Town Caffee (RG Road)</h5>
                            <p class="text-slate-300 leading-relaxed">
                                Right next to Tresca Hotel. Best South Indian filter coffee, crispy Benne Dose, and hot idlis for quick breakfasts before cab pickups.
                            </p>
                        </div>

                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-emerald-300 text-sm mb-1">Siri Coffee (Aldur Road)</h5>
                            <p class="text-slate-300 leading-relaxed">
                                Iconic sculpture garden cafe with outdoor seating under lush green canopies. Great for midday pour-overs and snacks.
                            </p>
                        </div>

                        <div class="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            <h5 class="font-bold text-emerald-300 text-sm mb-1">The Estate Cafe / World of Coffee</h5>
                            <p class="text-slate-300 leading-relaxed">
                                Relaxed evening ambiance with estate views and artisanal brewing methods (V60, French Press, Aeropress).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto">
                <i class="fa-solid fa-book-open text-3xl text-emerald-400 mb-3"></i>
                <h4 class="text-base font-bold text-white mb-2">Guide & Recommendations</h4>
                <p class="text-xs text-slate-300 leading-relaxed">
                    Custom dining and shopping notes for this trip can be explored in detail in the master itinerary.
                </p>
            </div>
        `;
    }
}

/* =========================================================================
   LEAFLET MAP INTEGRATION
   ========================================================================= */

function initOrUpdateMap(trip) {
    const mapElement = document.getElementById("map");
    if (!mapElement || !trip.locations || trip.locations.length === 0) return;

    if (!state.map) {
        state.map = L.map('map', {
            zoomControl: false
        }).setView(trip.mapCenter || [13.3650, 75.7500], trip.mapZoom || 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap'
        }).addTo(state.map);

        L.control.zoom({ position: 'bottomright' }).addTo(state.map);

        const mapWrapper = document.getElementById("map-wrapper");
        if (mapWrapper && !state.isLightMode) {
            mapWrapper.classList.add("dark-map");
        }
    } else {
        state.map.setView(trip.mapCenter || [13.3650, 75.7500], trip.mapZoom || 11);
    }

    // Clear existing markers
    Object.values(state.markers).forEach(m => m.marker.remove());
    state.markers = {};

    // Add trip locations
    trip.locations.forEach((loc, index) => {
        const iconHtml = `
            <div class="custom-map-pin ${loc.color || 'pin-emerald'}">
                <i class="fa-solid ${loc.icon || 'fa-location-dot'} text-xs"></i>
                <span class="pin-badge">${loc.day || index + 1}</span>
            </div>
        `;

        const customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -22]
        });

        const popupContent = `
            <div class="p-3.5 bg-slate-900 text-slate-100 rounded-xl">
                <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-[10px] font-mono uppercase font-bold text-amber-400">Day ${loc.day} • ${loc.time || ''}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">${loc.category}</span>
                </div>
                <h6 class="font-extrabold text-sm text-white mb-1 leading-snug">${loc.name}</h6>
                <p class="text-xs text-slate-300 leading-relaxed mb-3">${loc.desc}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${loc.coords[0]},${loc.coords[1]}" target="_blank" 
                   class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all">
                    <i class="fa-solid fa-diamond-turn-right"></i> Open Navigation in Google Maps
                </a>
            </div>
        `;

        const marker = L.marker(loc.coords, { icon: customIcon })
            .bindPopup(popupContent)
            .addTo(state.map);

        state.markers[loc.id] = {
            marker: marker,
            day: loc.day
        };
    });
}

function focusLocationOnMap(locationId) {
    if (!state.map || !state.markers[locationId]) return;
    const markerData = state.markers[locationId];
    const marker = markerData.marker;
    
    state.map.flyTo(marker.getLatLng(), 14, {
        animate: true,
        duration: 0.8
    });
    
    setTimeout(() => {
        marker.openPopup();
    }, 850);

    // Scroll to event card if on mobile
    const card = document.getElementById(`event-card-${locationId}`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => card.classList.remove('ring-2', 'ring-amber-400'), 1500);
    }
}

/* =========================================================================
   ADD NEW TRIP ENGINE
   ========================================================================= */

function openAddTripModal() {
    const modal = document.getElementById("add-trip-modal");
    if (modal) modal.classList.remove("hidden");
}

function closeAddTripModal() {
    const modal = document.getElementById("add-trip-modal");
    if (modal) modal.classList.add("hidden");
}

function handleSaveNewTrip(e) {
    e.preventDefault();
    const title = document.getElementById("new-trip-title").value;
    const dest = document.getElementById("new-trip-dest").value;
    const flag = document.getElementById("new-trip-flag").value || "✈️";
    const dates = document.getElementById("new-trip-dates").value;
    const travelers = document.getElementById("new-trip-travelers").value || "Travelers";
    const status = document.getElementById("new-trip-status").value || "upcoming";
    const summary = document.getElementById("new-trip-summary").value;

    const newTripId = `trip-${Date.now()}`;
    const newTrip = {
        id: newTripId,
        title: title,
        destination: dest,
        flag: flag,
        status: status,
        dates: dates,
        travelers: travelers,
        heroGradient: "from-indigo-900 via-slate-900 to-teal-950",
        accentColor: "#3b82f6",
        badge: "Custom Trip",
        summary: summary || "Personal curated itinerary and travel plan.",
        basecamp: {
            name: "Stay & Accommodations",
            location: dest,
            distanceFromStation: "Central Location",
            checkIn: "12:00 PM",
            checkOut: "11:00 AM",
            arrivalStrategy: "Check in or drop bags at hotel cloakroom.",
            diningNote: "Local cafes and restaurants.",
            coords: [12.9716, 77.5946]
        },
        transportPlan: [
            { day: "All Days", mode: "Flight / Cab / Local Transport", icon: "fa-plane", timing: "As per schedule", purpose: "Exploring local highlights." }
        ],
        mapCenter: [12.9716, 77.5946],
        mapZoom: 12,
        locations: [
            { id: "loc-base", name: dest, category: "stay", coords: [12.9716, 77.5946], desc: "Trip destination", day: 1, time: "Day 1", icon: "fa-hotel", color: "pin-rose" }
        ],
        itinerary: [
            {
                dayNumber: 1,
                date: dates,
                title: "Day 1 Highlights",
                highlight: "Arrival & City Tour",
                transportBadge: "Cab / Transit",
                events: [
                    { time: "10:00 AM", title: "Arrival & Check-in", category: "logistics", desc: "Arrive at destination and settle in.", tip: "Keep offline map ready.", badge: "Arrival" }
                ]
            }
        ],
        packingList: [
            { id: `pk-${Date.now()}-1`, item: "ID / Passport / Tickets", category: "Documents", checked: false },
            { id: `pk-${Date.now()}-2`, item: "Comfortable footwear", category: "Clothing", checked: false }
        ]
    };

    state.trips.unshift(newTrip);
    saveTripsToStorage(state.trips);
    closeAddTripModal();
    setViewMode("trip", newTripId);
}

function deleteCustomTrip(tripId) {
    if (!confirm("Are you sure you want to delete this trip from your hub?")) return;
    state.trips = state.trips.filter(t => t.id !== tripId);
    saveTripsToStorage(state.trips);
    setViewMode("catalog");
}

function exportTripsJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.trips, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trips_architect_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importTripsJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed)) {
                    state.trips = parsed;
                    saveTripsToStorage(state.trips);
                    alert("Successfully imported your trips database!");
                    renderApp();
                } else {
                    alert("Invalid JSON format. Expected an array of trip objects.");
                }
            } catch (err) {
                alert("Error reading JSON file: " + err.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

/* Driver Address Card Modal */
function openDriverModal() {
    const trip = state.trips.find(t => t.id === state.activeTripId);
    if (!trip || !trip.basecamp) return;

    const modal = document.getElementById("driver-address-modal");
    const content = document.getElementById("driver-address-content");
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="text-center mb-4">
            <span class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mx-auto mb-2 border border-amber-500/30">
                <i class="fa-solid fa-taxi"></i>
            </span>
            <h4 class="text-base font-extrabold text-white">Show This to Auto / Cab Driver</h4>
            <p class="text-xs text-slate-400">Hotel address with landmark and local Kannada translation</p>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
            <span class="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Kannada Script</span>
            <div class="text-base font-bold text-emerald-300 leading-relaxed font-sans mb-3">
                ${trip.basecamp.addressKannada || trip.basecamp.name}
            </div>
            <span class="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">English Landmark</span>
            <div class="text-xs font-semibold text-slate-200">
                ${trip.basecamp.location}
            </div>
            <div class="text-[11px] text-amber-400 mt-1">
                ${trip.basecamp.distanceFromStation}
            </div>
        </div>

        <a href="https://www.google.com/maps/search/?api=1&query=${trip.basecamp.coords[0]},${trip.basecamp.coords[1]}" 
           target="_blank" 
           class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
            <i class="fa-solid fa-diamond-turn-right"></i> Open Navigation in Google Maps
        </a>
    `;
    modal.classList.remove("hidden");
}

function closeDriverModal() {
    const modal = document.getElementById("driver-address-modal");
    if (modal) modal.classList.add("hidden");
}

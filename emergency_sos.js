/**
 * Personal Travel Architect — Universal Emergency SOS & Medical ICE Vault
 * 100% Offline, Zero Dependencies.
 * Instant 1-tap dialer, hospital coordinates, insurance TPA hotlines, and embassy contacts.
 */

(function() {
    function injectEmergencyModal() {
        if (document.getElementById("emergency-sos-modal")) return;

        const isVietnam = window.location.pathname.includes("vietnam");
        const defaultTab = isVietnam ? "vietnam" : "india";

        const modal = document.createElement("div");
        modal.id = "emergency-sos-modal";
        modal.className = "fixed inset-0 z-[99998] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 hidden";
        modal.innerHTML = `
            <div class="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4 text-xs">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg border border-rose-500/30">
                            <i class="fa-solid fa-truck-medical"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-black text-white font-display">Emergency SOS & Medical ICE Vault</h3>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">24x7</span>
                            </div>
                            <p class="text-[11px] text-slate-400">1-Tap Dialing, Nearest Verified Hospitals, Insurance & Consular Hotlines</p>
                        </div>
                    </div>
                    <button onclick="window.closeEmergencySosModal()" class="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Region Selector Tabs -->
                <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-center font-bold text-[11px]">
                    <button type="button" id="sos-tab-btn-india" onclick="window.switchSosTab('india')" class="py-2 rounded-lg ${defaultTab === 'india' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'} transition-colors">
                        🇮🇳 India Domestic
                    </button>
                    <button type="button" id="sos-tab-btn-vietnam" onclick="window.switchSosTab('vietnam')" class="py-2 rounded-lg ${defaultTab === 'vietnam' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'} transition-colors">
                        🇻🇳 Vietnam Intl
                    </button>
                    <button type="button" id="sos-tab-btn-insurance" onclick="window.switchSosTab('insurance')" class="py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                        🛡️ Insurance & ICE
                    </button>
                </div>

                <!-- Tab 1: India Domestic (Chikmagalur / National) -->
                <div id="sos-tab-india" class="${defaultTab === 'india' ? '' : 'hidden'} space-y-3.5">
                    <!-- 1-Tap Dial Grid -->
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">1-Tap Emergency Hotlines</span>
                        <div class="grid grid-cols-2 gap-2">
                            <a href="tel:112" class="p-3 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 rounded-xl flex items-center justify-between text-rose-300 font-bold transition-all">
                                <div class="flex items-center gap-2">
                                    <i class="fa-solid fa-phone-volume text-rose-400 text-base"></i>
                                    <div>
                                        <span class="block text-white text-sm">112</span>
                                        <span class="text-[10px] text-slate-400">National All-in-One</span>
                                    </div>
                                </div>
                                <span class="text-[10px] bg-rose-600/40 px-2 py-0.5 rounded text-white font-bold">DIAL</span>
                            </a>
                            <a href="tel:108" class="p-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 rounded-xl flex items-center justify-between text-amber-300 font-bold transition-all">
                                <div class="flex items-center gap-2">
                                    <i class="fa-solid fa-ambulance text-amber-400 text-base"></i>
                                    <div>
                                        <span class="block text-white text-sm">108</span>
                                        <span class="text-[10px] text-slate-400">Free Ambulance</span>
                                    </div>
                                </div>
                                <span class="text-[10px] bg-amber-600/40 px-2 py-0.5 rounded text-white font-bold">DIAL</span>
                            </a>
                        </div>
                    </div>

                    <!-- Chikmagalur Verified Medical Facilities -->
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Chikmagalur Nearest Hospitals & 24x7 Pharmacy</span>
                        <div class="space-y-2">
                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-white text-xs block">Malnad Hospital & Rotary Blood Bank</strong>
                                    <span class="text-[11px] text-slate-400 block">MG Road, Chikmagalur • ICU & 24x7 Casualty</span>
                                    <span class="text-[10px] text-emerald-400 font-mono">Phone: +91 8262 235555</span>
                                </div>
                                <a href="tel:+918262235555" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1">
                                    <i class="fa-solid fa-phone"></i> Call
                                </a>
                            </div>

                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-white text-xs block">District Government Hospital Chikmagalur</strong>
                                    <span class="text-[11px] text-slate-400 block">Mallandur Road, Chikmagalur • Trauma Center</span>
                                    <span class="text-[10px] text-emerald-400 font-mono">Phone: +91 8262 230211</span>
                                </div>
                                <a href="tel:+918262230211" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1">
                                    <i class="fa-solid fa-phone"></i> Call
                                </a>
                            </div>

                            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-amber-300 text-xs block">24x7 Apollo Pharmacy (Near Tresca Hotel)</strong>
                                    <span class="text-[11px] text-slate-400">RG Road, 250m walking distance from Tresca Hotel</span>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">24 Hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 2: Vietnam International -->
                <div id="sos-tab-vietnam" class="${defaultTab === 'vietnam' ? '' : 'hidden'} space-y-3.5">
                    <!-- 1-Tap Dial Grid -->
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Vietnam 1-Tap Emergency Hotlines</span>
                        <div class="grid grid-cols-3 gap-2">
                            <a href="tel:113" class="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center block">
                                <span class="text-rose-400 text-base font-black block">113</span>
                                <span class="text-[10px] text-slate-400">Police</span>
                            </a>
                            <a href="tel:115" class="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center block">
                                <span class="text-amber-400 text-base font-black block">115</span>
                                <span class="text-[10px] text-slate-400">Ambulance</span>
                            </a>
                            <a href="tel:114" class="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center block">
                                <span class="text-blue-400 text-base font-black block">114</span>
                                <span class="text-[10px] text-slate-400">Fire / Rescue</span>
                            </a>
                        </div>
                    </div>

                    <!-- Indian Embassy in Vietnam -->
                    <div class="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/40 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="font-extrabold text-indigo-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-building-flag"></i> Embassy of India (Hanoi)
                            </span>
                            <span class="text-[10px] text-slate-400">Hoan Kiem District</span>
                        </div>
                        <p class="text-[11px] text-slate-300">58-60 Tran Hung Dao, Hoan Kiem, Hanoi</p>
                        <div class="flex items-center justify-between pt-1">
                            <span class="text-[10px] font-mono text-emerald-400">Emergency: +84 90 411 9694</span>
                            <a href="tel:+84904119694" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px]">
                                Call Consular SOS
                            </a>
                        </div>
                    </div>

                    <!-- Vietnam Top International Hospitals -->
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Verified International JCI Hospitals (English-Speaking)</span>
                        <div class="space-y-2">
                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-white text-xs block">Hanoi French Hospital (Bệnh viện Việt Pháp)</strong>
                                    <span class="text-[11px] text-slate-400 block">1 Phuong Mai, Dong Da, Hanoi • 24/7 ER</span>
                                    <span class="text-[10px] text-emerald-400 font-mono">+84 24 3577 1100</span>
                                </div>
                                <a href="tel:+842435771100" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">
                                    Call ER
                                </a>
                            </div>

                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-white text-xs block">Vinmec International Hospital (Times City Hanoi)</strong>
                                    <span class="text-[11px] text-slate-400 block">458 Minh Khai, Hai Ba Trung, Hanoi</span>
                                    <span class="text-[10px] text-emerald-400 font-mono">+84 24 3974 3556</span>
                                </div>
                                <a href="tel:+842439743556" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">
                                    Call ER
                                </a>
                            </div>

                            <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                                <div>
                                    <strong class="text-white text-xs block">Vinmec Danang International Hospital</strong>
                                    <span class="text-[11px] text-slate-400 block">30 Thang 4, Hai Chau, Da Nang (Near Hoi An)</span>
                                    <span class="text-[10px] text-emerald-400 font-mono">+84 236 3711 111</span>
                                </div>
                                <a href="tel:+842363711111" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]">
                                    Call ER
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab 3: Insurance & Medical ICE -->
                <div id="sos-tab-insurance" class="hidden space-y-3.5">
                    <!-- Travel Insurance Card -->
                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-black text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-shield-halved"></i> Group Travel Insurance Policy
                            </span>
                            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">Active</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span class="text-[10px] text-slate-400 block">Policy / Certificate No:</span>
                                <strong class="text-white font-mono text-[11px]">BAGIC-TRV-89402174</strong>
                            </div>
                            <div class="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <span class="text-[10px] text-slate-400 block">Emergency TPA Helpline:</span>
                                <strong class="text-emerald-400 font-mono text-[11px]">+91 124 617 4700</strong>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 leading-relaxed">
                            <strong class="text-slate-200">Cashless Hospitalization Rule:</strong> In case of medical emergency, notify TPA assistance within 24 hours of admission. Keep passport photocopy, visa, and hospital admission receipt ready.
                        </p>
                    </div>

                    <!-- Traveler Blood Groups & ICE Contacts -->
                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <span class="text-xs font-black text-white block">Medical ICE (In Case of Emergency)</span>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                                <span class="text-slate-200">Delhi Parents (Senior Travelers):</span>
                                <span class="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">Blood Groups: B+ & O+</span>
                            </div>
                            <div class="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                                <span class="text-slate-200">Bengaluru Group (Adults):</span>
                                <span class="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">Blood Groups: A+, O+, B+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Close Button -->
                <div class="pt-2 border-t border-slate-800 flex justify-end">
                    <button type="button" onclick="window.closeEmergencySosModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors">
                        Close SOS Vault
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    window.openEmergencySosModal = function(preferredTab) {
        injectEmergencyModal();
        if (preferredTab) window.switchSosTab(preferredTab);
        const modal = document.getElementById("emergency-sos-modal");
        if (modal) modal.classList.remove("hidden");
    };

    window.closeEmergencySosModal = function() {
        const modal = document.getElementById("emergency-sos-modal");
        if (modal) modal.classList.add("hidden");
    };

    window.switchSosTab = function(tab) {
        ["india", "vietnam", "insurance"].forEach(t => {
            const content = document.getElementById("sos-tab-" + t);
            const btn = document.getElementById("sos-tab-btn-" + t);
            if (content && btn) {
                if (t === tab) {
                    content.classList.remove("hidden");
                    btn.className = (t === "vietnam") ? "py-2 rounded-lg bg-rose-600 text-white font-bold transition-colors" :
                                    (t === "india") ? "py-2 rounded-lg bg-emerald-600 text-white font-bold transition-colors" :
                                    "py-2 rounded-lg bg-indigo-600 text-white font-bold transition-colors";
                } else {
                    content.classList.add("hidden");
                    btn.className = "py-2 rounded-lg text-slate-400 hover:text-white transition-colors";
                }
            }
        });
    };

    if (document.body) {
        injectEmergencyModal();
    } else {
        document.addEventListener("DOMContentLoaded", injectEmergencyModal);
    }
})();

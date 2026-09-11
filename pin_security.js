/**
 * Personal Travel Architect — Client-Side PIN Code Security Lock
 * Lightweight (~5 KB), 100% Offline, Zero Dependencies.
 * Protects sensitive flight PNRs, hotel bookings, and travel dates.
 */

(function() {
    const DEFAULT_PIN_HASH = "158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab"; // SHA-256 for "2026"
    let enteredPin = "";
    let autoLockTimer = null;
    const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

    async function sha256(str) {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    function isUnlocked() {
        return sessionStorage.getItem("travel_architect_unlocked") === "true";
    }

    function isSecurityEnabled() {
        return localStorage.getItem("travel_architect_security_enabled") !== "false";
    }

    function getCurrentPinHash() {
        return localStorage.getItem("travel_architect_custom_pin_hash") || DEFAULT_PIN_HASH;
    }

    function injectLockOverlay() {
        if (document.getElementById("vault-security-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "vault-security-overlay";
        overlay.className = "fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 transition-opacity duration-300";
        overlay.innerHTML = `
            <div class="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm p-7 shadow-2xl text-center space-y-6 relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <!-- Shield Badge -->
                <div class="flex flex-col items-center gap-2">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-white font-display tracking-tight">Travel Architect Vault</h2>
                        <p class="text-xs text-slate-400 mt-0.5">Enter 4-digit PIN to access private travel data</p>
                    </div>
                </div>

                <!-- Visual PIN Dots -->
                <div class="flex justify-center items-center gap-3.5 py-1" id="vault-pin-dots">
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-600 transition-all duration-150" data-idx="0"></div>
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-600 transition-all duration-150" data-idx="1"></div>
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-600 transition-all duration-150" data-idx="2"></div>
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-slate-600 transition-all duration-150" data-idx="3"></div>
                </div>

                <!-- Error Message -->
                <div id="vault-pin-error" class="text-xs text-rose-400 font-bold min-h-[18px] transition-opacity"></div>

                <!-- Virtual Numpad Grid -->
                <div class="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
                        <button type="button" onclick="window.vaultSecurity.handleDigit(${num})" class="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-lg shadow active:scale-95 transition-all border border-slate-700/60 focus:outline-none select-none">
                            ${num}
                        </button>
                    `).join("")}
                    <button type="button" onclick="window.vaultSecurity.clearDigits()" class="h-12 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 font-bold text-xs active:scale-95 transition-all border border-slate-800 focus:outline-none select-none">
                        Clear
                    </button>
                    <button type="button" onclick="window.vaultSecurity.handleDigit(0)" class="h-12 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-lg shadow active:scale-95 transition-all border border-slate-700/60 focus:outline-none select-none">
                        0
                    </button>
                    <button type="button" onclick="window.vaultSecurity.backspace()" class="h-12 rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-bold text-sm active:scale-95 transition-all border border-slate-800 focus:outline-none select-none">
                        <i class="fa-solid fa-delete-left"></i>
                    </button>
                </div>

                <!-- Quick Hint & Unlock Controls -->
                <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <button type="button" onclick="window.vaultSecurity.showDefaultHint()" class="hover:text-amber-400 transition-colors">
                        <i class="fa-regular fa-lightbulb mr-1"></i> Default PIN hint
                    </button>
                    <button type="button" onclick="window.vaultSecurity.openSettings()" class="hover:text-emerald-400 transition-colors">
                        <i class="fa-solid fa-gear mr-1"></i> Settings
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        updatePinDots();
    }

    function removeLockOverlay() {
        const overlay = document.getElementById("vault-security-overlay");
        if (overlay) {
            overlay.classList.add("opacity-0");
            setTimeout(() => overlay.remove(), 250);
        }
    }

    function updatePinDots() {
        const dots = document.querySelectorAll("#vault-pin-dots div");
        dots.forEach((dot, idx) => {
            if (idx < enteredPin.length) {
                dot.className = "w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)] scale-110 transition-all duration-150";
            } else {
                dot.className = "w-3.5 h-3.5 rounded-full border-2 border-slate-600 transition-all duration-150";
            }
        });
    }

    async function evaluatePin() {
        const errorEl = document.getElementById("vault-pin-error");
        const currentHash = getCurrentPinHash();
        const enteredHash = await sha256(enteredPin);

        if (enteredHash === currentHash) {
            if (errorEl) errorEl.textContent = "";
            sessionStorage.setItem("travel_architect_unlocked", "true");
            removeLockOverlay();
            resetInactivityTimer();
            window.dispatchEvent(new CustomEvent("vault-unlocked"));
        } else {
            if (errorEl) {
                errorEl.textContent = "Incorrect PIN. Try again.";
                const card = document.querySelector("#vault-security-overlay > div");
                if (card) {
                    card.classList.add("animate-shake");
                    setTimeout(() => card.classList.remove("animate-shake"), 500);
                }
            }
            setTimeout(() => {
                enteredPin = "";
                updatePinDots();
            }, 400);
        }
    }

    function handleDigit(d) {
        if (enteredPin.length < 4) {
            enteredPin += d;
            updatePinDots();
            if (enteredPin.length === 4) {
                evaluatePin();
            }
        }
    }

    function backspace() {
        if (enteredPin.length > 0) {
            enteredPin = enteredPin.slice(0, -1);
            updatePinDots();
            const errorEl = document.getElementById("vault-pin-error");
            if (errorEl) errorEl.textContent = "";
        }
    }

    function clearDigits() {
        enteredPin = "";
        updatePinDots();
        const errorEl = document.getElementById("vault-pin-error");
        if (errorEl) errorEl.textContent = "";
    }

    function lock() {
        sessionStorage.removeItem("travel_architect_unlocked");
        enteredPin = "";
        injectLockOverlay();
    }

    function resetInactivityTimer() {
        if (autoLockTimer) clearTimeout(autoLockTimer);
        autoLockTimer = setTimeout(() => {
            if (isSecurityEnabled() && isUnlocked()) {
                console.log("Vault auto-locked due to 20 mins inactivity");
                lock();
            }
        }, INACTIVITY_TIMEOUT_MS);
    }

    // Keyboard listener for desktop use
    window.addEventListener("keydown", (e) => {
        const overlay = document.getElementById("vault-security-overlay");
        if (!overlay) return;

        if (e.key >= "0" && e.key <= "9") {
            handleDigit(e.key);
        } else if (e.key === "Backspace") {
            backspace();
        } else if (e.key === "Escape") {
            clearDigits();
        }
    });

    ["mousemove", "keydown", "touchstart", "scroll"].forEach(evt => {
        window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });

    function init() {
        if (isSecurityEnabled() && !isUnlocked()) {
            if (document.body) {
                injectLockOverlay();
            } else {
                document.addEventListener("DOMContentLoaded", injectLockOverlay);
            }
        }
    }

    // Exported controller API
    window.vaultSecurity = {
        lock,
        handleDigit,
        backspace,
        clearDigits,
        isUnlocked,
        showDefaultHint: () => {
            const errorEl = document.getElementById("vault-pin-error");
            if (errorEl) errorEl.textContent = "Hint: Default master PIN is 2026";
        },
        openSettings: () => {
            const currentPin = prompt("Enter your CURRENT 4-digit PIN to access Security Settings:");
            if (!currentPin) return;
            sha256(currentPin).then(enteredHash => {
                if (enteredHash !== getCurrentPinHash()) {
                    alert("Incorrect current PIN. Security settings access denied.");
                    return;
                }
                const newPin = prompt("Enter your NEW 4-digit security PIN:");
                if (!newPin || newPin.length !== 4 || isNaN(newPin)) {
                    alert("PIN must be exactly 4 digits. PIN was not changed.");
                    return;
                }
                const confirmPin = prompt("Confirm your NEW 4-digit PIN:");
                if (newPin !== confirmPin) {
                    alert("PINs do not match. PIN was not changed.");
                    return;
                }
                sha256(newPin).then(newHash => {
                    localStorage.setItem("travel_architect_custom_pin_hash", newHash);
                    alert("PIN successfully changed! Remember your new PIN: " + newPin);
                });
            });
        }
    };

    init();
})();

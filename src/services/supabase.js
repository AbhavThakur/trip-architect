import { createClient } from "@supabase/supabase-js";

const STORAGE_URL_KEY = "travel_architect_supabase_url";
const STORAGE_KEY_KEY = "travel_architect_supabase_key";
const STORAGE_ENABLED_KEY = "travel_architect_supabase_enabled";

let supabaseClient = null;

// Best Practice Helper: clean URLs that accidentally include /rest/v1 or trailing slashes
export function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl) return "";
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function getSupabaseConfig() {
  const rawUrl = localStorage.getItem(STORAGE_URL_KEY) || import.meta.env?.VITE_SUPABASE_URL || "";
  const key = localStorage.getItem(STORAGE_KEY_KEY) || 
    import.meta.env?.VITE_SUPABASE_ANON_KEY || 
    import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || 
    "";
  
  const url = cleanSupabaseUrl(rawUrl);
  const enabled = localStorage.getItem(STORAGE_ENABLED_KEY) !== "false" && !!(url && key);

  // Best Practice Validation check: Warn if a secret key is exposed in browser
  if (key && (key.startsWith("sb_secret_") || key.includes("service_role"))) {
    console.error(
      "[Supabase Security Alert] A SECRET / service_role key was provided in client code! " +
      "According to Supabase documentation, secret keys bypass Row Level Security and must NEVER be used in frontend browsers. " +
      "Please switch to your Publishable ('sb_publishable_...') or Anon key."
    );
  }

  return { url, key, enabled };
}

export function setSupabaseConfig(url, key, enabled = true) {
  const cleanedUrl = cleanSupabaseUrl(url);
  if (cleanedUrl) localStorage.setItem(STORAGE_URL_KEY, cleanedUrl);
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);

  localStorage.setItem(STORAGE_ENABLED_KEY, enabled ? "true" : "false");
  supabaseClient = null; // reset client
}

export function getClient() {
  if (supabaseClient) return supabaseClient;
  const { url, key, enabled } = getSupabaseConfig();
  if (!enabled || !url || !key) return null;
  try {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    return supabaseClient;
  } catch (err) {
    console.warn("Supabase client initialization error:", err);
    return null;
  }
}

export async function testSupabaseConnection(testUrl, testKey) {
  try {
    const cleanedUrl = cleanSupabaseUrl(testUrl);
    if (!cleanedUrl || !testKey) {
      return { success: false, error: "Please enter both Project URL and API Key." };
    }

    if (testKey.trim().startsWith("sb_secret_")) {
      return {
        success: false,
        error: "Security Warning: You entered a Secret Key (sb_secret_...). Supabase blocks secret keys in browsers. Please use your Publishable key (sb_publishable_...) or Anon key."
      };
    }

    const client = createClient(cleanedUrl, testKey.trim());
    const { data, error } = await client.from("trips").select("id").limit(1);
    if (error) {
      if (error.code === "42P01") {
        return { 
          success: false, 
          code: "TABLE_NOT_FOUND", 
          error: "Connected to project, but 'trips' table does not exist. Run the SQL migration script from SUPABASE_SETUP_GUIDE.md." 
        };
      }
      const msg = error.message || "";
      if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("NetworkError")) {
        return {
          success: false,
          code: "PROJECT_PAUSED",
          error: "Supabase Project is Unreachable or Paused. Free-tier projects pause after 7 days of inactivity. Click below to unpause it on your Supabase dashboard."
        };
      }
      return { success: false, error: error.message };
    }
    return { success: true, count: data ? data.length : 0 };
  } catch (err) {
    const msg = err?.message || String(err);
    if (msg.includes("fetch failed") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("NetworkError")) {
      return {
        success: false,
        code: "PROJECT_PAUSED",
        error: "Supabase Project is Unreachable or Paused. Free-tier projects pause after 7 days of inactivity. Click the link below to restore it from your Supabase dashboard."
      };
    }
    return { success: false, error: err.message };
  }
}

export async function fetchTripFromCloud(tripId, fallbackData) {
  // If running locally, check local dev server API first (isolated testing mode)
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    try {
      const devRes = await fetch(`/api/trips/${encodeURIComponent(tripId)}`);
      if (devRes.ok) {
        const row = await devRes.json();
        const devTrip = row.data || row;
        if (devTrip && (devTrip.budget || devTrip.title)) {
          const merged = { ...fallbackData, ...devTrip };
          localStorage.setItem("cached_trip_" + tripId, JSON.stringify(merged));
          return { data: merged, source: "localhost_dev", updatedAt: row.updated_at };
        }
      }
    } catch (e) {
      console.warn("Local dev API fetch failed, falling back:", e);
    }
  }
  const cacheKey = "cached_trip_" + tripId;
  const client = getClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("trips")
        .select("data, updated_at")
        .eq("id", tripId)
        .maybeSingle();

      if (!error && data && data.data) {
        const cloudTrip = data.data;
        // Check if cloud data is outdated compared to updated fallback blueprint
        const isCloudStale = fallbackData && (
          cloudTrip.dates !== fallbackData.dates ||
          cloudTrip.daysCount !== fallbackData.daysCount ||
          cloudTrip.itinerary?.[0]?.title !== fallbackData.itinerary?.[0]?.title
        );

        if (isCloudStale) {
          console.log("Cloud trip is stale compared to latest blueprint. Updating Supabase...");
          await saveTripToCloud(tripId, fallbackData);
          localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
          return { data: fallbackData, source: "cloud_resynced" };
        }

        const mergedTickets = Array.isArray(cloudTrip.tickets)
          ? [
              ...(fallbackData?.tickets || []).filter((ft) => !cloudTrip.tickets.some((ct) => ct.id === ft.id)),
              ...cloudTrip.tickets
            ]
          : fallbackData?.tickets || [];

        const syncedTrip = {
          ...fallbackData,
          ...cloudTrip,
          tickets: mergedTickets
        };

        localStorage.setItem(cacheKey, JSON.stringify(syncedTrip));
        return { data: syncedTrip, source: "cloud", updatedAt: data.updated_at };
      }
    } catch (e) {
      console.warn("Cloud fetch failed, falling back to local cache:", e);
    }
  }

  // Local fallback with stale cache detection
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Validate that cached blueprint matches current dates and day count
      const isDatesMatch = !fallbackData?.dates || parsed.dates === fallbackData.dates;
      const isDaysMatch = !fallbackData?.daysCount || parsed.daysCount === fallbackData.daysCount;
      const hasBudget = !!parsed.budget;
      const isItineraryLenMatch = !fallbackData?.itinerary || (parsed.itinerary && parsed.itinerary.length === fallbackData.itinerary.length);
      const isChecklistValid = !fallbackData?.checklist || (
        Array.isArray(parsed.checklist) &&
        parsed.checklist.length === fallbackData.checklist.length &&
        parsed.checklist[0]?.items
      );

      if (isDatesMatch && isDaysMatch && hasBudget && isItineraryLenMatch && isChecklistValid) {
        const mergedTickets = Array.isArray(parsed.tickets)
          ? [
              ...(fallbackData?.tickets || []).filter((ft) => !parsed.tickets.some((pt) => pt.id === ft.id)),
              ...parsed.tickets
            ]
          : fallbackData?.tickets || [];

        return { 
          data: { 
            ...fallbackData, 
            ...parsed,
            tickets: mergedTickets
          }, 
          source: "cache" 
        };
      } else {
        // Cache is stale compared to fresh blueprint; update localStorage with new blueprint
        localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
        return { data: fallbackData, source: "static" };
      }
    }
  } catch (e) {}

  return { data: fallbackData, source: "static" };
}

export async function saveTripToCloud(tripId, tripData) {
  const cacheKey = "cached_trip_" + tripId;
  // Always update local cache first
  try {
    localStorage.setItem(cacheKey, JSON.stringify(tripData));
  } catch (e) {}

  // If in local dev environment, also save to local dev endpoint for isolated local testing
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    try {
      await fetch(`/api/trips/${encodeURIComponent(tripId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tripId, data: tripData })
      });
    } catch (err) {
      console.warn("Local dev post error:", err);
    }
  }

  const client = getClient();
  if (!client) {
    return { success: true, source: "local_only" };
  }

  try {
    const { error } = await client.from("trips").upsert(
      {
        id: tripId,
        data: tripData,
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("Supabase upsert error:", error);
      return { success: false, error: error.message, source: "local_saved" };
    }
    return { success: true, source: "cloud_saved" };
  } catch (e) {
    return { success: false, error: e.message, source: "local_saved" };
  }
}

export async function pullAllTripsFromCloud() {
  const client = getClient();
  if (!client) throw new Error("Supabase is not connected. Configure credentials first.");

  const { data, error } = await client.from("trips").select("id, data, updated_at");
  if (error) throw error;
  if (!data || data.length === 0) return { success: true, count: 0, trips: [] };

  const trips = [];
  data.forEach((row) => {
    if (row.data) {
      const trip = row.data;
      const cacheKey = "cached_trip_" + (row.id || trip.id);
      localStorage.setItem(cacheKey, JSON.stringify(trip));
      trips.push(trip);
    }
  });

  return { success: true, count: trips.length, trips };
}

export function exportAllTripsBackup(trips = []) {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    app: "Trip Architect",
    tripsCount: trips.length,
    trips: trips
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `travel_architect_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

export async function importTripsBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const trips = Array.isArray(parsed) ? parsed : (parsed.trips || []);
        if (!trips || trips.length === 0) {
          throw new Error("No valid trips found in backup file.");
        }
        trips.forEach((trip) => {
          if (trip.id) {
            localStorage.setItem("cached_trip_" + trip.id, JSON.stringify(trip));
          }
        });
        resolve({ count: trips.length, trips });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export async function pushAllTripsToCloud(allTrips) {
  const client = getClient();
  if (!client) throw new Error("Supabase is not connected. Configure credentials first.");

  const payload = allTrips.map(t => ({
    id: t.id,
    data: t,
    updated_at: new Date().toISOString()
  }));

  const { error } = await client.from("trips").upsert(payload, { onConflict: "id" });
  if (error) throw error;
  return { success: true, count: payload.length };
}

export function subscribeToTripUpdates(tripId, onUpdate) {
  const client = getClient();
  if (!client) return () => {};

  const channel = client
    .channel("public:trips:" + tripId)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "trips", filter: "id=eq." + tripId },
      (payload) => {
        if (payload.new && payload.new.data) {
          localStorage.setItem("cached_trip_" + tripId, JSON.stringify(payload.new.data));
          onUpdate(payload.new.data);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

// Supabase Storage helpers for PDF tickets & boarding passes
export async function uploadTicketPdf(tripId, file) {
  const client = getClient();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${tripId}/${Date.now()}_${cleanName}`;

  if (client) {
    try {
      const { data, error } = await client.storage
        .from("tickets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (!error && data) {
        const { data: urlData } = client.storage.from("tickets").getPublicUrl(filePath);
        return {
          id: "ticket_" + Date.now(),
          name: file.name,
          path: filePath,
          url: urlData.publicUrl,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          source: "supabase"
        };
      }
    } catch (err) {
      console.warn("Supabase storage upload failed, falling back to local offline storage:", err);
    }
  }

  // Local fallback (Base64 data URL for offline storage)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: "ticket_" + Date.now(),
        name: file.name,
        path: filePath,
        url: reader.result,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        source: "local"
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function deleteTicketPdf(filePath) {
  const client = getClient();
  if (!client || !filePath) return { success: true };
  try {
    const { error } = await client.storage.from("tickets").remove([filePath]);
    if (error) console.warn("Supabase storage remove error:", error);
    return { success: !error };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

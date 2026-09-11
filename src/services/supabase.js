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
      return { success: false, error: error.message };
    }
    return { success: true, count: data ? data.length : 0 };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function fetchTripFromCloud(tripId, fallbackData) {
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
        localStorage.setItem(cacheKey, JSON.stringify(data.data));
        return { data: data.data, source: "cloud", updatedAt: data.updated_at };
      }
    } catch (e) {
      console.warn("Cloud fetch failed, falling back to local cache:", e);
    }
  }

  // Local fallback
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return { data: JSON.parse(cached), source: "cache" };
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

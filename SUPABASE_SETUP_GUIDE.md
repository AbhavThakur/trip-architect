# Supabase Cloud Database Setup Guide for Travel Architect

This guide walks you through setting up a **100% free, permanent Supabase database** to store, edit, and automatically sync your trip data across your laptop, phone, and family members in real-time.

---

## ⏱️ Quick Summary (Takes ~3 Minutes)
1. **Create free account** at [supabase.com](https://supabase.com).
2. **Run 1 SQL command** in Supabase SQL Editor.
3. **Copy your URL and Anon Key** into the app via the `[☁️ Cloud]` button.
4. Click **"Upload Local Trips to Supabase"** — Done!

---

## 🛠️ Step-by-Step Instructions

### Step 1: Create a Free Supabase Project
1. Go to **[https://supabase.com](https://supabase.com)** and click **"Start your project"** (Sign in with GitHub or email).
2. Click **"New project"**.
3. Fill in:
   - **Name**: `travel-architect` (or any name you like).
   - **Database Password**: Choose any strong password (or generate one).
   - **Region**: Choose the closest region to you (e.g. `South Asia (Mumbai)` or `Southeast Asia (Singapore)`).
   - **Pricing Plan**: Free ($0/month forever).
4. Click **"Create new project"** (takes ~60 seconds to provision).

---

### Step 2: Create the Database Table & PDF Storage Bucket
1. In your Supabase Dashboard, click on **"SQL Editor"** in the left sidebar (icon looks like `>_`).
2. Click **"+ New query"**.
3. Paste the following complete SQL script and click **"Run"** (green button on bottom right):

```sql
-- ==========================================
-- 1. TRIPS DATABASE TABLE (Data & Itinerary Sync)
-- ==========================================
create table if not exists public.trips (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.trips enable row level security;

-- Public read/write policy for offline-first PWA sync without login
create policy "Public trips full access" 
  on public.trips 
  for all 
  using (true) 
  with check (true);

-- Enable Realtime WebSockets for live multi-device updates
alter publication supabase_realtime add table public.trips;

-- ==========================================
-- 2. TICKETS STORAGE BUCKET (PDFs & Passes)
-- ==========================================
-- Create the public 'tickets' bucket
insert into storage.buckets (id, name, public)
values ('tickets', 'tickets', true)
on conflict (id) do update set public = true;

-- Policy: Allow anyone with the app to read uploaded ticket PDFs/images
create policy "Public read tickets"
  on storage.objects for select
  using (bucket_id = 'tickets');

-- Policy: Allow uploading tickets into the bucket
create policy "Public upload tickets"
  on storage.objects for insert
  with check (bucket_id = 'tickets');

-- Policy: Allow deleting tickets from the bucket
create policy "Public delete tickets"
  on storage.objects for delete
  using (bucket_id = 'tickets');
```

You should see `Success. No rows returned`. Your database table AND your PDF ticket storage vault are now 100% ready!

---

### Alternative: Create Storage Bucket via UI
If you prefer using the Supabase web interface instead of SQL for files:
1. Click **"Storage"** in the left sidebar.
2. Click **"New bucket"**.
3. Name: `tickets` (all lowercase, exact match).
4. Turn **ON** `Public bucket` (toggle to green).
5. Click **"Save bucket"**.

---

### Step 3: Get Your API Credentials
1. In the left sidebar of your Supabase dashboard, click the **Settings gear icon** (bottom left) &rarr; select **"API"** (or click **"Project Settings"** &rarr; **"API"**).
2. Under **Project URL**, copy the URL:
   - Example: `https://xyzabcdefghijklm.supabase.co`
3. Under **Project API keys**, copy the **`anon` / `public`** key:
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Step 4: Connect in the Travel Architect App
1. Open the Travel Architect web app on your laptop or phone.
2. In the top navigation bar, click the **`[☁️ Cloud]`** button.
3. Paste your **Project URL** and **Anon Key**.
4. Click **"Test Connection"** &rarr; you should see `🟢 Connection successful!`.
5. Click **"Save & Enable Cloud Sync"**.
6. In the modal, click **"Upload Local Trips to Supabase"** &rarr; this immediately uploads your Vietnam and Chikmagalur trips into your Supabase database!

---

## ⚡ Optional: Set Environment Variables in Code
If you deploy your app to **Vercel**, **Netlify**, or **GitHub Pages**, you can also add these as environment variables so the app is connected automatically:

In your local `.env` file (or in Vercel project settings):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🔄 How Offline Sync & Multi-Device Works
- **Offline / Flight Mode**: When traveling on flights or in remote mountain areas, the app automatically saves every change to local device storage (`localStorage`).
- **Back Online**: The moment you reconnect to Wi-Fi, changes automatically sync with Supabase.
- **Multi-Device**: Any edits made on your laptop (e.g. updating hotel details, adding budget items) will update your phone in real time via WebSockets.

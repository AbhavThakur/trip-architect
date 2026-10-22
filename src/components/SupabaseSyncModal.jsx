import React, { useState, useEffect } from "react";
import {
  Cloud, CloudOff, CheckCircle2, AlertCircle, Copy, Check,
  Database, RefreshCw, X, ShieldCheck, Download, Upload,
  ArrowDownCircle, ArrowUpCircle, FileJson, Sparkles
} from "lucide-react";
import {
  getSupabaseConfig,
  setSupabaseConfig,
  testSupabaseConnection,
  pushAllTripsToCloud,
  pullAllTripsFromCloud,
  exportAllTripsBackup,
  importTripsBackup
} from "../services/supabase";

export default function SupabaseSyncModal({ isOpen, onClose, allTrips = [], onSyncSuccess }) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const [pulling, setPulling] = useState(false);
  const [pullMessage, setPullMessage] = useState("");
  const [backupMessage, setBackupMessage] = useState("");
  const fileInputRef = React.useRef(null);

  const sqlSnippet = `-- 1. Create trips table for data sync
create table if not exists public.trips (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);
alter table public.trips enable row level security;
create policy "Public trips full access" on public.trips for all using (true) with check (true);
alter publication supabase_realtime add table public.trips;

-- 2. Create tickets storage bucket for PDF & image uploads
insert into storage.buckets (id, name, public)
values ('tickets', 'tickets', true)
on conflict (id) do update set public = true;

create policy "Public read tickets" on storage.objects for select using (bucket_id = 'tickets');
create policy "Public upload tickets" on storage.objects for insert with check (bucket_id = 'tickets');
create policy "Public delete tickets" on storage.objects for delete using (bucket_id = 'tickets');
`;

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setKey(cfg.key);
      setEnabled(cfg.enabled);
      setTestResult(null);
      setSeedMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url || !key) {
      setTestResult({ success: false, error: "Please enter both Project URL and Anon Key." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(url, key);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    setSupabaseConfig(url, key, true);
    setEnabled(true);
    if (onSyncSuccess) onSyncSuccess();
    onClose();
  };

  const handleDisable = () => {
    setSupabaseConfig(url, key, false);
    setEnabled(false);
    if (onSyncSuccess) onSyncSuccess();
    onClose();
  };

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handlePull = async () => {
    setPulling(true);
    setPullMessage("");
    try {
      setSupabaseConfig(url, key, true);
      const res = await pullAllTripsFromCloud();
      setPullMessage("Successfully pulled " + res.count + " trips from Supabase!");
      if (onSyncSuccess) onSyncSuccess();
    } catch (e) {
      setPullMessage("Pull failed: " + e.message);
    }
    setPulling(false);
  };

  const handleExportBackup = () => {
    try {
      exportAllTripsBackup(allTrips);
      setBackupMessage("Backup file downloaded successfully!");
      setTimeout(() => setBackupMessage(""), 3000);
    } catch (e) {
      setBackupMessage("Export failed: " + e.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importTripsBackup(file);
      setBackupMessage("Successfully restored " + res.count + " trips from backup!");
      if (onSyncSuccess) onSyncSuccess();
      setTimeout(() => setBackupMessage(""), 4000);
    } catch (err) {
      setBackupMessage("Import failed: " + err.message);
    }
    e.target.value = "";
  };

  const handleFillEnv = () => {
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (envUrl && envKey) {
      setUrl(envUrl);
      setKey(envKey);
    }
  };

  const hasEnvCredentials = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  const handleSeed = async () => {
    if (!allTrips || allTrips.length === 0) return;
    setSeeding(true);
    setSeedMessage("");
    try {
      setSupabaseConfig(url, key, true);
      const res = await pushAllTripsToCloud(allTrips);
      setSeedMessage("Successfully uploaded " + res.count + " trips to Supabase!");
      if (onSyncSuccess) onSyncSuccess();
    } catch (e) {
      setSeedMessage("Upload failed: " + e.message);
    }
    setSeeding(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder text-slate-900 dark:text-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-5 text-left relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkborder">
          <div className="flex items-center gap-2.5">
            <div className={"w-10 h-10 rounded-2xl flex items-center justify-center " + (enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
              {enabled ? <Cloud className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display">Supabase Cloud Sync</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {enabled ? "🟢 Active Cloud Storage & Multi-Device Sync" : "🟡 Local Offline Mode (Device Only)"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-3.5 text-xs">
          <div>
                      {hasEnvCredentials && (!url || !key) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleFillEnv}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Pre-fill from Project Environment</span>
              </button>
            </div>
          )}
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzproject.supabase.co"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Supabase Anon Public API Key</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>

          {/* Test connection result */}
          {testResult && (
            <div className={"p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 " + (
              testResult.success
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300"
                : testResult.code === "PROJECT_PAUSED"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300"
            )}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className={`w-4 h-4 ${testResult.code === "PROJECT_PAUSED" ? "text-amber-500" : "text-rose-500"} shrink-0 mt-0.5`} />
              )}
              <div className="flex-1 space-y-1.5">
                <p className="font-bold text-sm">
                  {testResult.success
                    ? "Connection successful!"
                    : testResult.code === "PROJECT_PAUSED"
                    ? "Supabase Project is Paused (Free Tier)"
                    : "Connection error"}
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  {testResult.error || "Connected to trips table successfully."}
                </p>
                {testResult.code === "PROJECT_PAUSED" && (
                  <div className="pt-1">
                    <a
                      href={`https://supabase.com/dashboard/project/${url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] || "eqciatcascbstrohqbnp"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/30 transition-all active:scale-95"
                    >
                      <span>Unpause Project on Supabase Dashboard ↗</span>
                    </a>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1.5">
                      ⏳ After clicking "Restore" in Supabase, wait ~2-3 minutes for the database to spin back up, then click "Test Connection" again.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className={"w-3.5 h-3.5 " + (testing ? "animate-spin" : "")} />
              <span>{testing ? "Testing..." : "Test Connection"}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20 ml-auto"
            >
              Save & Enable Cloud Sync
            </button>

            {enabled && (
              <button
                onClick={handleDisable}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:text-slate-400 font-bold transition-all border border-slate-200 dark:border-slate-700"
              >
                Disable
              </button>
            )}
          </div>
        </div>

        {/* Two-Way Cloud Synchronization */}
        {enabled && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              Two-Way Cloud Synchronization
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                title="Push local itineraries to Supabase cloud"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>{seeding ? "Uploading..." : `Push (${allTrips.length} Trips)`}</span>
              </button>

              <button
                onClick={handlePull}
                disabled={pulling}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                title="Pull latest itineraries from Supabase cloud"
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                <span>{pulling ? "Pulling..." : "Pull from Cloud"}</span>
              </button>
            </div>
            {seedMessage && (
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">{seedMessage}</p>
            )}
            {pullMessage && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{pullMessage}</p>
            )}
          </div>
        )}

        {/* Local Offline JSON Backup & Restore */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
              <FileJson className="w-3.5 h-3.5 text-amber-500" />
              Offline JSON Backup & Restore
            </span>
            <span className="text-[10px] text-slate-400 font-mono">No Server Needed</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Download snapshot JSON of all trips to device"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Download Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Restore snapshot JSON from file"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              <span>Restore from File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {backupMessage && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{backupMessage}</p>
          )}
        </div>

        {/* SQL Migration Accordion */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              10-Second SQL Setup in Supabase
            </span>
            <button
              onClick={copySql}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20"
            >
              {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? "Copied SQL!" : "Copy SQL"}</span>
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-slate-400 p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-[10px] font-mono overflow-x-auto select-all">
            {sqlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

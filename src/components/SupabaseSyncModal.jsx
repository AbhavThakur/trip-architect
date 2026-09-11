import React, { useState, useEffect } from "react";
import { Cloud, CloudOff, CheckCircle2, AlertCircle, Copy, Check, Database, RefreshCw, X, ShieldCheck } from "lucide-react";
import { getSupabaseConfig, setSupabaseConfig, testSupabaseConnection, pushAllTripsToCloud } from "../services/supabase";

export default function SupabaseSyncModal({ isOpen, onClose, allTrips = [], onSyncSuccess }) {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const sqlSnippet = `-- Create trips table for Travel Architect
create table if not exists trips (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security and allow read/write
alter table trips enable row level security;
create policy "Public trips full access" on trips for all using (true) with check (true);
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
            <div className={"p-3 rounded-xl border text-xs flex items-start gap-2 " + (testResult.success ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-rose-950/30 border-rose-500/40 text-rose-300")}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold">{testResult.success ? "Connection successful!" : "Connection error"}</p>
                <p className="text-[11px] opacity-90 mt-0.5">{testResult.error || "Connected to trips table successfully."}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1.5"
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
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-bold transition-all"
              >
                Disable
              </button>
            )}
          </div>
        </div>

        {/* Database Seed Section */}
        {enabled && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Upload Local Trips to Supabase
              </span>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              >
                <Cloud className="w-3 h-3" />
                <span>{seeding ? "Uploading..." : "Push (" + allTrips.length + " Trips)"}</span>
              </button>
            </div>
            {seedMessage && (
              <p className="text-[11px] text-emerald-400 font-mono mt-1">{seedMessage}</p>
            )}
          </div>
        )}

        {/* SQL Migration Accordion */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
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
          <pre className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono overflow-x-auto select-all">
            {sqlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

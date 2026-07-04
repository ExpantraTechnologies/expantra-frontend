"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const PROVIDERS = [
  { value: "vagaro", label: "Vagaro" },
  { value: "glossgenius", label: "GlossGenius" },
  { value: "square", label: "Square Appointments" },
  { value: "calendly", label: "Calendly" },
  { value: "acuity", label: "Acuity Scheduling" },
  { value: "fresha", label: "Fresha" },
  { value: "boulevard", label: "Boulevard" },
];

export default function CalendarSettingsPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSyncInfo, setLastSyncInfo] = useState<string | null>(null);

  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [locationId, setLocationId] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 1. Fetch businessId from API route
  useEffect(() => {
    async function loadBusiness() {
      const res = await fetch("/api/business/current");
      const json = await res.json();
      setBusinessId(json.businessId || null);
    }
    loadBusiness();
  }, []);

  // 2. Load existing CRM settings once businessId is known
  useEffect(() => {
    if (!businessId) return;

    async function load() {
      const { data } = await supabase
        .from("crm_connections")
        .select("*")
        .eq("business_id", businessId)
        .single();

      if (data) {
        setProvider(data.crm_provider || "");
        setApiKey(data.crm_api_key || "");
        setLocationId(data.crm_location_id || "");
        setCalendarId(data.crm_calendar_id || "");
        setUsername(data.crm_username || "");
        setPassword(data.crm_password || "");
      }
    }

    load();
  }, [businessId]);

  async function saveSettings() {
    if (!businessId) return;

    setLoadingSave(true);
    setMessage("");

    const { error } = await supabase.rpc("save_crm_connection", {
      p_business_id: businessId,
      p_crm_provider: provider,
      p_crm_api_key: apiKey,
      p_crm_location_id: locationId,
      p_crm_calendar_id: calendarId,
      p_crm_username: username,
      p_crm_password: password,
      p_crm_extra_config: {},
    });

    setLoadingSave(false);

    if (error) {
      setMessage("❌ Error saving settings: " + error.message);
    } else {
      setMessage("✅ CRM settings saved successfully");
    }
  }

  async function syncNow() {
    if (!businessId) return;

    setLoadingSync(true);
    setMessage("");

    try {
      const res = await fetch("/api/crm/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      const json = await res.json();

      if (!json.success) {
        setMessage("❌ Sync failed: " + json.error);
      } else {
        setMessage(
          `✅ Synced ${json.synced} external appointments from ${json.provider}`
        );
        setLastSyncInfo(
          `Last sync: ${new Date().toLocaleString()} — ${json.synced} appointments`
        );
      }
    } catch (err: any) {
      setMessage("❌ Sync failed: " + err.message);
    }

    setLoadingSync(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Connect Your Calendar</h1>

      {!businessId && (
        <p className="text-gray-600">Loading business information...</p>
      )}

      {businessId && (
        <div className="space-y-4">
          {/* Provider */}
          <div>
            <label className="block font-medium mb-1">Calendar Provider</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="">Select provider...</option>
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="block font-medium mb-1">API Key</label>
            <input
              type="password"
              className="border rounded px-3 py-2 w-full"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          {/* Location ID */}
          {["square", "vagaro", "fresha", "boulevard"].includes(provider) && (
            <div>
              <label className="block font-medium mb-1">Location ID</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              />
            </div>
          )}

          {/* Calendar ID */}
          {["calendly", "acuity"].includes(provider) && (
            <div>
              <label className="block font-medium mb-1">Calendar ID</label>
              <input
                className="border rounded px-3 py-2 w-full"
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
              />
            </div>
          )}

          {/* Username + Password */}
          {["acuity", "boulevard"].includes(provider) && (
            <>
              <div>
                <label className="block font-medium mb-1">Username</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Password</label>
                <input
                  type="password"
                  className="border rounded px-3 py-2 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={saveSettings}
              disabled={loadingSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loadingSave ? "Saving..." : "Save Settings"}
            </button>

            <button
              onClick={syncNow}
              disabled={loadingSync}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              {loadingSync ? "Syncing..." : "Sync Now"}
            </button>
          </div>

          {/* Last Sync Info */}
          {lastSyncInfo && (
            <div className="mt-3 text-sm text-gray-600">{lastSyncInfo}</div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-4 p-3 bg-gray-100 rounded border">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

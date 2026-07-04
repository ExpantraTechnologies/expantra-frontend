"use client";

import { useEffect, useState } from "react";

export function LastSyncStatus() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [status, setStatus] = useState<null | {
    created_at: string;
    provider: string;
    synced_count: number;
    success: boolean;
    error_message: string | null;
  }>(null);

  // 1. Fetch businessId from API route
  useEffect(() => {
    async function loadBusiness() {
      const res = await fetch("/api/business/current");
      const json = await res.json();
      setBusinessId(json.businessId || null);
    }
    loadBusiness();
  }, []);

  // 2. Load sync status once businessId is known
  useEffect(() => {
    if (!businessId) return;

    async function load() {
      const res = await fetch(
        `/api/crm/last-sync?businessId=${encodeURIComponent(businessId ?? "")}`
      );
      const json = await res.json();

      if (json.success && json.lastSync) {
        setStatus(json.lastSync);
      }
    }

    load();
  }, [businessId]);

  if (!status) {
    return (
      <div className="text-sm text-gray-500">
        No sync activity yet.
      </div>
    );
  }

  return (
    <div className="text-sm space-y-1">
      <div>
        <span className="font-medium">Last sync:</span>{" "}
        {new Date(status.created_at).toLocaleString()}
      </div>
      <div>
        <span className="font-medium">Provider:</span> {status.provider}
      </div>
      <div>
        <span className="font-medium">Appointments:</span>{" "}
        {status.synced_count}
      </div>
      <div>
        <span className="font-medium">Status:</span>{" "}
        {status.success ? "✅ Success" : "❌ Failed"}
      </div>
      {!status.success && status.error_message && (
        <div className="text-red-600 mt-1">
          {status.error_message}
        </div>
      )}
    </div>
  );
}

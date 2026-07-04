"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ExternalAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // 1. Fetch businessId from API route
  useEffect(() => {
    async function loadBusiness() {
      const res = await fetch("/api/business/current");
      const json = await res.json();
      setBusinessId(json.businessId || null);
    }
    loadBusiness();
  }, []);

  // 2. Once businessId is known, load appointments
  useEffect(() => {
    if (!businessId) return;

    async function load() {
      const { data, error } = await supabase
        .from("external_appointments")
        .select("*")
        .eq("business_id", businessId)
        .order("start_time", { ascending: true });

      if (!error && data) {
        setAppointments(data);
      }

      setLoading(false);
    }

    load();
  }, [businessId]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">External Appointments</h1>

      {loading && <p>Loading...</p>}

      {!loading && appointments.length === 0 && (
        <div className="p-4 bg-gray-100 border rounded">
          No external appointments found.
          Try syncing your CRM from the Calendar Settings page.
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Source</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-2 border">
                  {new Date(a.start_time).toLocaleString()}
                </td>
                <td className="p-2 border">
                  {new Date(a.end_time).toLocaleString()}
                </td>
                <td className="p-2 border">{a.customer_name || "—"}</td>
                <td className="p-2 border">{a.service_name || "—"}</td>
                <td className="p-2 border capitalize">{a.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BusinessHour {
  id: string;
  business_id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function BusinessHours({ businessId }: { businessId: string }) {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    setLoading(true);

    const { data } = await supabaseClient
      .from("business_hours")
      .select("*")
      .eq("business_id", businessId)
      .order("day_of_week", { ascending: true });

    setHours((data as BusinessHour[]) || []);
    setLoading(false);
  }

  function updateHour(day: number, field: string, value: any) {
    setHours((prev) =>
      prev.map((h) =>
        h.day_of_week === day ? { ...h, [field]: value } : h
      )
    );
  }

  async function saveHours() {
    setSaving(true);

    for (const h of hours) {
      await supabaseClient
        .from("business_hours")
        .update({
          open_time: h.is_closed ? null : h.open_time,
          close_time: h.is_closed ? null : h.close_time,
          is_closed: h.is_closed,
        })
        .eq("id", h.id);
    }

    setSaving(false);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading hours…</p>;
  }

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Business Hours</h3>

      <div className="space-y-4">
        {hours.map((h) => (
          <div key={h.id} className="flex items-center gap-4">
            <div className="w-32 font-medium">{DAYS[h.day_of_week]}</div>

            <div className="flex items-center gap-2">
              <Label className="text-xs">Open</Label>
              <Input
                type="time"
                disabled={h.is_closed}
                value={h.open_time || ""}
                onChange={(e) =>
                  updateHour(h.day_of_week, "open_time", e.target.value)
                }
                className="w-28"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs">Close</Label>
              <Input
                type="time"
                disabled={h.is_closed}
                value={h.close_time || ""}
                onChange={(e) =>
                  updateHour(h.day_of_week, "close_time", e.target.value)
                }
                className="w-28"
              />
            </div>

            <Button
              variant={h.is_closed ? "default" : "outline"}
              onClick={() =>
                updateHour(h.day_of_week, "is_closed", !h.is_closed)
              }
            >
              {h.is_closed ? "Closed" : "Open"}
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={saveHours} disabled={saving}>
        {saving ? "Saving…" : "Save Hours"}
      </Button>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BusinessClosure {
  id: string;
  business_id: string;
  date: string;
  reason: string | null;
  is_full_day: boolean;
  open_time: string | null;
  close_time: string | null;
}

export function BusinessClosures({ businessId }: { businessId: string }) {
  const [closures, setClosures] = useState<BusinessClosure[]>([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isFullDay, setIsFullDay] = useState(true);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  useEffect(() => {
    fetchClosures();
  }, []);

  async function fetchClosures() {
    setLoading(true);

    const { data } = await supabase
      .from("business_closures")
      .select("*")
      .eq("business_id", businessId)
      .order("date", { ascending: true });

    setClosures((data as BusinessClosure[]) || []);
    setLoading(false);
  }

  async function addClosure() {
    if (!date) return;

    const payload = {
      business_id: businessId,
      date,
      reason: reason || null,
      is_full_day: isFullDay,
      open_time: isFullDay ? null : openTime,
      close_time: isFullDay ? null : closeTime,
    };

    await supabase.from("business_closures").insert(payload);

    // Reset form
    setDate("");
    setReason("");
    setIsFullDay(true);
    setOpenTime("");
    setCloseTime("");

    fetchClosures();
  }

  async function deleteClosure(id: string) {
    await supabase.from("business_closures").delete().eq("id", id);
    fetchClosures();
  }

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Closures & Holidays</h3>

      {/* Add Closure */}
      <div className="space-y-4 border p-4 rounded-md">
        <h4 className="font-medium">Add Closure</h4>

        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Reason</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Holiday, maintenance, event…"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <select
            className="border rounded-md p-2 w-full"
            value={isFullDay ? "full" : "partial"}
            onChange={(e) => setIsFullDay(e.target.value === "full")}
          >
            <option value="full">Full Day Closure</option>
            <option value="partial">Partial Day Closure</option>
          </select>
        </div>

        {!isFullDay && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Open Time</Label>
              <Input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Close Time</Label>
              <Input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>
        )}

        <Button onClick={addClosure}>Add Closure</Button>
      </div>

      {/* List of Closures */}
      <div className="space-y-4">
        <h4 className="font-medium">Upcoming Closures</h4>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading && closures.length === 0 && (
          <p className="text-sm text-muted-foreground">No closures added.</p>
        )}

        {!loading &&
          closures.map((c) => (
            <Card key={c.id} className="p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">
                  {new Date(c.date).toLocaleDateString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteClosure(c.id)}
                >
                  Delete
                </Button>
              </div>

              {c.reason && (
                <p className="text-muted-foreground">Reason: {c.reason}</p>
              )}

              {c.is_full_day ? (
                <p className="text-xs text-muted-foreground">Full Day Closure</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Partial: {c.open_time} – {c.close_time}
                </p>
              )}
            </Card>
          ))}
      </div>
    </Card>
  );
}

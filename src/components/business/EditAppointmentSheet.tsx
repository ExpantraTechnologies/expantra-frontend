"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";

export function EditAppointmentSheet({
  open,
  setOpen,
  appointment,
  businessId,
  onComplete,
  optimisticEdit,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  appointment: Appointment | null;
  businessId: string;
  onComplete: () => void;
  optimisticEdit: (appt: Appointment) => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [serviceId, setServiceId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // Load services + customers when sheet opens
  useEffect(() => {
    if (open) {
      loadServices();
      loadCustomers();
    }
  }, [open]);

  // Pre-fill fields when appointment changes
  useEffect(() => {
    if (appointment) {
      setServiceId(appointment.service_id || "");
      setCustomerId(appointment.customer_id || "");
      setStartsAt(appointment.starts_at.slice(0, 16)); // format for datetime-local
      setEndsAt(appointment.ends_at.slice(0, 16));
      setNotes(appointment.notes || "");
    }
  }, [appointment]);

  async function loadServices() {
    const { data } = await supabaseClient
      .from("services")
      .select("*")
      .eq("business_id", businessId);

    setServices((data as Service[]) || []);
  }

  async function loadCustomers() {
    const { data } = await supabaseClient
      .from("customers")
      .select("*")
      .eq("business_id", businessId);

    setCustomers(data || []);
  }

  async function handleSubmit() {
    if (!appointment) return;

    setLoading(true);

    const updated: Appointment = {
      ...appointment,
      service_id: serviceId || null,
      customer_id: customerId || null,
      starts_at: startsAt,
      ends_at: endsAt,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    // Optimistic update
    optimisticEdit(updated);

    // Close immediately
    setOpen(false);

    // Persist to Supabase
    await supabaseClient
      .from("appointments")
      .update({
        service_id: updated.service_id,
        customer_id: updated.customer_id,
        starts_at: updated.starts_at,
        ends_at: updated.ends_at,
        notes: updated.notes,
      })
      .eq("id", appointment.id);

    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Appointment</SheetTitle>
          <SheetDescription>
            Update the details of this appointment.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">

          {/* Service */}
          <div className="space-y-2">
            <Label>Service</Label>
            <select
              className="border rounded-md p-2 w-full"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <Label>Customer</Label>
            <select
              className="border rounded-md p-2 w-full"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.phone || "Unnamed"}
                </option>
              ))}
            </select>
          </div>

          {/* Start */}
          <div className="space-y-2">
            <Label>Starts At</Label>
            <Input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>

          {/* End */}
          <div className="space-y-2">
            <Label>Ends At</Label>
            <Input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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

export function AddAppointmentSheet({
  open,
  setOpen,
  businessId,
  onComplete,
  optimisticAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  businessId: string;
  onComplete: () => void;
  optimisticAdd: (appt: Appointment) => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  const [serviceId, setServiceId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadServices();
      loadCustomers();
    }
  }, [open]);

  async function loadServices() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId);

    setServices((data as Service[]) || []);
  }

  async function loadCustomers() {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId);

    setCustomers(data || []);
  }

  async function handleSubmit() {
    setLoading(true);

    const temp: Appointment = {
      id: "temp-" + Math.random().toString(36).slice(2),
      business_id: businessId,
      customer_id: customerId || null,
      service_id: serviceId || null,
      starts_at: startsAt,
      ends_at: endsAt,
      status: "scheduled",
      notes: notes || null,
      source: "manual",
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    optimisticAdd(temp);
    setOpen(false);

    await supabase.from("appointments").insert({
      business_id: businessId,
      customer_id: customerId || null,
      service_id: serviceId || null,
      starts_at: startsAt,
      ends_at: endsAt,
      status: "scheduled",
      notes: notes || null,
      source: "manual",
    });

    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Appointment</SheetTitle>
          <SheetDescription>
            Create a new appointment for this business.
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
                <option key={c.id} value={c.id}></option>
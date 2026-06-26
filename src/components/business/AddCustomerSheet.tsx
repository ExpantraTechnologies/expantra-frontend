"use client";

import { useState } from "react";
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
import type { Customer } from "@/types/customer";

export function AddCustomerSheet({
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
  optimisticAdd: (customer: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const temp: Customer = {
      id: "temp-" + Math.random().toString(36).slice(2),
      business_id: businessId,
      name: name || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    // Optimistic update
    optimisticAdd(temp);

    // Close immediately
    setOpen(false);

    // Persist to Supabase
    await supabaseClient.from("customers").insert({
      business_id: businessId,
      name: name || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
    });

    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Customer</SheetTitle>
          <SheetDescription>
            Add a new customer to this business.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123‑4567"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VIP customer, prefers morning appointments…"
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Add Customer"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

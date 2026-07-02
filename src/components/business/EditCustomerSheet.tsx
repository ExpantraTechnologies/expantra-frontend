"use client";

import { useEffect, useState } from "react";
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
import type { Customer } from "@/types/customer";

export function EditCustomerSheet({
  open,
  setOpen,
  customer,
  businessId,
  onComplete,
  optimisticEdit,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  customer: Customer | null;
  businessId: string;
  onComplete: () => void;
  optimisticEdit: (customer: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
      setEmail(customer.email || "");
      setNotes(customer.notes || "");
    }
  }, [customer]);

  async function handleSubmit() {
    if (!customer) return;

    setLoading(true);

    const updated: Customer = {
      ...customer,
      name: name || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    };

    optimisticEdit(updated);
    setOpen(false);

    await supabase
      .from("customers")
      .update({
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        notes: updated.notes,
      })
      .eq("id", customer.id);

    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Customer</SheetTitle>
          <SheetDescription>
            Update this customer's information.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123‑4567"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VIP customer, prefers morning appointments…"
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

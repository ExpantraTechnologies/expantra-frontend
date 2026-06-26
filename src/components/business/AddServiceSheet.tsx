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
import { Switch } from "@/components/ui/switch";
import type { Service } from "@/types/service";

export function AddServiceSheet({
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
  optimisticAdd: (service: Service) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [requiresConsultation, setRequiresConsultation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const priceInCents = Math.round(parseFloat(price || "0") * 100);

    // Create a temporary optimistic service
    const tempService: Service = {
      id: "temp-" + Math.random().toString(36).slice(2),
      business_id: businessId,
      name,
      category: category || null,
      price: priceInCents,
      duration_minutes: duration ? parseInt(duration) : null,
      description: description || null,
      requires_consultation: requiresConsultation,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    // Optimistic update
    optimisticAdd(tempService);

    // Close immediately
    setOpen(false);

    // Send to Supabase
    const { data, error } = await supabaseClient
      .from("services")
      .insert({
        business_id: businessId,
        name,
        category,
        price: priceInCents,
        duration_minutes: duration ? parseInt(duration) : null,
        description,
        requires_consultation: requiresConsultation,
      })
      .select()
      .single();

    if (error) {
      setError("Failed to create service");
      setLoading(false);
      return;
    }

    // Replace temp with real
    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Service</SheetTitle>
          <SheetDescription>
            Create a new service for this business.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Price (USD)</Label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border rounded-md p-3">
            <div>
              <Label>Requires Consultation</Label>
              <p className="text-sm text-muted-foreground">
                Mark if this service requires a consultation first.
              </p>
            </div>
            <Switch
              checked={requiresConsultation}
              onCheckedChange={setRequiresConsultation}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Create Service"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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
import { Switch } from "@/components/ui/switch";
import type { Service } from "@/types/service";

export function EditServiceSheet({
  open,
  setOpen,
  service,
  onComplete,
  optimisticEdit,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  service: Service | null;
  onComplete: () => void;
  optimisticEdit: (service: Service) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [requiresConsultation, setRequiresConsultation] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setCategory(service.category || "");
      setPrice((service.price / 100).toFixed(2));
      setDuration(service.duration_minutes?.toString() || "");
      setDescription(service.description || "");
      setRequiresConsultation(service.requires_consultation);
    }
  }, [service]);

  async function handleSubmit() {
    if (!service) return;

    setLoading(true);

    const updated: Service = {
      ...service,
      name,
      category: category || null,
      price: Math.round(parseFloat(price || "0") * 100),
      duration_minutes: duration ? parseInt(duration) : null,
      description: description || null,
      requires_consultation: requiresConsultation,
      updated_at: new Date().toISOString(),
    };

    optimisticEdit(updated);
    setOpen(false);

    await supabase
      .from("services")
      .update({
        name,
        category: category || null,
        price: updated.price,
        duration_minutes: updated.duration_minutes,
        description: updated.description,
        requires_consultation: updated.requires_consultation,
      })
      .eq("id", service.id);

    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Service</SheetTitle>
          <SheetDescription>
            Update the details of this service.
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

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

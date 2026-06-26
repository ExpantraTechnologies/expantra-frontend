"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessSettingsSkeleton } from "./BusinessSettingsSkeleton";
import { EditBusinessInfoSheet } from "./EditBusinessInfoSheet";
import type { BusinessSettings } from "@/types/businessSettings";

export function BusinessSettingsPage({ businessId }: { businessId: string }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);

    const { data } = await supabaseClient
      .from("business_settings")
      .select("*")
      .eq("business_id", businessId)
      .single();

    setSettings((data as BusinessSettings) || null);
    setLoading(false);
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Settings</h2>
        <Button onClick={() => setEditOpen(true)}>Edit</Button>
      </div>

      {loading && <BusinessSettingsSkeleton />}

      {!loading && settings && (
        <Card className="p-6 space-y-4 text-sm">

          <div>
            <p className="font-medium">Business Name</p>
            <p className="text-muted-foreground">{settings.name}</p>
          </div>

          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">{settings.phone || "—"}</p>
          </div>

          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{settings.email || "—"}</p>
          </div>

          <div>
            <p className="font-medium">Website</p>
            <p className="text-muted-foreground">{settings.website || "—"}</p>
          </div>

          <div>
            <p className="font-medium">Timezone</p>
            <p className="text-muted-foreground">{settings.timezone}</p>
          </div>

          <div>
            <p className="font-medium">Language</p>
            <p className="text-muted-foreground">{settings.language}</p>
          </div>

          <div>
            <p className="font-medium">Tone</p>
            <p className="text-muted-foreground">{settings.tone}</p>
          </div>

          <div>
            <p className="font-medium">Industry</p>
            <p className="text-muted-foreground">{settings.industry || "—"}</p>
          </div>

          <div>
            <p className="font-medium">Persona</p>
            <p className="text-muted-foreground">{settings.persona || "—"}</p>
          </div>

        </Card>
      )}

      <EditBusinessInfoSheet
        open={editOpen}
        setOpen={setEditOpen}
        settings={settings}
        businessId={businessId}
        onComplete={fetchSettings}
      />
    </div>
  );
}

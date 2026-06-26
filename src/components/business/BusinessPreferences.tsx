"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessSettings } from "@/types/businessSettings";

export function BusinessPreferences({ businessId }: { businessId: string }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [language, setLanguage] = useState<"en" | "es" | "bilingual">("en");
  const [tone, setTone] = useState<
    "professional" | "friendly" | "energetic" | "calm"
  >("friendly");
  const [industry, setIndustry] = useState("");
  const [persona, setPersona] = useState("");

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

    const s = data as BusinessSettings;
    setSettings(s);

    if (s) {
      setLanguage(s.language);
      setTone(s.tone);
      setIndustry(s.industry || "");
      setPersona(s.persona || "");
    }

    setLoading(false);
  }

  async function savePreferences() {
    if (!settings) return;

    setSaving(true);

    await supabaseClient
      .from("business_settings")
      .update({
        language,
        tone,
        industry: industry || null,
        persona: persona || null,
      })
      .eq("business_id", businessId);

    setSaving(false);
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading preferences…</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">AI Preferences</h3>

      {/* Language */}
      <div className="space-y-2">
        <Label>Language</Label>
        <select
          className="border rounded-md p-2 w-full"
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "en" | "es" | "bilingual")
          }
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="bilingual">Bilingual</option>
        </select>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <Label>Tone</Label>
        <select
          className="border rounded-md p-2 w-full"
          value={tone}
          onChange={(e) =>
            setTone(
              e.target.value as
                | "professional"
                | "friendly"
                | "energetic"
                | "calm"
            )
          }
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
        </select>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label>Industry</Label>
        <input
          className="border rounded-md p-2 w-full"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Med spa, dental, law, salon…"
        />
      </div>

      {/* Persona */}
      <div className="space-y-2">
        <Label>AI Persona</Label>
        <Textarea
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="Describe how the AI should behave…"
        />
      </div>

      <Button onClick={savePreferences} disabled={saving}>
        {saving ? "Saving…" : "Save Preferences"}
      </Button>
    </Card>
  );
}

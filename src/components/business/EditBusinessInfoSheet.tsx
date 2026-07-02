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
import type { BusinessSettings } from "@/types/businessSettings";

export function EditBusinessInfoSheet({
  open,
  setOpen,
  settings,
  businessId,
  onComplete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  settings: BusinessSettings | null;
  businessId: string;
  onComplete: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [timezone, setTimezone] = useState("America/Los_Angeles");

  const [bookingWindow, setBookingWindow] = useState("30");
  const [minNotice, setMinNotice] = useState("60");
  const [buffer, setBuffer] = useState("10");

  const [language, setLanguage] = useState<"en" | "es" | "bilingual">("en");
  const [tone, setTone] = useState<
    "professional" | "friendly" | "energetic" | "calm"
  >("friendly");

  const [industry, setIndustry] = useState("");
  const [persona, setPersona] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setPhone(settings.phone || "");
      setEmail(settings.email || "");
      setWebsite(settings.website || "");
      setTimezone(settings.timezone);

      setBookingWindow(settings.booking_window_days.toString());
      setMinNotice(settings.min_notice_minutes.toString());
      setBuffer(settings.buffer_minutes.toString());

      setLanguage(settings.language);
      setTone(settings.tone);
      setIndustry(settings.industry || "");
      setPersona(settings.persona || "");
    }
  }, [settings]);

  async function handleSubmit() {
    if (!settings) return;

    setLoading(true);

    await supabase
      .from("business_settings")
      .update({
        name,
        phone: phone || null,
        email: email || null,
        website: website || null,
        timezone,

        booking_window_days: parseInt(bookingWindow),
        min_notice_minutes: parseInt(minNotice),
        buffer_minutes: parseInt(buffer),

        language,
        tone,
        industry: industry || null,
        persona: persona || null,
      })
      .eq("business_id", businessId);

    setOpen(false);
    onComplete();
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Edit Business Settings</SheetTitle>
          <SheetDescription>
            Update your business information and AI preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">

          {/* BUSINESS INFO */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Info</h3>

            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
          </div>

          {/* BOOKING RULES */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Booking Rules</h3>

            <div className="space-y-2">
              <Label>Booking Window (days)</Label>
              <Input
                type="number"
                value={bookingWindow}
                onChange={(e) => setBookingWindow(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Minimum Notice (minutes)</Label>
              <Input
                type="number"
                value={minNotice}
                onChange={(e) => setMinNotice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Buffer Between Appointments (minutes)</Label>
              <Input
                type="number"
                value={buffer}
                onChange={(e) => setBuffer(e.target.value)}
              />
            </div>
          </div>

          {/* AI PREFERENCES */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI Preferences</h3>

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

            <div className="space-y-2">
              <Label>Industry</Label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Med spa, dental, law, salon…"
              />
            </div>

            <div className="space-y-2">
              <Label>AI Persona</Label>
              <Textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="Describe how the AI should behave…"
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

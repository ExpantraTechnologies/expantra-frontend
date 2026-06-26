export interface BusinessSettings {
  id: string;
  business_id: string;

  // Core identity
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  timezone: string;

  // Booking rules
  booking_window_days: number; // how far ahead customers can book
  min_notice_minutes: number;  // minimum time before appointment
  buffer_minutes: number;      // gap between appointments

  // Preferences
  language: "en" | "es" | "bilingual";
  tone: "professional" | "friendly" | "energetic" | "calm";
  persona: string | null;      // custom AI persona description
  industry: string | null;     // med spa, dental, law, etc.

  // Hours + closures stored in separate tables
  created_at: string;
  updated_at: string | null;
}

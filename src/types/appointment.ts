export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  business_id: string;

  // core links
  customer_id: string | null;
  service_id: string | null;

  // timing
  starts_at: string; // ISO
  ends_at: string;   // ISO

  // metadata
  status: AppointmentStatus;
  notes: string | null;
  source: "ai" | "manual" | "online" | "imported";

  created_at: string;
  updated_at: string | null;
}

export interface Service {
  id: string;
  business_id: string;

  name: string;
  category: string | null;

  // stored as integer cents
  price: number;

  // stored as minutes
  duration_minutes: number | null;

  description: string | null;

  requires_consultation: boolean;

  created_at: string;
  updated_at: string | null;
}

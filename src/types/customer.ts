export interface Customer {
  id: string;
  business_id: string;

  name: string | null;
  phone: string | null;
  email: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string | null;
}

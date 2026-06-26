export type Business = {
  id: string;
  name: string;
  phone_number: string | null;
  industry: string | null;
  plan: "starter" | "value" | "elite" | "enterprise_elite" | null;
  minutes_limit: number | null;
  minutes_used: number | null;
  billing_status: string | null;
  renewal_date: string | null;
  created_at: string | null;
};

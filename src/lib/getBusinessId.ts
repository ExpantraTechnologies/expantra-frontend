import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";

export async function getBusinessId() {
  const { userId } = auth();

  if (!userId) return null;

  const { data, error } = await supabaseClient
    .from("user_businesses")
    .select("business_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return data.business_id;
}

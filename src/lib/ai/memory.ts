import { supabase } from "@/lib/supabaseClient";

//
// Save one turn of conversation (customer or assistant)
//
export async function saveConversationTurn(
  businessId: string,
  customerPhone: string,
  role: "customer" | "assistant",
  message: string
) {
  if (!businessId || !customerPhone || !role || !message) return;

  await supabase.from("conversation_history").insert({
    business_id: businessId,
    customer_phone: customerPhone,
    role,
    message,
  });
}

//
// Load full conversation history for this customer + business
//
export async function getConversationHistory(
  businessId: string,
  customerPhone: string
) {
  if (!businessId || !customerPhone) return [];

  const { data, error } = await supabase
    .from("conversation_history")
    .select("*")
    .eq("business_id", businessId)
    .eq("customer_phone", customerPhone)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading conversation history:", error);
    return [];
  }

  return data || [];
}

//
// Save or update a customer preference
//
export async function saveCustomerPreference(
  customerId: string,
  key: string,
  value: string
) {
  if (!customerId || !key) return;

  await supabase
    .from("customer_preferences")
    .upsert({
      customer_id: customerId,
      key,
      value,
    });
}

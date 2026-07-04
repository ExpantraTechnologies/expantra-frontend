import { supabase } from "@/lib/supabaseClient";
import { getConversationHistory } from "./memory";

export async function getBusinessContext(businessId: string, customerPhone?: string) {
  // Load business settings
  const { data: settings } = await supabase
    .from("business_settings")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Load hours
  const { data: hours } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId);

  // Load closures
  const { data: closures } = await supabase
    .from("business_closures")
    .select("*")
    .eq("business_id", businessId);

  // Load services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  // Load appointments (internal)
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("business_id", businessId);

  // Load CRM connection (external calendar provider)
  const { data: crm } = await supabase
    .from("crm_connections")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Load customer (if phone provided)
  let customer = null;
  let preferences: any[] = [];
  let conversationHistory: any[] = [];

  if (customerPhone) {
    const { data: cust } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .eq("phone", customerPhone)
      .single();

    customer = cust || null;

    // Load conversation history
    conversationHistory = await getConversationHistory(businessId, customerPhone);
  }

  return {
    settings,
    hours,
    closures,
    services,
    appointments,
    crm,
    customer,
    preferences,         // (placeholder — customer preferences removed)
    conversationHistory,
  };
}

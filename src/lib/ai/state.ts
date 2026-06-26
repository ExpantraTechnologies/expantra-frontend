import { supabaseClient } from "@/lib/supabaseClient";
import { getConversationHistory, getCustomerPreferences } from "./memory";

export async function getBusinessContext(businessId: string, customerPhone?: string) {
  // Load business settings
  const { data: settings } = await supabaseClient
    .from("business_settings")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Load hours
  const { data: hours } = await supabaseClient
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId);

  // Load closures
  const { data: closures } = await supabaseClient
    .from("business_closures")
    .select("*")
    .eq("business_id", businessId);

  // Load services
  const { data: services } = await supabaseClient
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  // Load appointments (internal)
  const { data: appointments } = await supabaseClient
    .from("appointments")
    .select("*")
    .eq("business_id", businessId);

  // Load CRM connection (external calendar provider)
  const { data: crm } = await supabaseClient
    .from("crm_connections")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Load customer (if phone provided)
  let customer = null;
  let preferences = [];
  let conversationHistory = [];

  if (customerPhone) {
    const { data: cust } = await supabaseClient
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .eq("phone", customerPhone)
      .single();

    customer = cust || null;

    // Load customer preferences
    if (customer) {
      preferences = await getCustomerPreferences(customer.id);
    }

    // Load conversation history
    conversationHistory = await getConversationHistory(businessId, customerPhone);
  }

  return {
    settings,
    hours,
    closures,
    services,
    appointments,
    crm,                 // ⭐ NEW: CRM connection info
    customer,
    preferences,         // ⭐ NEW: Customer preferences
    conversationHistory, // ⭐ NEW: Conversation memory
  };
}

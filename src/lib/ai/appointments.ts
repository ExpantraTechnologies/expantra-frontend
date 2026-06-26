import { supabaseClient } from "@/lib/supabaseClient";

export async function getCustomerAppointments(businessId: string, customerId: string) {
  const { data } = await supabaseClient
    .from("appointments")
    .select("*")
    .eq("business_id", businessId)
    .eq("customer_id", customerId)
    .order("start_time", { ascending: true });

  return data || [];
}

export async function updateAppointmentTime(appointmentId: string, newStartISO: string, durationMinutes: number) {
  const newStart = new Date(newStartISO);
  const newEnd = new Date(newStart.getTime() + durationMinutes * 60000);

  const { data, error } = await supabaseClient
    .from("appointments")
    .update({
      start_time: newStart.toISOString(),
      end_time: newEnd.toISOString(),
    })
    .eq("id", appointmentId)
    .select()
    .single();

  return { data, error };
}

export async function cancelAppointment(appointmentId: string) {
  const { error } = await supabaseClient
    .from("appointments")
    .delete()
    .eq("id", appointmentId);

  return { error };
}

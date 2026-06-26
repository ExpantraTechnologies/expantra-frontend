import { supabaseClient } from "@/lib/supabaseClient";
import { getExternalAppointments } from "./externalCalendar";

interface BookingRequest {
  businessId: string;
  serviceId: string;
  customerId: string | null;
  requestedStart: string; // ISO string
}

export async function checkAvailability({
  businessId,
  serviceId,
  requestedStart,
}: BookingRequest) {
  // Load service
  const { data: service } = await supabaseClient
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (!service) return { available: false, reason: "Service not found" };

  const duration = service.duration_minutes;

  const requestedStartDate = new Date(requestedStart);
  const requestedEndDate = new Date(
    requestedStartDate.getTime() + duration * 60000
  );

  // Load business settings
  const { data: settings } = await supabaseClient
    .from("business_settings")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Minimum notice
  const now = new Date();
  const diffMinutes = (requestedStartDate.getTime() - now.getTime()) / 60000;

  if (diffMinutes < settings.min_notice_minutes) {
    return {
      available: false,
      reason: "Minimum notice not met",
    };
  }

  // Booking window
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + settings.booking_window_days);

  if (requestedStartDate > maxDate) {
    return {
      available: false,
      reason: "Requested date is outside booking window",
    };
  }

  // Load business hours
  const { data: hours } = await supabaseClient
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId);

  const day = requestedStartDate.getDay();
  const todaysHours = hours.find((h: any) => h.day_of_week === day);

  if (!todaysHours || todaysHours.is_closed) {
    return { available: false, reason: "Business is closed that day" };
  }

  // Check if requested time is within open hours
  const open = parseTime(todaysHours.open_time);
  const close = parseTime(todaysHours.close_time);

  const startMinutes =
    requestedStartDate.getHours() * 60 + requestedStartDate.getMinutes();
  const endMinutes =
    requestedEndDate.getHours() * 60 + requestedEndDate.getMinutes();

  if (startMinutes < open || endMinutes > close) {
    return { available: false, reason: "Outside business hours" };
  }

  // Check closures
  const { data: closures } = await supabaseClient
    .from("business_closures")
    .select("*")
    .eq("business_id", businessId);

  const dateStr = requestedStartDate.toISOString().split("T")[0];
  const closure = closures.find((c: any) => c.date === dateStr);

  if (closure) {
    if (closure.is_full_day) {
      return { available: false, reason: "Business is closed that day" };
    }

    const closureOpen = parseTime(closure.open_time);
    const closureClose = parseTime(closure.close_time);

    if (startMinutes < closureOpen || endMinutes > closureClose) {
      return { available: false, reason: "Closed during requested time" };
    }
  }

  // Load internal appointments
  const { data: internalAppointments } = await supabaseClient
    .from("appointments")
    .select("*")
    .eq("business_id", businessId);

  // Load external CRM appointments (Vagaro, GlossGenius, Square, etc.)
  const externalAppointments = await getExternalAppointments(businessId);

  // Merge internal + external
  const allAppointments = [
    ...(internalAppointments || []),
    ...(externalAppointments || []),
  ];

  // Check conflicts
  for (const appt of allAppointments) {
    const apptStart = new Date(appt.start_time);
    const apptEnd = new Date(appt.end_time);

    // Apply buffer
    const buffer = settings.buffer_minutes;
    const apptStartBuffered = new Date(
      apptStart.getTime() - buffer * 60000
    );
    const apptEndBuffered = new Date(
      apptEnd.getTime() + buffer * 60000
    );

    if (
      requestedStartDate < apptEndBuffered &&
      requestedEndDate > apptStartBuffered
    ) {
      return { available: false, reason: "Time conflict with another appointment" };
    }
  }

  return { available: true };
}

export async function createAppointment({
  businessId,
  serviceId,
  customerId,
  requestedStart,
}: BookingRequest) {
  const { data: service } = await supabaseClient
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  const duration = service.duration_minutes;

  const start = new Date(requestedStart);
  const end = new Date(start.getTime() + duration * 60000);

  const { data, error } = await supabaseClient
    .from("appointments")
    .insert({
      business_id: businessId,
      service_id: serviceId,
      customer_id: customerId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    })
    .select()
    .single();

  return { data, error };
}

function parseTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

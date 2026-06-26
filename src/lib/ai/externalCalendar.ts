/**
 * External Calendar Integration Layer
 *
 * This module allows Expantra to connect to ANY external CRM or scheduling system.
 * Examples: Vagaro, GlossGenius, Square Appointments, Calendly, Acuity, Fresha, Boulevard.
 *
 * The goal:
 *  - Fetch external appointments
 *  - Normalize them into a consistent shape
 *  - Merge with internal Supabase appointments
 *  - Guarantee ZERO double-booking
 *
 * Each business will eventually store:
 *  - crm_provider (string)
 *  - crm_api_key (string)
 *  - crm_location_id (optional)
 *  - crm_calendar_id (optional)
 *
 * For now, this file returns an empty array until CRM credentials are added.
 */

export interface ExternalAppointment {
  start_time: string; // ISO
  end_time: string;   // ISO
  service_name?: string;
  customer_name?: string;
  customer_phone?: string;
  source: string;     // e.g. "vagaro", "glossgenius", "square"
}

export async function getExternalAppointments(businessId: string): Promise<ExternalAppointment[]> {
  // TODO: Load CRM credentials from Supabase
  // Example:
  // const { data: settings } = await supabaseClient
  //   .from("business_settings")
  //   .select("crm_provider, crm_api_key, crm_location_id, crm_calendar_id")
  //   .eq("business_id", businessId)
  //   .single();

  // For now, no CRM connected → return empty list
  return [];

  /**
   * Once CRM credentials exist, you will implement:
   *
   * switch (settings.crm_provider) {
   *   case "vagaro":
   *     return await fetchVagaroAppointments(settings);
   *   case "glossgenius":
   *     return await fetchGlossGeniusAppointments(settings);
   *   case "square":
   *     return await fetchSquareAppointments(settings);
   *   case "calendly":
   *     return await fetchCalendlyAppointments(settings);
   *   case "acuity":
   *     return await fetchAcuityAppointments(settings);
   *   case "fresha":
   *     return await fetchFreshaAppointments(settings);
   *   case "boulevard":
   *     return await fetchBoulevardAppointments(settings);
   *   default:
   *     return [];
   * }
   */
}

/* ============================================================
   FUTURE CRM INTEGRATION STUBS
   ============================================================ */

/**
 * VAGARO
 */
async function fetchVagaroAppointments(settings: any): Promise<ExternalAppointment[]> {
  // Example structure — not active until credentials exist
  const response = await fetch("https://api.vagaro.com/v1/appointments", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.appointments.map((a: any) => ({
    start_time: a.start,
    end_time: a.end,
    service_name: a.serviceName,
    customer_name: a.customerName,
    customer_phone: a.customerPhone,
    source: "vagaro",
  }));
}

/**
 * GLOSSGENIUS
 */
async function fetchGlossGeniusAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch("https://api.glossgenius.com/v1/appointments", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.appointments.map((a: any) => ({
    start_time: a.start_time,
    end_time: a.end_time,
    service_name: a.service,
    customer_name: a.client_name,
    customer_phone: a.client_phone,
    source: "glossgenius",
  }));
}

/**
 * SQUARE APPOINTMENTS
 */
async function fetchSquareAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch(
    `https://connect.squareup.com/v2/bookings?location_id=${settings.crm_location_id}`,
    {
      headers: { Authorization: `Bearer ${settings.crm_api_key}` },
    }
  );

  const data = await response.json();

  return data.bookings.map((b: any) => ({
    start_time: b.start_at,
    end_time: b.end_at,
    service_name: b.service_variation_name,
    customer_name: b.customer_name,
    customer_phone: b.customer_phone_number,
    source: "square",
  }));
}

/**
 * CALENDLY
 */
async function fetchCalendlyAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch("https://api.calendly.com/scheduled_events", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.collection.map((e: any) => ({
    start_time: e.start_time,
    end_time: e.end_time,
    service_name: e.name,
    customer_name: e.invitees?.[0]?.name,
    customer_phone: e.invitees?.[0]?.phone_number,
    source: "calendly",
  }));
}

/**
 * ACUITY SCHEDULING
 */
async function fetchAcuityAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch("https://acuityscheduling.com/api/v1/appointments", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.map((a: any) => ({
    start_time: a.datetime,
    end_time: a.end_datetime,
    service_name: a.type,
    customer_name: a.firstName + " " + a.lastName,
    customer_phone: a.phone,
    source: "acuity",
  }));
}

/**
 * FRESHA
 */
async function fetchFreshaAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch("https://api.fresha.com/v1/appointments", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.appointments.map((a: any) => ({
    start_time: a.start_at,
    end_time: a.end_at,
    service_name: a.service_name,
    customer_name: a.client_name,
    customer_phone: a.client_phone,
    source: "fresha",
  }));
}

/**
 * BOULEVARD
 */
async function fetchBoulevardAppointments(settings: any): Promise<ExternalAppointment[]> {
  const response = await fetch("https://api.boulevard.io/v1/appointments", {
    headers: { Authorization: `Bearer ${settings.crm_api_key}` },
  });

  const data = await response.json();

  return data.data.map((a: any) => ({
    start_time: a.start_at,
    end_time: a.end_at,
    service_name: a.service_name,
    customer_name: a.client_name,
    customer_phone: a.client_phone,
    source: "boulevard",
  }));
}

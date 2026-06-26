import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getExternalAppointments } from "@/lib/ai/externalCalendar";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessId = body.businessId;

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: "Missing businessId" },
        { status: 400 }
      );
    }

    // Load CRM connection
    const { data: crm } = await supabaseClient
      .from("crm_connections")
      .select("*")
      .eq("business_id", businessId)
      .single();

    if (!crm || !crm.crm_provider) {
      return NextResponse.json(
        { success: false, error: "No CRM connected" },
        { status: 400 }
      );
    }

    // Fetch external appointments
    const externalAppointments = await getExternalAppointments(businessId);

    // Clear old external appointments
    await supabaseClient
      .from("external_appointments")
      .delete()
      .eq("business_id", businessId);

    // Insert new ones
    if (externalAppointments.length > 0) {
      const formatted = externalAppointments.map((a) => ({
        business_id: businessId,
        start_time: a.start_time,
        end_time: a.end_time,
        service_name: a.service_name || null,
        customer_name: a.customer_name || null,
        customer_phone: a.customer_phone || null,
        source: a.source,
      }));

      await supabaseClient.from("external_appointments").insert(formatted);
    }

    // ⭐ NEW: Log successful sync
    await supabaseClient.from("crm_sync_logs").insert({
      business_id: businessId,
      provider: crm.crm_provider,
      synced_count: externalAppointments.length,
      success: true,
      error_message: null,
    });

    return NextResponse.json({
      success: true,
      provider: crm.crm_provider,
      synced: externalAppointments.length,
      appointments: externalAppointments,
    });
  } catch (err: any) {
    // ⭐ NEW: Best-effort failure logging
    try {
      const body = await req.json().catch(() => null);
      const businessId = body?.businessId;

      if (businessId) {
        await supabaseClient.from("crm_sync_logs").insert({
          business_id: businessId,
          provider: "unknown",
          synced_count: 0,
          success: false,
          error_message: err.message,
        });
      }
    } catch (_) {}

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

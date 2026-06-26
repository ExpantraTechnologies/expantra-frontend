// supabase/functions/crm-sync-all/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async () => {
  try {
    const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

    const headers = {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Fetch CRM connections safely
    const crmRes = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_connections?select=business_id,crm_provider`,
      { headers }
    );

    let crmConnections: any = null;

    try {
      crmConnections = await crmRes.json();
    } catch (jsonErr) {
      console.error("Failed to parse crm_connections JSON:", jsonErr);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to parse crm_connections response",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("crmConnections raw response:", crmConnections);

    // If Supabase returned an error object instead of an array
    if (!Array.isArray(crmConnections)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "crm_connections returned a non-array response",
          details: crmConnections,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // If the table exists but is empty
    if (crmConnections.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No CRM connections found",
          results: [],
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Trigger sync-business-crm for each business
    const results = [];

    for (const crm of crmConnections) {
      const syncRes = await fetch(
        `${SUPABASE_URL}/functions/v1/sync-business-crm`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ businessId: crm.business_id }),
        }
      );

      let syncJson = {};
      try {
        syncJson = await syncRes.json();
      } catch (err) {
        syncJson = { success: false, error: "Failed to parse sync JSON" };
      }

      results.push({
        businessId: crm.business_id,
        provider: crm.crm_provider,
        ...syncJson,
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

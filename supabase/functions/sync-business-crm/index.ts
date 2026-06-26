// supabase/functions/sync-business-crm/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { businessId } = await req.json();

    if (!businessId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing businessId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const SUPABASE_URL = Deno.env.get("PROJECT_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

    const headers = {
      "apikey": SUPABASE_SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Call your existing Next.js sync endpoint
    const syncRes = await fetch(
      `${SUPABASE_URL}/functions/v1/next-crm-sync`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ businessId }),
      }
    );

    const syncJson = await syncRes.json();

    // 2. Log the sync result
    await fetch(`${SUPABASE_URL}/rest/v1/crm_sync_logs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        business_id: businessId,
        provider: syncJson.provider || null,
        synced: syncJson.synced || 0,
        success: syncJson.success === true,
        error_message: syncJson.error || null,
      }),
    });

    return new Response(JSON.stringify(syncJson), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

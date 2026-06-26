import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json(
      { success: false, error: "Missing businessId" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseClient
    .from("crm_sync_logs")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({
      success: true,
      lastSync: null,
    });
  }

  return NextResponse.json({
    success: true,
    lastSync: data,
  });
}

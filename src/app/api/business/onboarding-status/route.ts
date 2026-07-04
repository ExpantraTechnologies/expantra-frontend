import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return new Response(JSON.stringify({ error: "Missing businessId" }), {
      status: 400,
    });
  }

  // Load business
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  // Load hours
  const { data: hours } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId);

  // Load services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  // Load scripts
  const { data: scripts } = await supabase
    .from("scripts")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // Load knowledge
  const { data: knowledge } = await supabase
    .from("industry_knowledge")
    .select("*")
    .eq("business_id", businessId)
    .single();

  const status = {
    profile: Boolean(business?.name && business?.industry),
    hours: (hours?.length ?? 0) > 0,
    services: (services?.length ?? 0) > 0,
    scripts: Boolean(scripts?.greeting && scripts?.closing),
    knowledge: Boolean(knowledge?.content),
  };

  return new Response(
    JSON.stringify({
      ...status,
      complete: Object.values(status).every(Boolean),
    }),
    { status: 200 }
  );
}

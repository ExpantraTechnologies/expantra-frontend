import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/supabase/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { businessId } = req.query;

  // 1. Load business
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  // 2. Load hours
  const { data: hours } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId);

  // 3. Load services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId);

  // 4. Load scripts
  const { data: scripts } = await supabase
    .from("scripts")
    .select("*")
    .eq("business_id", businessId)
    .single();

  // 5. Load knowledge
  const { data: knowledge } = await supabase
    .from("industry_knowledge")
    .select("*")
    .eq("business_id", businessId)
    .single();

  const status = {
    profile: Boolean(business?.name && business?.industry),
    hours: hours?.length > 0,
    services: services?.length > 0,
    scripts: Boolean(scripts?.greeting && scripts?.closing),
    knowledge: Boolean(knowledge?.content),
  };

  return res.json({
    ...status,
    complete: Object.values(status).every(Boolean),
  });
}

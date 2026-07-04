import { Webhook } from "svix";
import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "iad1";
export const bodyParser = false;

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Missing Clerk webhook secret" }), {
      status: 500,
    });
  }

  // Read raw body
  const rawBody = await req.text();

  // Verify signature
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: any };
  try {
    evt = wh.verify(rawBody, {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    }) as { type: string; data: any };
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
    });
  }

  // Handle event
  if (evt.type === "user.created") {
    const user = evt.data;

    const userId = user.id;
    const email = user.email_addresses?.[0]?.email_address;

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: "Missing user data" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: userId,
        email,
        name: "",
        industry: "",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    console.log("Business created:", data.id);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

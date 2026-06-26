import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { supabase } from "@/supabase/client";

export const config = {
  api: {
    bodyParser: false, // Clerk requires raw body
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Missing Clerk webhook secret" });
  }

  // 1. Read raw body
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");

  // 2. Verify signature
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(rawBody, {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // 3. Handle event
  if (evt.type === "user.created") {
    const user = evt.data;

    const userId = user.id;
    const email = user.email_addresses?.[0]?.email_address;

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing user data" });
    }

    // 4. Create business in Supabase
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: userId,
        email,
        name: "",
        industry: ""
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error });
    }

    console.log("Business created:", data.id);
  }

  return res.status(200).json({ success: true });
}

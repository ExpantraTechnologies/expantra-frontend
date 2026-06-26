// notification-worker/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Optional: Twilio
const TWILIO_SID = Deno.env.get("TWILIO_SID");
const TWILIO_AUTH = Deno.env.get("TWILIO_AUTH");
const TWILIO_FROM = Deno.env.get("TWILIO_FROM");

// Optional: Email provider (Resend)
const RESEND_KEY = Deno.env.get("RESEND_API_KEY");

async function sendSMS(to: string, body: string) {
  if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_FROM) return false;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${TWILIO_SID}:${TWILIO_AUTH}`),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: TWILIO_FROM,
      To: to,
      Body: body
    })
  });

  return res.ok;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_KEY) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Expantra Notifications <notifications@expantra.ai>",
      to: [to],
      subject,
      html
    })
  });

  return res.ok;
}

serve(async () => {
  // 1. Fetch pending notifications
  const { data: pending, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("delivered", false)
    .lt("attempts", 5)
    .limit(20);

  if (error) {
    console.error("Fetch error:", error);
    return new Response("Error", { status: 500 });
  }

  for (const n of pending) {
    const payload = n.payload || {};
    const phone = payload.business_phone;
    const email = payload.business_email;

    let delivered = false;

    // 2. SMS
    if (phone) {
      const smsBody = `New notification: ${n.type}\nDetails: ${JSON.stringify(
        payload.details || {},
        null,
        2
      )}`;
      delivered = await sendSMS(phone, smsBody);
    }

    // 3. Email
    if (!delivered && email) {
      const html = `
        <h2>New Notification: ${n.type}</h2>
        <pre>${JSON.stringify(payload.details || {}, null, 2)}</pre>
      `;
      delivered = await sendEmail(email, `New Notification: ${n.type}`, html);
    }

    // 4. Update status
    await supabase
      .from("notifications")
      .update({
        delivered,
        attempts: n.attempts + 1,
        delivered_at: delivered ? new Date().toISOString() : null
      })
      .eq("id", n.id);
  }

  return new Response("OK", { status: 200 });
});

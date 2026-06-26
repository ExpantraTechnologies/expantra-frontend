import { NextResponse } from "next/server";
import { runAIReceptionist } from "@/lib/ai/receptionist";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      businessId,
      customerMessage,
      customerPhone,
      channel, // "sms" | "web" | "whatsapp"
    } = body;

    if (!businessId || !customerMessage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Pass message into the AI engine
    const aiResponse = await runAIReceptionist({
      businessId,
      customerMessage,
      customerPhone,
      channel,
    });

    return NextResponse.json({ reply: aiResponse });
  } catch (err) {
    console.error("AI Router Error:", err);
    return NextResponse.json(
      { error: "AI routing failed" },
      { status: 500 }
    );
  }
}

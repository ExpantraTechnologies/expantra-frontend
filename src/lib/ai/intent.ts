import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface IntentResult {
  intent:
    | "book"
    | "reschedule"
    | "cancel"
    | "ask_hours"
    | "ask_services"
    | "ask_pricing"
    | "greeting"
    | "smalltalk"
    | "unknown";

  serviceName?: string;
  date?: string;
  time?: string;
  appointmentId?: string;
}

export async function detectIntent(message: string): Promise<IntentResult> {
  const prompt = `
Classify the customer's message into an intent.

Message: "${message}"

Return a JSON object with:
- intent
- serviceName (if mentioned)
- date (if mentioned)
- time (if mentioned)
- appointmentId (if mentioned)

Valid intents:
- "book"
- "reschedule"
- "cancel"
- "ask_hours"
- "ask_services"
- "ask_pricing"
- "greeting"
- "smalltalk"
- "unknown"

Respond ONLY with valid JSON.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You classify customer intent." },
      { role: "user", content: prompt },
    ],
  });

  try {
    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch {
    return { intent: "unknown" };
  }
}

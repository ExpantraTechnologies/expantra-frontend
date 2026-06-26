import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ParsedDateTime {
  iso: string | null;
  date: string | null;
  time: string | null;
}

export async function parseNaturalDateTime(
  message: string
): Promise<ParsedDateTime> {
  const prompt = `
Extract a specific date and time from the customer's message.

Message: "${message}"

Return JSON with:
- iso: full ISO datetime (if possible)
- date: extracted date phrase
- time: extracted time phrase

If the message does not contain a valid date or time, return null values.

Respond ONLY with valid JSON.
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You convert natural language into ISO datetime." },
      { role: "user", content: prompt },
    ],
  });

  try {
    return JSON.parse(completion.choices[0].message.content || "{}");
  } catch {
    return { iso: null, date: null, time: null };
  }
}

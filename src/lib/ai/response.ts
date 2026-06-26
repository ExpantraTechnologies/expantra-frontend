import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateAIResponse({ message, context, channel }: any) {
  const prompt = buildPrompt(message, context);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an AI receptionist for a business." },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content;
}

function buildPrompt(message: string, context: any) {
  return `
The customer said: "${message}"

Business Settings:
${JSON.stringify(context.settings, null, 2)}

Hours:
${JSON.stringify(context.hours, null, 2)}

Closures:
${JSON.stringify(context.closures, null, 2)}

Services:
${JSON.stringify(context.services, null, 2)}

Appointments:
${JSON.stringify(context.appointments, null, 2)}

Customer:
${JSON.stringify(context.customer, null, 2)}

Respond in the business's tone, language, and persona.
Follow booking rules, availability, and hours.
If the business is closed, offer alternatives.
If the customer wants to book, check availability.
If the customer is new, collect missing info.
If the customer is returning, use their history.
`;
}

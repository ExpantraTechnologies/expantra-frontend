import { RestaurantOrchestrator } from "@/services/restaurantOrchestrator";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await RestaurantOrchestrator.handleIntent(body);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("Restaurant intent error", err);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
    });
  }
}

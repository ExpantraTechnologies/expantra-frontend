import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabaseClient";

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  // 1. Create a new business
  const { data: business, error: businessError } = await supabaseClient
    .from("businesses")
    .insert([{ name: "My Business" }])
    .select()
    .single();

  if (businessError) {
    return NextResponse.json({ success: false, error: businessError.message }, { status: 500 });
  }

  // 2. Link user → business
  const { error: linkError } = await supabaseClient
    .from("user_businesses")
    .insert([{ user_id: userId, business_id: business.id }]);

  if (linkError) {
    return NextResponse.json({ success: false, error: linkError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, business });
}

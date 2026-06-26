import { redirect } from "next/navigation";
import { getBusinessId } from "@/lib/getBusinessId";

export default async function DashboardPage() {
  // Step 6: Ensure the user has a business
  const businessId = await getBusinessId();

  // If no business exists yet → send user to onboarding
  if (!businessId) {
    redirect("/onboarding");
  }

  // If business exists → show your actual dashboard content
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h1>
      <p className="text-gray-600">Your business ID: {businessId}</p>

      {/* 
        Replace this placeholder with your real dashboard UI.
        Your global layout already handles sidebar + top bar.
      */}
    </div>
  );
}

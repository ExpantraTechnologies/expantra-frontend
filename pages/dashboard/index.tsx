import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { useConversations } from "@/hooks/api/useConversations";
import { useBusiness } from "@/hooks/api/useBusiness";

export default function DashboardHome() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  // ⭐ Clerk Authentication Check
  const { isLoaded, isSignedIn } = useUser();

  // Wait for Clerk to load
  if (!isLoaded) return null;

  // If not signed in → redirect to sign-in
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // ⭐ Onboarding Redirect Logic
  useEffect(() => {
    if (!businessId) return;

    const check = async () => {
      const res = await fetch(`/api/business/${businessId}/onboarding-status`);
      const status = await res.json();

      if (!status.complete) {
        router.push(`/onboarding?businessId=${businessId}`);
      }
    };

    check();
  }, [businessId]);

  // Fetch business + conversations
  const { data: business } = useBusiness(businessId);
  const { data: conversations } = useConversations(businessId);

  const recent = conversations?.slice(0, 5) || [];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back{business?.name ? `, ${business.name}` : ""}
        </h1>
        <p className="text-gray-600 mt-2">
          Here’s what’s happening in your business today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Conversations"
          value={conversations?.length || 0}
        />
        <StatCard
          title="New Today"
          value={conversations?.filter(c => isToday(c.created_at)).length || 0}
        />
        <StatCard
          title="Active Leads"
          value={conversations?.filter(c => c.intent !== "closed").length || 0}
        />
      </div>

      {/* Recent Conversations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>

        <div className="space-y-3">
          {recent.length === 0 && (
            <div className="text-gray-500">No conversations yet.</div>
          )}

          {recent.map((conv: any) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversations/${conv.id}?businessId=${businessId}`}
              className="block border rounded p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {conv.customer_name || "Unknown Customer"}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    {conv.last_message || "No messages yet"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {new Date(conv.updated_at).toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs px-2 py-1 bg-gray-200 rounded inline-block">
                    {conv.intent || "unknown"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href={`/dashboard/conversations?businessId=${businessId}`}
          className="inline-block mt-4 text-black font-medium hover:underline"
        >
          View all conversations →
        </Link>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickLink
            title="Business Profile"
            href={`/dashboard/settings/business?businessId=${businessId}`}
          />
          <QuickLink
            title="Services"
            href={`/dashboard/settings/services?businessId=${businessId}`}
          />
          <QuickLink
            title="Hours"
            href={`/dashboard/settings/hours?businessId=${businessId}`}
          />
          <QuickLink
            title="Scripts"
            href={`/dashboard/settings/scripts?businessId=${businessId}`}
          />
          <QuickLink
            title="Industry Knowledge"
            href={`/dashboard/settings/industry-knowledge?businessId=${businessId}`}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="border rounded p-6 bg-white shadow-sm">
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function QuickLink({ title, href }: any) {
  return (
    <Link
      href={href}
      className="block border rounded p-4 hover:bg-gray-50 transition"
    >
      <div className="font-medium">{title}</div>
      <div className="text-gray-600 text-sm mt-1">Manage settings</div>
    </Link>
  );
}

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

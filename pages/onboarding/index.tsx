import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function OnboardingPage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    const load = async () => {
      const res = await fetch(`/api/business/${businessId}/onboarding-status`);
      const data = await res.json();
      setStatus(data);
      setLoading(false);
    };

    load();
  }, [businessId]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading onboarding…</div>;
  }

  const steps = [
    { key: "profile", label: "Business Profile", href: `/dashboard/settings/business?businessId=${businessId}` },
    { key: "hours", label: "Business Hours", href: `/dashboard/settings/hours?businessId=${businessId}` },
    { key: "services", label: "Services", href: `/dashboard/settings/services?businessId=${businessId}` },
    { key: "scripts", label: "AI Scripts", href: `/dashboard/settings/scripts?businessId=${businessId}` },
    { key: "knowledge", label: "Industry Knowledge", href: `/dashboard/settings/industry-knowledge?businessId=${businessId}` }
  ];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Let’s set up your business</h1>

      <p className="text-gray-600 mb-8">
        Complete the steps below so your AI receptionist can operate with full accuracy.
      </p>

      <div className="space-y-4">
        {steps.map(step => (
          <a
            key={step.key}
            href={step.href}
            className="block border rounded p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium">{step.label}</div>
              <div
                className={`text-sm px-2 py-1 rounded ${
                  status[step.key] ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-700"
                }`}
              >
                {status[step.key] ? "Completed" : "Pending"}
              </div>
            </div>
          </a>
        ))}
      </div>

      {status.complete && (
        <button
          onClick={() => router.push(`/dashboard?businessId=${businessId}`)}
          className="mt-8 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Finish Onboarding
        </button>
      )}
    </div>
  );
}

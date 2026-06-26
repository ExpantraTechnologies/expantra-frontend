import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useScripts } from "@/hooks/api/useScripts";
import { useUpdateScripts } from "@/hooks/api/useUpdateScripts";

export default function ScriptsPage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: scripts, isLoading } = useScripts(businessId);
  const updateScripts = useUpdateScripts(businessId);

  const [form, setForm] = useState({
    greeting: "",
    closing: "",
    fallback: ""
  });

  // Load initial data
  useEffect(() => {
    if (scripts) {
      setForm({
        greeting: scripts.greeting || "",
        closing: scripts.closing || "",
        fallback: scripts.fallback || ""
      });
    }
  }, [scripts]);

  const handleChange = (e: any) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    await updateScripts.mutateAsync(form);
    alert("Scripts updated successfully");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading scripts…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">AI Scripts</h1>

      <div className="space-y-6">

        {/* Greeting */}
        <div>
          <label className="block text-sm font-medium mb-1">Greeting Script</label>
          <textarea
            name="greeting"
            value={form.greeting}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        {/* Closing */}
        <div>
          <label className="block text-sm font-medium mb-1">Closing Script</label>
          <textarea
            name="closing"
            value={form.closing}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        {/* Fallback */}
        <div>
          <label className="block text-sm font-medium mb-1">Fallback Script</label>
          <textarea
            name="fallback"
            value={form.fallback}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

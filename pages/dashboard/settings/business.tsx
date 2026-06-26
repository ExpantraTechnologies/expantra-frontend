import { useState, useEffect } from "react";
import { useBusiness } from "@/hooks/api/useBusiness";
import { useUpdateBusiness } from "@/hooks/api/useUpdateBusiness";
import { useRouter } from "next/router";

export default function BusinessProfilePage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: business, isLoading } = useBusiness(businessId);
  const updateBusiness = useUpdateBusiness(businessId);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    phone: "",
    email: "",
    website: "",
    serviceArea: "",
    timezone: "",
    tone: "",
    persona: "",
    pricingNotes: ""
  });

  // Load initial data into form
  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        industry: business.industry || "",
        phone: business.phone || "",
        email: business.email || "",
        website: business.website || "",
        serviceArea: business.serviceArea || "",
        timezone: business.timezone || "",
        tone: business.tone || "",
        persona: business.persona || "",
        pricingNotes: business.pricingNotes || ""
      });
    }
  }, [business]);

  const handleChange = (e: any) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    await updateBusiness.mutateAsync(form);
    alert("Business profile updated successfully");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading business profile…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Business Profile</h1>

      <div className="space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium mb-1">Industry</label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Service Area */}
        <div>
          <label className="block text-sm font-medium mb-1">Service Area</label>
          <input
            name="serviceArea"
            value={form.serviceArea}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <input
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium mb-1">AI Tone</label>
          <input
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Persona */}
        <div>
          <label className="block text-sm font-medium mb-1">AI Persona</label>
          <input
            name="persona"
            value={form.persona}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Pricing Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Pricing Notes</label>
          <textarea
            name="pricingNotes"
            value={form.pricingNotes}
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

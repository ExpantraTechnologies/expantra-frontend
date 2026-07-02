"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EditBusinessModal({ open, onClose, business, businessId }) {
  const [form, setForm] = useState({
    name: business.name,
    phone_number: business.phone_number,
    industry: business.industry,
    plan: business.plan,
    billing_status: business.billing_status,
    minutes_limit: business.minutes_limit,
    renewal_date: business.renewal_date,
    stripe_customer_id: business.stripe_customer_id,
    stripe_subscription_id: business.stripe_subscription_id,
    stripe_price_id: business.stripe_price_id,
  });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    await supabase.from("businesses").update(form).eq("id", businessId);
    onClose();
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px] space-y-4">
        <h2 className="text-xl font-semibold">Edit Business Info</h2>

        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium capitalize">
              {key.replace(/_/g, " ")}
            </label>
            <input
              className="border p-2 rounded"
              value={value || ""}
              onChange={(e) => updateField(key, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={save} className="px-4 py-2 bg-gray-900 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

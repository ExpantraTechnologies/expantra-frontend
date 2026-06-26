import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useHours } from "@/hooks/api/useHours";
import { useUpdateHours } from "@/hooks/api/useUpdateHours";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export default function HoursPage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: hours, isLoading } = useHours(businessId);
  const updateHours = useUpdateHours(businessId);

  const [form, setForm] = useState<any[]>([]);

  // Load initial hours into form
  useEffect(() => {
    if (hours) {
      setForm(
        hours.map((h: any) => ({
          day_of_week: h.day_of_week,
          open_time: h.open_time,
          close_time: h.close_time,
          closed: !h.open_time || !h.close_time
        }))
      );
    }
  }, [hours]);

  const handleChange = (index: number, field: string, value: string | boolean) => {
    setForm(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // If closed is toggled on, clear times
      if (field === "closed" && value === true) {
        updated[index].open_time = "";
        updated[index].close_time = "";
      }

      return updated;
    });
  };

  const handleSave = async () => {
    const payload = form.map(h => ({
      day_of_week: h.day_of_week,
      open_time: h.closed ? null : h.open_time,
      close_time: h.closed ? null : h.close_time
    }));

    await updateHours.mutateAsync(payload);
    alert("Hours updated successfully");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading hours…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Business Hours</h1>

      <div className="space-y-6">
        {form.map((day, index) => (
          <div key={day.day_of_week} className="border p-4 rounded">
            <h2 classname="text-lg font-medium mb-4">{DAYS[day.day_of_week]}</h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={e => handleChange(index, "closed", e.target.checked)}
                />
                Closed
              </label>
            </div>

            {!day.closed && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Open Time</label>
                  <input
                    type="time"
                    value={day.open_time || ""}
                    onChange={e => handleChange(index, "open_time", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Close Time</label>
                  <input
                    type="time"
                    value={day.close_time || ""}
                    onChange={e => handleChange(index, "close_time", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

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

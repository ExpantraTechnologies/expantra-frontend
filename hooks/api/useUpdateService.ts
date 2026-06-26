import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateService(businessId: string, serviceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`/api/business/${businessId}/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Failed to update service");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services", businessId] });
    }
  });
}

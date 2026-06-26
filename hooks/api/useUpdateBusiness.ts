import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateBusiness(businessId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`/api/business/${businessId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Failed to update business");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business", businessId] });
    }
  });
}

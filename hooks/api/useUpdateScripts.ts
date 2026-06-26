import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateScripts(businessId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`/api/business/${businessId}/scripts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Failed to update scripts");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scripts", businessId] });
    }
  });
}

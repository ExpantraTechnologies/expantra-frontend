import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateHours(businessId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (hours: any[]) => {
      const res = await fetch(`/api/business/${businessId}/hours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours })
      });
      if (!res.ok) throw new Error("Failed to update hours");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hours", businessId] });
    }
  });
}

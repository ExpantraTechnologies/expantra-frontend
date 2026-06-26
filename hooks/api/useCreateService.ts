import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateService(businessId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (service: any) => {
      const res = await fetch(`/api/business/${businessId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error("Failed to create service");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services", businessId] });
    }
  });
}

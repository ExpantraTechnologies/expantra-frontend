import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteService(businessId: string, serviceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/business/${businessId}/services/${serviceId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services", businessId] });
    }
  });
}

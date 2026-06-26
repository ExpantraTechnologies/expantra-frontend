import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateIndustryKnowledge(businessId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/business/${businessId}/industry-knowledge`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Failed to update industry knowledge");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["industryKnowledge", businessId] });
    }
  });
}

import { useQuery } from "@tanstack/react-query";

export function useIndustryKnowledge(businessId: string) {
  return useQuery({
    queryKey: ["industryKnowledge", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/industry-knowledge`);
      if (!res.ok) throw new Error("Failed to load industry knowledge");
      return res.json();
    },
    enabled: !!businessId
  });
}

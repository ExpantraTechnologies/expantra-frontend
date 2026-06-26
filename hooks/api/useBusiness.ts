import { useQuery } from "@tanstack/react-query";

export function useBusiness(businessId: string) {
  return useQuery({
    queryKey: ["business", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}`);
      if (!res.ok) throw new Error("Failed to load business");
      return res.json();
    },
    enabled: !!businessId
  });
}

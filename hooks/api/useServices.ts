import { useQuery } from "@tanstack/react-query";

export function useServices(businessId: string) {
  return useQuery({
    queryKey: ["services", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/services`);
      if (!res.ok) throw new Error("Failed to load services");
      return res.json();
    },
    enabled: !!businessId
  });
}

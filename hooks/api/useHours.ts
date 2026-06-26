import { useQuery } from "@tanstack/react-query";

export function useHours(businessId: string) {
  return useQuery({
    queryKey: ["hours", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/hours`);
      if (!res.ok) throw new Error("Failed to load hours");
      return res.json();
    },
    enabled: !!businessId
  });
}

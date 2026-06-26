import { useQuery } from "@tanstack/react-query";

export function useConversations(businessId: string) {
  return useQuery({
    queryKey: ["conversations", businessId],
    queryFn: async () => {
      const res = await fetch(`/api/business/${businessId}/conversations`);
      if (!res.ok) throw new Error("Failed to load conversations");
      return res.json();
    },
    enabled: !!businessId
  });
}

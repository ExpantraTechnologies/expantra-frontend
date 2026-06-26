import { useQuery } from "@tanstack/react-query";

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    },
    enabled: !!conversationId,
    refetchInterval: 3000 // auto-refresh every 3 seconds
  });
}

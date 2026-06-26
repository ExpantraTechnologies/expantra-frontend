import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", conversationId] });
    }
  });
}

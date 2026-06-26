import { useState } from "react";
import { useRouter } from "next/router";

import { useConversation } from "@/hooks/api/useConversation";
import { useMessages } from "@/hooks/api/useMessages";
import { useSendMessage } from "@/hooks/api/useSendMessage";

export default function SingleConversationPage() {
  const router = useRouter();
  const { conversationId, businessId } = router.query as {
    conversationId: string;
    businessId: string;
  };

  const { data: conversation, isLoading: loadingConversation } =
    useConversation(conversationId);

  const { data: messages, isLoading: loadingMessages } =
    useMessages(conversationId);

  const sendMessage = useSendMessage(conversationId);

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage.mutateAsync(input);
    setInput("");
  };

  if (loadingConversation || loadingMessages) {
    return <div className="p-6 text-gray-500">Loading conversation…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2">
        {conversation.customer_name || "Conversation"}
      </h1>

      <div className="text-gray-600 mb-6">
        Intent: <span className="font-medium">{conversation.intent}</span>
      </div>

      {/* Messages */}
      <div className="border rounded p-4 h-[500px] overflow-y-auto space-y-4 bg-gray-50">
        {messages?.map((msg: any) => (
          <div
            key={msg.id}
            className={`max-w-[70%] p-3 rounded ${
              msg.sender === "ai"
                ? "bg-black text-white ml-auto"
                : "bg-white border"
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-6 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          onClick={handleSend}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  );
}

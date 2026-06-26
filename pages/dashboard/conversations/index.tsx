import Link from "next/link";
import { useRouter } from "next/router";
import { useConversations } from "@/hooks/api/useConversations";

export default function ConversationsPage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: conversations, isLoading } = useConversations(businessId);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading conversations…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Conversations</h1>

      <div className="space-y-4">
        {conversations?.map((conv: any) => (
          <Link
            key={conv.id}
            href={`/dashboard/conversations/${conv.id}?businessId=${businessId}`}
            className="block border rounded p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-lg">
                  {conv.customer_name || "Unknown Customer"}
                </div>

                <div className="text-gray-600 text-sm mt-1">
                  {conv.last_message || "No messages yet"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {new Date(conv.updated_at).toLocaleString()}
                </div>

                <div className="mt-1 text-xs px-2 py-1 bg-gray-200 rounded inline-block">
                  {conv.intent || "unknown"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

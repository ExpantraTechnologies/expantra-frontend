import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useIndustryKnowledge } from "@/hooks/api/useIndustryKnowledge";
import { useUpdateIndustryKnowledge } from "@/hooks/api/useUpdateIndustryKnowledge";

export default function IndustryKnowledgePage() {
  const router = useRouter();
  const businessId = router.query.businessId as string;

  const { data: knowledge, isLoading } = useIndustryKnowledge(businessId);
  const updateKnowledge = useUpdateIndustryKnowledge(businessId);

  const [content, setContent] = useState("");

  // Load initial content
  useEffect(() => {
    if (knowledge) {
      setContent(knowledge.content || "");
    }
  }, [knowledge]);

  const handleSave = async () => {
    await updateKnowledge.mutateAsync(content);
    alert("Industry knowledge updated successfully");
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading industry knowledge…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Industry Knowledge</h1>

      <p className="text-gray-600 mb-4">
        This long‑form knowledge helps the AI understand your industry, terminology,
        workflows, customer expectations, and best practices. The more detailed this is,
        the smarter your AI becomes.
      </p>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full border rounded px-3 py-2 h-[400px] leading-relaxed"
        placeholder="Write detailed industry knowledge here..."
      />

      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Save Changes
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import BusinessOverview from "@/components/business/BusinessOverview";
import EditBusinessModal from "@/components/business/EditBusinessModal";

// Named exports — must use curly braces
import { BusinessServices } from "@/components/business/BusinessServices";
import { BusinessHours } from "@/components/business/BusinessHours";
import { BusinessClosures } from "@/components/business/BusinessClosures";
import { BusinessCustomers } from "@/components/business/BusinessCustomers";
import { BusinessAppointments } from "@/components/business/BusinessAppointments";

// Default exports — keep as-is
import BusinessFAQs from "@/components/business/BusinessFAQs";
import BusinessScripts from "@/components/business/BusinessScripts";
import BusinessIndustryKnowledge from "@/components/business/BusinessIndustryKnowledge";
import BusinessCallLogs from "@/components/business/BusinessCallLogs";
import BusinessMessageLogs from "@/components/business/BusinessMessageLogs";
import BusinessUsage from "@/components/business/BusinessUsage";
import BusinessBilling from "@/components/business/BusinessBilling";
import BusinessTrainingData from "@/components/business/BusinessTrainingData";

export default function BusinessPage({ params }: { params: { id: string } }) {
  const businessId = params.id;

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single();

      if (error) console.error(error);
      else setBusiness(data);

      setLoading(false);
    };

    fetchBusiness();
  }, [businessId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!business) return <p className="p-6">Business not found.</p>;

  return (
    <div className="flex flex-col">
      <BusinessOverview business={business} onEdit={() => setEditOpen(true)} />

      <div className="flex mt-6">
        <aside
          className="
            w-[320px] 
            bg-gray-900 
            text-white 
            border-r border-gray-800 
            py-6 
            sticky 
            top-[200px]
            h-fit
          "
        >
          <nav className="flex flex-col space-y-2 px-4">
            {[
              ["services", "🛠️ Services"],
              ["hours", "⏰ Hours of Operation"],
              ["closures", "🚫 Closures / Exceptions"],
              ["faqs", "❓ FAQs"],
              ["scripts", "🗣️ Scripts"],
              ["industry", "📘 Industry Knowledge"],
              ["customers", "👤 Customers"],
              ["appointments", "📅 Appointments"],
              ["calls", "📞 Call Logs"],
              ["messages", "💬 Message Logs"],
              ["usage", "📊 Usage"],
              ["billing", "💳 Billing"],
              ["training", "🧠 Training Data"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  text-left px-3 py-2 rounded-md
                  ${activeTab === key ? "bg-gray-800" : "hover:bg-gray-700"}
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === "services" && (
            <BusinessServices businessId={businessId} />
          )}
          {activeTab === "hours" && <BusinessHours businessId={businessId} />}
          {activeTab === "closures" && (
            <BusinessClosures businessId={businessId} />
          )}
          {activeTab === "faqs" && <BusinessFAQs businessId={businessId} />}
          {activeTab === "scripts" && (
            <BusinessScripts businessId={businessId} />
          )}
          {activeTab === "industry" && (
            <BusinessIndustryKnowledge businessId={businessId} />
          )}
          {activeTab === "customers" && (
            <BusinessCustomers businessId={businessId} />
          )}
          {activeTab === "appointments" && (
            <BusinessAppointments businessId={businessId} />
          )}
          {activeTab === "calls" && (
            <BusinessCallLogs businessId={businessId} />
          )}
          {activeTab === "messages" && (
            <BusinessMessageLogs businessId={businessId} />
          )}
          {activeTab === "usage" && <BusinessUsage businessId={businessId} />}
          {activeTab === "billing" && (
            <BusinessBilling businessId={businessId} />
          )}
          {activeTab === "training" && (
            <BusinessTrainingData businessId={businessId} />
          )}
        </main>
      </div>

      <EditBusinessModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        business={business}
        businessId={businessId}
      />
    </div>
  );
}

// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // FIX: auth() must be awaited
  const session = await auth();
  const userId = session?.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can add dashboard-specific layout elements here */}
      {children}
    </div>
  );
}

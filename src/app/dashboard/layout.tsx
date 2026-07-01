import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = auth();

  // If not logged in, Clerk will automatically redirect to /sign-in
  if (!userId) return null;

  return <>{children}</>;
}

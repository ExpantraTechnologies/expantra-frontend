import { LastSyncStatus } from "@/components/LastSyncStatus";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Welcome to Expantra</h1>
      <p className="text-gray-600 mt-2">
        Use the sidebar to navigate through your dashboard.
      </p>

      {/* Last Sync Status */}
      <div className="mt-6">
        <LastSyncStatus />
      </div>
    </div>
  );
}

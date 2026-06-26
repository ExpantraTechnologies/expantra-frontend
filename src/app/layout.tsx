import "./globals.css";
import { ReactNode } from "react";
import { ClerkProvider, UserButton } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-50 flex">

          {/* Sidebar */}
          <aside className="w-64 bg-white border-r p-4">
            <h1 className="text-xl font-semibold mb-6">Expantra</h1>
            <nav className="space-y-3">
              <a className="block text-gray-700 hover:text-black" href="/">
                Dashboard
              </a>
              <a className="block text-gray-700 hover:text-black" href="/clients">
                Clients
              </a>
              <a className="block text-gray-700 hover:text-black" href="/analytics">
                Analytics
              </a>
              <a className="block text-gray-700 hover:text-black" href="/settings">
                Settings
              </a>
            </nav>
          </aside>

          {/* Main content with top bar */}
          <main className="flex-1 flex flex-col">

            {/* Top Navigation */}
            <header className="w-full h-16 border-b flex items-center justify-between px-6 bg-white">
              <h2 className="text-lg font-medium">Dashboard</h2>

              <div className="flex items-center gap-4">
                <button className="text-sm px-3 py-1.5 rounded-md border">
                  Notifications
                </button>

                {/* Clerk User Button */}
                <UserButton afterSignOutUrl="/sign-in" />
              </div>
            </header>

            {/* Page Content */}
            <div className="p-8">
              {children}
            </div>

          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}

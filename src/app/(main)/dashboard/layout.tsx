/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: Dashboard layout, handles what to shown and when to show.
*/

import { Sidebar } from "@/components/dashboard/Sidebar"
import { MobileNavbar } from "@/components/dashboard/MobileNavbar"
import { FloatingChatBot } from "@/components/FloatingChatBot"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex md:w-64 md:flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background pb-10">
          <div className="container mx-auto px-6 py-8">
            {children}
            <FloatingChatBot />
          </div>
        </main>
        <MobileNavbar />
      </div>
    </div>
  )
}

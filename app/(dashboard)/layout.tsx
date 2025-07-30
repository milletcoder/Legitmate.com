import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader as MainHeader } from "@/components/dashboard/main-header"
import { LegalEagleCopilot } from "@/components/ai/legal-eagle-copilot"
import { NotificationCenter } from "@/components/notifications/notification-center"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <MainHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <LegalEagleCopilot />
      <NotificationCenter />
    </div>
  )
}

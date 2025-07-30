import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your Legal Eagle command center" />
      <DashboardOverview />
    </DashboardShell>
  )
}

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Comprehensive insights into your compliance performance" />
      <AnalyticsDashboard />
    </DashboardShell>
  )
}

import { ComplianceCenter } from "@/components/compliance/compliance-center"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function CompliancePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Compliance Center" text="Stay on top of all your regulatory requirements" />
      <ComplianceCenter />
    </DashboardShell>
  )
}

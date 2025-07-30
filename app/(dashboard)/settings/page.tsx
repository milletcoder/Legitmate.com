import { SettingsManager } from "@/components/settings/settings-manager"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Customize your Legal Eagle experience" />
      <SettingsManager />
    </DashboardShell>
  )
}

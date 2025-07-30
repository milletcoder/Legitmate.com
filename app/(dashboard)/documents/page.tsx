import { DocumentsManager } from "@/components/documents/documents-manager"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DocumentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Documents" text="Manage your GST notices and AI-generated responses" />
      <DocumentsManager />
    </DashboardShell>
  )
}

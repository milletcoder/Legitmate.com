"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { AINoticeResponder } from "@/components/ai-notice-responder"
import { ComplianceCalendar } from "@/components/compliance-calendar"

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

function KPICard({ title, value, icon, trend }: KPICardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-primary mt-2">{value}</p>
            {trend && <p className="text-sm text-accent mt-1">{trend}</p>}
          </div>
          <div className="text-primary opacity-60">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSection() {
  return (
    <section className="py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 font-inter">Legal Eagle Dashboard</h1>
          <p className="text-text-secondary font-lora">Your AI-powered GST compliance command center</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Drafts Generated" value="127" icon={<FileText size={24} />} trend="+23% this month" />
          <KPICard title="Compliance Score" value="98%" icon={<CheckCircle size={24} />} trend="Excellent" />
          <KPICard title="Upcoming Deadlines" value="3" icon={<AlertCircle size={24} />} trend="Next: GSTR-3B" />
          <KPICard title="Time Saved" value="45h" icon={<ArrowRight size={24} />} trend="This quarter" />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Notice Responder - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <AINoticeResponder />
          </div>

          {/* Compliance Calendar - Takes up 1 column */}
          <div className="lg:col-span-1">
            <ComplianceCalendar />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  CheckCircle,
  Users,
  BarChart3,
  Zap,
  Shield,
  Target,
} from "lucide-react"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { ComplianceCalendarWidget } from "@/components/dashboard/compliance-calendar-widget"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { useAuth } from "@/hooks/use-auth"
import { useAnalytics } from "@/hooks/use-analytics"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
    period: string
  }
  icon: React.ReactNode
  description?: string
  color?: "default" | "success" | "warning" | "danger"
}

function MetricCard({ title, value, change, icon, description, color = "default" }: MetricCardProps) {
  const colorClasses = {
    default: "text-primary",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${colorClasses[color]} opacity-70`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {change.type === "increase" ? (
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
            )}
            <span className={change.type === "increase" ? "text-green-600" : "text-red-600"}>
              {change.value > 0 ? "+" : ""}
              {change.value}%
            </span>
            <span className="ml-1">{change.period}</span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function DashboardOverview() {
  const { user } = useAuth()
  const { data: analytics, isLoading } = useAnalytics()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 17) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const metrics = [
    {
      title: "Documents Processed",
      value: analytics?.documentsProcessed || 127,
      change: { value: 23, type: "increase" as const, period: "this month" },
      icon: <FileText className="h-4 w-4" />,
      description: "Total GST notices processed",
      color: "success" as const,
    },
    {
      title: "Compliance Score",
      value: `${analytics?.complianceScore || 98}%`,
      change: { value: 2, type: "increase" as const, period: "this week" },
      icon: <Shield className="h-4 w-4" />,
      description: "Overall compliance rating",
      color: "success" as const,
    },
    {
      title: "Upcoming Deadlines",
      value: analytics?.upcomingDeadlines || 3,
      icon: <Clock className="h-4 w-4" />,
      description: "Next: GSTR-3B due in 5 days",
      color: "warning" as const,
    },
    {
      title: "Time Saved",
      value: `${analytics?.timeSaved || 45}h`,
      change: { value: 15, type: "increase" as const, period: "this quarter" },
      icon: <Zap className="h-4 w-4" />,
      description: "Automated processing time",
      color: "default" as const,
    },
    {
      title: "Success Rate",
      value: `${analytics?.successRate || 99.7}%`,
      change: { value: 0.3, type: "increase" as const, period: "all time" },
      icon: <Target className="h-4 w-4" />,
      description: "AI response accuracy",
      color: "success" as const,
    },
    {
      title: "Team Members",
      value: analytics?.teamMembers || 4,
      icon: <Users className="h-4 w-4" />,
      description: "Active users this month",
      color: "default" as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.firstName || "there"}! 👋
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your GST compliance today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your compliance activity over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Compliance Calendar Widget */}
        <div>
          <ComplianceCalendarWidget />
        </div>

        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <RecentDocuments />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Compliance Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Compliance Health
          </CardTitle>
          <CardDescription>Your overall compliance status and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GST Returns</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Excellent
                </Badge>
              </div>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground">All returns filed on time</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Notice Responses</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Good
                </Badge>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">2 pending responses</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Documentation</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Needs Attention
                </Badge>
              </div>
              <Progress value={72} className="h-2" />
              <p className="text-xs text-muted-foreground">Update 3 documents</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Compliance Score: 98%</p>
                <p className="text-sm text-blue-700">You're doing great! Keep up the excellent work.</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

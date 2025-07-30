"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Search,
  Upload,
  Calendar,
  Shield,
  BarChart3,
  Users,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  action: () => void
  badge?: string
}

interface QuickStat {
  label: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
}

const quickActions: QuickAction[] = [
  {
    id: "new-document",
    title: "New Document",
    description: "Create a new legal document",
    icon: FileText,
    color: "text-blue-600",
    action: () => console.log("New document"),
    badge: "Popular",
  },
  {
    id: "upload-file",
    title: "Upload File",
    description: "Upload and analyze documents",
    icon: Upload,
    color: "text-green-600",
    action: () => console.log("Upload file"),
  },
  {
    id: "schedule-review",
    title: "Schedule Review",
    description: "Set up document review",
    icon: Calendar,
    color: "text-purple-600",
    action: () => console.log("Schedule review"),
  },
  {
    id: "compliance-check",
    title: "Compliance Check",
    description: "Run compliance analysis",
    icon: Shield,
    color: "text-orange-600",
    action: () => console.log("Compliance check"),
    badge: "AI",
  },
  {
    id: "generate-report",
    title: "Generate Report",
    description: "Create analytics report",
    icon: BarChart3,
    color: "text-indigo-600",
    action: () => console.log("Generate report"),
  },
  {
    id: "search-cases",
    title: "Search Cases",
    description: "Find relevant case law",
    icon: Search,
    color: "text-teal-600",
    action: () => console.log("Search cases"),
  },
]

const quickStats: QuickStat[] = [
  {
    label: "Documents Processed",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: FileText,
  },
  {
    label: "Compliance Score",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: Shield,
  },
  {
    label: "Active Cases",
    value: "23",
    change: "-1",
    trend: "down",
    icon: Users,
  },
  {
    label: "Pending Reviews",
    value: "8",
    change: "+3",
    trend: "up",
    icon: Clock,
  },
]

const recentActivity = [
  {
    id: "1",
    action: "Document analyzed",
    description: "Contract ABC-123 risk assessment completed",
    timestamp: "2 minutes ago",
    status: "success",
  },
  {
    id: "2",
    action: "Compliance alert",
    description: "GDPR review required for Project Delta",
    timestamp: "15 minutes ago",
    status: "warning",
  },
  {
    id: "3",
    action: "Report generated",
    description: "Monthly compliance report ready for review",
    timestamp: "1 hour ago",
    status: "success",
  },
  {
    id: "4",
    action: "Deadline reminder",
    description: "Contract renewal due in 3 days",
    timestamp: "2 hours ago",
    status: "warning",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-success" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />
    case "error":
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getTrendIcon = (trend: QuickStat["trend"]) => {
  switch (trend) {
    case "up":
      return "↗"
    case "down":
      return "↘"
    case "neutral":
    default:
      return "→"
  }
}

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p
                    className={`text-sm flex items-center ${
                      stat.trend === "up"
                        ? "text-success"
                        : stat.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    <span className="mr-1">{getTrendIcon(stat.trend)}</span>
                    {stat.change}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start text-left relative bg-transparent"
                  onClick={action.action}
                >
                  {action.badge && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      {action.badge}
                    </Badge>
                  )}
                  <action.icon className={`h-6 w-6 mb-2 ${action.color}`} />
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

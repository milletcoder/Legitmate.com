"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ComplianceCalendarWidget } from "@/components/dashboard/compliance-calendar-widget"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { StatsCounter } from "@/components/ui/stats-counter"
import { useAuth } from "@/components/providers/auth-provider" // Ensure this import is correct
import { useAnalytics } from "@/hooks/use-analytics" // Assuming this hook exists and is client-side
import { Download, Filter, RefreshCw } from "lucide-react"

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const { analyticsData, isLoading, error } = useAnalytics()

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading analytics: {error.message}</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Analytics Overview {user?.firstName ? `for ${user.firstName}` : ""}
          </h1>
          <p className="text-muted-foreground">Comprehensive insights into your legal operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value="6m" onValueChange={() => {}}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCounter label="Total Documents" value={analyticsData.totalDocuments} />
        <StatsCounter label="Compliance Rate" value={`${analyticsData.complianceRate}%`} />
        <StatsCounter label="Pending Tasks" value={analyticsData.pendingTasks} />
        <StatsCounter label="AI Usage" value={`${analyticsData.aiUsage}%`} />
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="ai">AI Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Document Processing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={analyticsData.documentProcessingData} />
              </CardContent>
            </Card>

            {/* Compliance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart data={analyticsData.complianceTrendData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>

            {/* Compliance Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplianceCalendarWidget />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* Recent Document Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Document Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentDocuments documents={analyticsData.recentDocuments} />
            </CardContent>
          </Card>
          {/* Add more document-specific analytics here */}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Details */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed compliance reports coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {/* AI Assistant Usage */}
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p>AI usage statistics coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

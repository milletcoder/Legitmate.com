"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Clock, Download, Filter, RefreshCw, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAuth } from "@/components/providers/auth-provider" // Corrected import path
import { StatsCounter } from "@/components/ui/stats-counter"
import { useToast } from "@/hooks/use-toast"

const analyticsData = {
  totalDocuments: "1,247",
  complianceRate: "96.8",
  pendingTasks: "15",
  aiUsage: "78",
  documentProcessingData: [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 135 },
    { month: "Mar", value: 148 },
    { month: "Apr", value: 162 },
    { month: "May", value: 178 },
    { month: "Jun", value: 195 },
  ],
  complianceTrendData: [
    { month: "Jan", value: 95 },
    { month: "Feb", value: 97 },
    { month: "Mar", value: 94 },
    { month: "Apr", value: 98 },
    { month: "May", value: 96 },
    { month: "Jun", value: 99 },
  ],
  recentDocuments: [
    { id: "1", name: "Employment Contract Template", views: 234, downloads: 89 },
    { id: "2", name: "NDA Agreement", views: 198, downloads: 76 },
    { id: "3", name: "Service Agreement", views: 167, downloads: 54 },
    { id: "4", name: "Privacy Policy Template", views: 145, downloads: 43 },
    { id: "5", name: "Terms of Service", views: 123, downloads: 38 },
  ],
  complianceMetrics: [
    { name: "GDPR", score: 98, target: 95, status: "excellent" },
    { name: "SOX", score: 95, target: 90, status: "good" },
    { name: "HIPAA", score: 92, target: 95, status: "warning" },
    { name: "PCI DSS", score: 97, target: 95, status: "excellent" },
    { name: "ISO 27001", score: 89, target: 90, status: "warning" },
  ],
  riskAssessment: [
    { category: "High Risk", value: 12, color: "#ef4444" },
    { category: "Medium Risk", value: 28, color: "#f59e0b" },
    { category: "Low Risk", value: 45, color: "#10b981" },
    { category: "No Risk", value: 78, color: "#6b7280" },
  ],
  userActivity: [
    { hour: "00", active: 12 },
    { hour: "04", active: 8 },
    { hour: "08", active: 45 },
    { hour: "12", active: 67 },
    { hour: "16", active: 52 },
    { hour: "20", active: 23 },
  ],
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6m")
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null)
  const { user } = useAuth() // Using the consolidated useAuth hook
  // const { analyticsData, isLoading, error } = useAnalytics() // Uncomment if useAnalytics is fully implemented

  const [mdTestResult, setMdTestResult] = useState<string>("")
  const [testingMd, setTestingMd] = useState(false)

  async function testMotherDuck() {
    setTestingMd(true)
    setMdTestResult("")
    try {
      const res = await fetch("/api/motherduck/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sql: "select 42 as answer" }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMdTestResult(`Error: ${data?.error || "Unknown error"}`)
      } else {
        setMdTestResult(`Connected: ${data.connected ? "yes" : "no"} | Rows: ${JSON.stringify(data.rows)}`)
      }
    } catch (e: any) {
      setMdTestResult(`Exception: ${e?.message || String(e)}`)
    } finally {
      setTestingMd(false)
    }
  }

  // Mock data for demonstration purposes
  const isLoading = false // Set to true if fetching real data
  const error = null // Set to an Error object if there's an error

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success"
      case "good":
        return "text-info"
      case "warning":
        return "text-warning"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "warning":
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  function handleFilterClick() {
    toast({
      title: "Filters",
      description: "Filter controls will appear here. Showing all data for now.",
    })
  }

  function toCSV(rows: any[]): string {
    if (!rows.length) return ""
    const headers = Object.keys(rows[0])
    const lines = [headers.join(",")]
    for (const row of rows) {
      lines.push(headers.map((h) => JSON.stringify((row as any)[h] ?? "")).join(","))
    }
    return lines.join("\n")
  }

  function handleExportClick() {
    const rows = [
      { metric: "Total Documents", value: analyticsData.totalDocuments },
      { metric: "Compliance Rate", value: analyticsData.complianceRate },
      { metric: "Pending Tasks", value: analyticsData.pendingTasks },
      { metric: "AI Usage", value: analyticsData.aiUsage },
    ]
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "CSV download has started." })
  }

  function handleRefreshClick() {
    setLastRefreshedAt(new Date())
    toast({ title: "Refreshed", description: "Analytics were refreshed." })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading analytics: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your legal operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Button variant="outline" size="sm" onClick={handleFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportClick}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleRefreshClick}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={testMotherDuck} disabled={testingMd}>
            {testingMd ? "Testing..." : "Test Data Source"}
          </Button>
        </div>
      </div>

      {lastRefreshedAt && (
        <div className="text-xs text-muted-foreground -mt-4">
          Last refreshed at {lastRefreshedAt.toLocaleTimeString()}
        </div>
      )}

      {mdTestResult && (
        <div className="text-xs text-muted-foreground -mt-2">{mdTestResult}</div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCounter label="Total Documents" value={analyticsData.totalDocuments} />
        <StatsCounter label="Compliance Rate" value={`${analyticsData.complianceRate}%`} />
        <StatsCounter label="Pending Tasks" value={analyticsData.pendingTasks} />
        <StatsCounter label="AI Usage" value={`${analyticsData.aiUsage}%`} />
      </div>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.documentProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analyticsData.riskAssessment}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.riskAssessment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {analyticsData.riskAssessment.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <Badge variant="outline">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analyticsData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="active" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.complianceMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(metric.status)}
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {metric.score}% / {metric.target}%
                        </span>
                        <Badge
                          variant={
                            metric.status === "excellent" || metric.status === "good" ? "default" : "destructive"
                          }
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.complianceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Processing */}
            <Card>
              <CardHeader>
                <CardTitle>Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.documentProcessingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentDocuments.map((doc, index) => (
                    <div key={doc.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {doc.views} views
                          </span>
                          <span className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {doc.downloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="active" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="active" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

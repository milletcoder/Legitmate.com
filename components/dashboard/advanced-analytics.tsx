"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChartIcon,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  Zap,
} from "lucide-react"
import {
  KPIService,
  type KPIMetric,
  type UserBehaviorMetrics,
  type SystemPerformanceMetrics,
  type BusinessMetrics,
} from "@/lib/analytics/kpi-service"
import { useToast } from "@/hooks/use-toast"

interface AdvancedAnalyticsProps {
  className?: string
}

export function AdvancedAnalytics({ className }: AdvancedAnalyticsProps) {
  const [kpis, setKpis] = useState<KPIMetric[]>([])
  const [userBehavior, setUserBehavior] = useState<UserBehaviorMetrics | null>(null)
  const [systemPerformance, setSystemPerformance] = useState<SystemPerformanceMetrics | null>(null)
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const { toast } = useToast()

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedTimeRange, selectedCategory])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)

      // Load KPIs
      const allKpis = KPIService.getKPIs(selectedCategory === "all" ? undefined : selectedCategory)
      setKpis(allKpis)

      // Load user behavior metrics
      const userMetrics = await KPIService.getUserBehaviorMetrics()
      setUserBehavior(userMetrics)

      // Load system performance metrics
      const perfMetrics = await KPIService.getSystemPerformanceMetrics()
      setSystemPerformance(perfMetrics)

      // Load business metrics
      const bizMetrics = await KPIService.getBusinessMetrics()
      setBusinessMetrics(bizMetrics)
    } catch (error) {
      console.error("Failed to load analytics data:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportReport = async (format: "csv" | "xlsx" | "pdf") => {
    try {
      const reportData = await KPIService.generateReport({
        type: "detailed",
        metrics: kpis.map((k) => k.id),
        timeRange: dateRange,
        groupBy: "day",
      })

      const exportResult = await KPIService.exportReport(reportData, format)

      toast({
        title: "Export Complete",
        description: `Report exported as ${exportResult.filename}`,
      })

      // Trigger download
      const link = document.createElement("a")
      link.href = exportResult.url
      link.download = exportResult.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export report",
        variant: "destructive",
      })
    }
  }

  const formatNumber = (value: number, unit: string) => {
    if (unit === "percentage") {
      return `${value.toFixed(1)}%`
    } else if (unit === "currency") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value)
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  // Chart data preparation
  const performanceChartData = systemPerformance
    ? [
        { name: "Response Time", value: systemPerformance.responseTime.average, target: 200 },
        { name: "Throughput", value: systemPerformance.throughput.requestsPerSecond, target: 200 },
        { name: "CPU Usage", value: systemPerformance.resourceUsage.cpu, target: 80 },
        { name: "Memory Usage", value: systemPerformance.resourceUsage.memory, target: 85 },
      ]
    : []

  const userJourneyData = userBehavior?.userJourney || []

  const featureUsageData = userBehavior
    ? Object.entries(userBehavior.featureUsage).map(([feature, data]) => ({
        name: feature.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        users: data.users,
        sessions: data.sessions,
        timeSpent: data.timeSpent,
      }))
    : []

  const revenueData = businessMetrics
    ? [
        { name: "Total Revenue", value: businessMetrics.revenue.total, color: "#0C2242" },
        { name: "Recurring Revenue", value: businessMetrics.revenue.recurring, color: "#1D8F6E" },
      ]
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your business performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => loadAnalyticsData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" onClick={() => exportReport("xlsx")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="premium-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
              {getTrendIcon(kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatNumber(kpi.value, kpi.unit)}</div>
              <div className="flex items-center justify-between mt-2">
                <div className={`text-xs ${getChangeColor(kpi.change)}`}>
                  {kpi.changePercent > 0 ? "+" : ""}
                  {kpi.changePercent.toFixed(1)}% from last period
                </div>
                {kpi.target && (
                  <Badge variant="outline" className="text-xs">
                    Target: {formatNumber(kpi.target, kpi.unit)}
                  </Badge>
                )}
              </div>
              {kpi.target && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Behavior
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Performance Chart */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  System Performance
                </CardTitle>
                <CardDescription>Current vs target performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0C2242" />
                    <Bar dataKey="target" fill="#1D8F6E" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Error Rates */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Error Distribution
                </CardTitle>
                <CardDescription>Breakdown of error types</CardDescription>
              </CardHeader>
              <CardContent>
                {systemPerformance && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(systemPerformance.errorRates.byType).map(([type, rate]) => ({
                          name: type,
                          value: rate,
                          fill: type === "4xx" ? "#F59E0B" : type === "5xx" ? "#EF4444" : "#6B7280",
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {Object.entries(systemPerformance.errorRates.byType).map((entry, index) => (
                          <Cell key={`cell-${index}`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Grid */}
          {systemPerformance && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold">{systemPerformance.responseTime.average}ms</p>
                    </div>
                    <Clock className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Throughput</p>
                      <p className="text-2xl font-bold">{systemPerformance.throughput.requestsPerSecond}/s</p>
                    </div>
                    <Zap className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold">{systemPerformance.uptime}%</p>
                    </div>
                    <Activity className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">{systemPerformance.errorRates.total}%</p>
                    </div>
                    <Target className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Journey Funnel */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Journey Funnel
                </CardTitle>
                <CardDescription>User progression through key steps</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userJourneyData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="step" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#0C2242" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5 text-primary" />
                  Feature Usage
                </CardTitle>
                <CardDescription>Most popular features by user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={featureUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="users" name="Users" />
                    <YAxis dataKey="timeSpent" name="Time Spent" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter dataKey="sessions" fill="#1D8F6E" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Behavior Metrics */}
          {userBehavior && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily</span>
                    <span className="font-semibold">{userBehavior.activeUsers.daily.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weekly</span>
                    <span className="font-semibold">{userBehavior.activeUsers.weekly.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly</span>
                    <span className="font-semibold">{userBehavior.activeUsers.monthly.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Session Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Duration</span>
                    <span className="font-semibold">{userBehavior.sessionMetrics.averageDuration}m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bounce Rate</span>
                    <span className="font-semibold">{userBehavior.sessionMetrics.bounceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pages/Session</span>
                    <span className="font-semibold">{userBehavior.sessionMetrics.pagesPerSession}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-lg">Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(userBehavior.featureUsage)
                      .slice(0, 3)
                      .map(([feature, data]) => (
                        <div key={feature} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground capitalize">{feature.replace("_", " ")}</span>
                          <span className="font-semibold">{data.users}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Revenue Breakdown
                </CardTitle>
                <CardDescription>Total vs recurring revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${(value as number).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Customer Metrics
                </CardTitle>
                <CardDescription>Key customer performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {businessMetrics && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Total Customers</span>
                      <span className="text-lg font-bold">{businessMetrics.customers.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">New Customers</span>
                      <span className="text-lg font-bold text-green-600">+{businessMetrics.customers.new}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Churn Rate</span>
                      <span className="text-lg font-bold text-red-600">{businessMetrics.customers.churn}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Customer LTV</span>
                      <span className="text-lg font-bold">₹{businessMetrics.customers.ltv.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Business KPIs */}
          {businessMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
                      <p className="text-2xl font-bold text-green-600">+{businessMetrics.revenue.growth}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600 opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{businessMetrics.conversion.signupRate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">NPS Score</p>
                      <p className="text-2xl font-bold">{businessMetrics.satisfaction.nps}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CSAT Score</p>
                      <p className="text-2xl font-bold">{businessMetrics.satisfaction.csat}/5</p>
                    </div>
                    <Eye className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                KPI Trends Over Time
              </CardTitle>
              <CardDescription>Historical performance of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={KPIService.getKPITrends("documents_processed", dateRange)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, "Documents Processed"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0C2242"
                    strokeWidth={2}
                    dot={{ fill: "#0C2242", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Health Score */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Overall Health Score
              </CardTitle>
              <CardDescription>Comprehensive performance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const healthScore = KPIService.calculateHealthScore()
                return (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">{healthScore.overall}/100</div>
                      <Badge
                        variant={
                          healthScore.overall >= 80
                            ? "default"
                            : healthScore.overall >= 60
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-sm"
                      >
                        {healthScore.overall >= 80
                          ? "Excellent"
                          : healthScore.overall >= 60
                            ? "Good"
                            : "Needs Improvement"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(healthScore.byCategory).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm font-bold">{score}/100</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`rounded-full h-2 transition-all duration-300 ${
                                score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {healthScore.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Recommendations:</h4>
                        <ul className="space-y-1">
                          {healthScore.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

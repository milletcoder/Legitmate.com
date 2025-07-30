"use client"

import { useState } from "react"
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
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Shield,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

const analyticsData = [
  { month: "Jan", documents: 120, users: 45, compliance: 95, revenue: 12500 },
  { month: "Feb", documents: 135, users: 52, compliance: 97, revenue: 14200 },
  { month: "Mar", documents: 148, users: 48, compliance: 94, revenue: 13800 },
  { month: "Apr", documents: 162, users: 58, compliance: 98, revenue: 16100 },
  { month: "May", documents: 178, users: 63, compliance: 96, revenue: 17500 },
  { month: "Jun", documents: 195, users: 71, compliance: 99, revenue: 19200 },
]

const complianceMetrics = [
  { name: "GDPR", score: 98, target: 95, status: "excellent" },
  { name: "SOX", score: 95, target: 90, status: "good" },
  { name: "HIPAA", score: 92, target: 95, status: "warning" },
  { name: "PCI DSS", score: 97, target: 95, status: "excellent" },
  { name: "ISO 27001", score: 89, target: 90, status: "warning" },
]

const riskAssessment = [
  { category: "High Risk", value: 12, color: "#ef4444" },
  { category: "Medium Risk", value: 28, color: "#f59e0b" },
  { category: "Low Risk", value: 45, color: "#10b981" },
  { category: "No Risk", value: 78, color: "#6b7280" },
]

const userActivity = [
  { hour: "00", active: 12 },
  { hour: "04", active: 8 },
  { hour: "08", active: 45 },
  { hour: "12", active: 67 },
  { hour: "16", active: 52 },
  { hour: "20", active: 23 },
]

const topDocuments = [
  { name: "Employment Contract Template", views: 234, downloads: 89 },
  { name: "NDA Agreement", views: 198, downloads: 76 },
  { name: "Service Agreement", views: 167, downloads: 54 },
  { name: "Privacy Policy Template", views: 145, downloads: 43 },
  { name: "Terms of Service", views: 123, downloads: 38 },
]

const kpiMetrics = [
  {
    title: "Total Documents",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
    description: "Documents processed this month",
  },
  {
    title: "Active Users",
    value: "71",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "Monthly active users",
  },
  {
    title: "Compliance Score",
    value: "96.8%",
    change: "+2.1%",
    trend: "up",
    icon: Shield,
    description: "Overall compliance rating",
  },
  {
    title: "Avg. Processing Time",
    value: "2.3h",
    change: "-15%",
    trend: "up",
    icon: Clock,
    description: "Document processing time",
  },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6m")
  const [activeTab, setActiveTab] = useState("overview")

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                    )}
                    <span className={`text-sm ${metric.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <metric.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
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
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="documents" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="compliance" stroke="#f59e0b" strokeWidth={2} />
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
                      data={riskAssessment}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskAssessment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {riskAssessment.map((item) => (
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
                  <AreaChart data={userActivity}>
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
                {complianceMetrics.map((metric) => (
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
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="compliance"
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
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="documents" fill="#3b82f6" />
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
                  {topDocuments.map((doc, index) => (
                    <div key={doc.name} className="flex items-center space-x-3">
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
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
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
                  <BarChart data={userActivity}>
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

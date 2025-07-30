"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { TrendingUp, TrendingDown, BarChart3, PieChartIcon, Activity, Download, RefreshCw } from "lucide-react"

const performanceData = [
  { month: "Jan", documents: 120, compliance: 95, efficiency: 88 },
  { month: "Feb", documents: 135, compliance: 97, efficiency: 92 },
  { month: "Mar", documents: 148, compliance: 94, efficiency: 89 },
  { month: "Apr", documents: 162, compliance: 98, efficiency: 94 },
  { month: "May", documents: 178, compliance: 96, efficiency: 91 },
  { month: "Jun", documents: 195, compliance: 99, efficiency: 96 },
]

const complianceData = [
  { name: "GDPR", value: 98, color: "#10b981" },
  { name: "SOX", value: 95, color: "#3b82f6" },
  { name: "HIPAA", value: 92, color: "#f59e0b" },
  { name: "PCI DSS", value: 97, color: "#8b5cf6" },
  { name: "ISO 27001", value: 94, color: "#ef4444" },
]

const documentTypeData = [
  { type: "Contracts", count: 45, percentage: 35 },
  { type: "Policies", count: 28, percentage: 22 },
  { type: "Reports", count: 32, percentage: 25 },
  { type: "Agreements", count: 23, percentage: 18 },
]

const kpiData = [
  {
    title: "Document Processing",
    value: "195",
    change: "+12.5%",
    trend: "up",
    description: "Documents processed this month",
  },
  {
    title: "Compliance Score",
    value: "96.8%",
    change: "+2.1%",
    trend: "up",
    description: "Overall compliance rating",
  },
  {
    title: "Processing Time",
    value: "2.3h",
    change: "-15%",
    trend: "up",
    description: "Average document processing time",
  },
  {
    title: "Risk Score",
    value: "Low",
    change: "-8%",
    trend: "up",
    description: "Current risk assessment level",
  },
]

export function PerformanceChart() {
  const [timeRange, setTimeRange] = useState("6m")
  const [chartType, setChartType] = useState("line")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey === "compliance" ? "%" : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="documents" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area
                type="monotone"
                dataKey="compliance"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="documents" fill="#3b82f6" />
              <Bar dataKey="compliance" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )
      case "line":
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="documents" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="compliance" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-success mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Analytics
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1M</SelectItem>
                    <SelectItem value="3m">3M</SelectItem>
                    <SelectItem value="6m">6M</SelectItem>
                    <SelectItem value="1y">1Y</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={chartType} onValueChange={setChartType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
              <TabsContent value={chartType} className="mt-4">
                {renderChart()}
              </TabsContent>
            </Tabs>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm">Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm">Compliance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm">Efficiency</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Compliance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {complianceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Types */}
      <Card>
        <CardHeader>
          <CardTitle>Document Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentTypeData.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                    <Badge variant="secondary">{item.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

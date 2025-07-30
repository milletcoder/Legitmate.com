"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Clock, Search, Plus, FileText, Shield, Download, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplianceItem {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "compliant" | "non-compliant" | "pending" | "overdue"
  dueDate: Date
  completionRate: number
  assignee?: string
  lastUpdated: Date
}

const sampleComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    title: "GDPR Data Protection Audit",
    description: "Annual comprehensive data protection compliance review",
    category: "Data Protection",
    priority: "critical",
    status: "pending",
    dueDate: new Date("2024-02-15"),
    completionRate: 65,
    assignee: "John Doe",
    lastUpdated: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "SOX Financial Controls Review",
    description: "Quarterly Sarbanes-Oxley compliance assessment",
    category: "Financial",
    priority: "high",
    status: "compliant",
    dueDate: new Date("2024-03-01"),
    completionRate: 100,
    assignee: "Jane Smith",
    lastUpdated: new Date("2024-01-18"),
  },
  {
    id: "3",
    title: "Employee Training Compliance",
    description: "Mandatory compliance training completion tracking",
    category: "HR",
    priority: "medium",
    status: "non-compliant",
    dueDate: new Date("2024-01-30"),
    completionRate: 45,
    assignee: "Mike Johnson",
    lastUpdated: new Date("2024-01-19"),
  },
]

const complianceCategories = [
  { name: "Data Protection", count: 12, compliant: 8 },
  { name: "Financial", count: 8, compliant: 7 },
  { name: "HR", count: 15, compliant: 10 },
  { name: "Security", count: 10, compliant: 9 },
  { name: "Environmental", count: 6, compliant: 5 },
]

const getStatusColor = (status: ComplianceItem["status"]) => {
  switch (status) {
    case "compliant":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "non-compliant":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getPriorityColor = (priority: ComplianceItem["priority"]) => {
  switch (priority) {
    case "critical":
      return "bg-red-500 text-white"
    case "high":
      return "bg-orange-500 text-white"
    case "medium":
      return "bg-yellow-500 text-black"
    case "low":
      return "bg-green-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getStatusIcon = (status: ComplianceItem["status"]) => {
  switch (status) {
    case "compliant":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "non-compliant":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

export function ComplianceCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [complianceItems] = useState<ComplianceItem[]>(sampleComplianceItems)

  const filteredItems = complianceItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const overallCompliance = Math.round(
    (complianceItems.filter((item) => item.status === "compliant").length / complianceItems.length) * 100,
  )

  const criticalItems = complianceItems.filter((item) => item.priority === "critical").length
  const overdueItems = complianceItems.filter((item) => item.status === "overdue").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Center</h1>
          <p className="text-muted-foreground">Monitor and manage regulatory compliance across your organization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                <div className="text-2xl font-bold text-green-500">{overallCompliance}%</div>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={overallCompliance} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Items</p>
                <div className="text-2xl font-bold text-red-500">{criticalItems}</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <div className="text-2xl font-bold text-orange-500">{overdueItems}</div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requirements</p>
                <div className="text-2xl font-bold">{complianceItems.length}</div>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search compliance requirements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {complianceCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requirements List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(item.status)}
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge className={cn("text-xs", getPriorityColor(item.priority))}>{item.priority}</Badge>
                        <Badge className={cn("text-xs", getStatusColor(item.status))}>{item.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{item.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Due Date</p>
                          <p className="text-sm text-muted-foreground">{item.dueDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Assignee</p>
                          <p className="text-sm text-muted-foreground">{item.assignee || "Unassigned"}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Completion Progress</span>
                          <span className="text-sm text-muted-foreground">{item.completionRate}%</span>
                        </div>
                        <Progress value={item.completionRate} />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-1" />
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Requirements</span>
                      <span className="font-medium">{category.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliant</span>
                      <span className="font-medium text-green-500">{category.compliant}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Rate</span>
                      <span className="font-medium">{Math.round((category.compliant / category.count) * 100)}%</span>
                    </div>
                    <Progress value={(category.compliant / category.count) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

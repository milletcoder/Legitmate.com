"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Calendar,
  MoreHorizontal,
  Settings,
  Filter,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  category: "document" | "compliance" | "deadline" | "system"
  timestamp: Date
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Document Review Required",
    message: "Contract ABC-123 requires your immediate attention for compliance review.",
    type: "warning",
    category: "document",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/dashboard/documents/abc-123",
  },
  {
    id: "2",
    title: "Compliance Deadline Approaching",
    message: "GDPR audit documentation due in 3 days.",
    type: "error",
    category: "deadline",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    title: "AI Analysis Complete",
    message: "Risk assessment for Project Delta has been completed successfully.",
    type: "success",
    category: "document",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    title: "New Regulation Update",
    message: "Employment law changes effective next month. Review required.",
    type: "info",
    category: "compliance",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM EST.",
    type: "info",
    category: "system",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />
    case "error":
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case "success":
      return <CheckCircle className="h-4 w-4 text-success" />
    case "info":
    default:
      return <Info className="h-4 w-4 text-info" />
  }
}

const getCategoryIcon = (category: Notification["category"]) => {
  switch (category) {
    case "document":
      return <FileText className="h-4 w-4" />
    case "compliance":
      return <Shield className="h-4 w-4" />
    case "deadline":
      return <Calendar className="h-4 w-4" />
    case "system":
    default:
      return <Settings className="h-4 w-4" />
  }
}

const formatTimestamp = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.category === activeTab
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Filter by type</DropdownMenuItem>
                <DropdownMenuItem>Filter by category</DropdownMenuItem>
                <DropdownMenuItem>Sort by date</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="document">Docs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="deadline">Deadlines</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground">You're all caught up! Check back later for updates.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/30" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {getCategoryIcon(notification.category)}
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                {!notification.read && <div className="h-2 w-2 bg-primary rounded-full" />}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTimestamp(notification.timestamp)}</span>
                                </span>
                                {notification.actionUrl && (
                                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    Mark as read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-destructive"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

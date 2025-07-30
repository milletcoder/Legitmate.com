"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  FileText,
  BarChart3,
  Shield,
  Settings,
  Search,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Calendar,
  Users,
  HelpCircle,
  Star,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Compliance", href: "/dashboard/compliance", icon: Shield },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const quickActions = [
  { name: "New Document", icon: FileText, color: "text-blue-600" },
  { name: "Schedule Review", icon: Calendar, color: "text-green-600" },
  { name: "Generate Report", icon: BarChart3, color: "text-purple-600" },
  { name: "Compliance Check", icon: Shield, color: "text-orange-600" },
]

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-lora text-gradient">Legal Eagle</h2>
              <p className="text-xs text-muted-foreground">AI-Powered Legal Platform</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed ? "px-2" : "px-3",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant="outline"
                size="sm"
                className="h-auto flex-col gap-1 p-2 bg-transparent"
              >
                <action.icon className={cn("h-4 w-4", action.color)} />
                <span className="text-xs">{action.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Premium Badge */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="rounded-lg bg-gradient-secondary p-3 text-center">
            <Star className="mx-auto h-6 w-6 text-white mb-2" />
            <p className="text-sm font-medium text-white">Premium Plan</p>
            <p className="text-xs text-white/80">Unlimited AI assistance</p>
            <Button size="sm" variant="secondary" className="mt-2 w-full">
              <Zap className="mr-1 h-3 w-3" />
              Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start p-2", isCollapsed && "justify-center")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Bell, Settings, User, LogOut, Moon, Sun, Menu, Plus, Zap, Crown, HelpCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"

const notifications = [
  {
    id: 1,
    title: "Document Review Due",
    message: "Contract ABC-123 requires your review by tomorrow",
    time: "2 hours ago",
    type: "warning",
    unread: true,
  },
  {
    id: 2,
    title: "Compliance Alert",
    message: "New regulation updates available for review",
    time: "4 hours ago",
    type: "info",
    unread: true,
  },
  {
    id: 3,
    title: "AI Analysis Complete",
    message: "Document risk assessment has been completed",
    time: "1 day ago",
    type: "success",
    unread: false,
  },
]

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section - Search */}
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Access your dashboard features</SheetDescription>
              </SheetHeader>
              {/* Mobile navigation content would go here */}
            </SheetContent>
          </Sheet>

          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents, cases, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>
          </form>
        </div>

        {/* Center Section - Quick Actions */}
        <div className="hidden lg:flex items-center space-x-2">
          <Button size="sm" className="bg-gradient-primary">
            <Plus className="mr-1 h-4 w-4" />
            New Document
          </Button>
          <Button size="sm" variant="outline">
            <Zap className="mr-1 h-4 w-4" />
            AI Assistant
          </Button>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>Stay updated with your legal matters</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-3 ${notification.unread ? "bg-muted/50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      {notification.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Crown className="mr-2 h-4 w-4" />
                <span>Premium Plan</span>
                <Badge variant="secondary" className="ml-auto">
                  Pro
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

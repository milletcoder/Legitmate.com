"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/providers/auth-provider"
import { LayoutDashboard, FileText, CalendarCheck, BarChart3, Settings, LogOut, Menu } from 'lucide-react'

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/compliance", label: "Compliance", icon: CalendarCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [open, setOpen] = useState(true)

  return (
    <aside className={`border-r bg-background ${open ? "w-64" : "w-16"} transition-all duration-200 h-full`}>
      <div className="flex items-center justify-between p-3">
        <Button variant="ghost" size="icon" aria-label="Toggle sidebar" onClick={() => setOpen((o) => !o)}>
          <Menu className="h-5 w-5" />
        </Button>
        {open && <span className="font-semibold">Legal Eagle</span>}
        <div className="w-9" />
      </div>
      <Separator />
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start ${open ? "" : "px-2"} ${active ? "" : "hover:bg-muted"}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {open && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>
      <Separator className="my-2" />
      <div className="p-2 mt-auto">
        <Button variant="outline" className={`w-full justify-start ${open ? "" : "px-2"}`} onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          {open && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}

export default DashboardSidebar

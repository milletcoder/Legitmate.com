"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to Legal Eagle",
      message: "Your account has been successfully created. Start by uploading your first GST notice.",
      type: "success",
      timestamp: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "GSTR-3B Due Soon",
      message: "Your GSTR-3B filing is due in 3 days. Don't forget to file on time.",
      type: "warning",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

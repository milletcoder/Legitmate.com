"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AnalyticsData {
  documentsProcessed: number
  complianceScore: number
  upcomingDeadlines: number
  timeSaved: number
  successRate: number
  teamMembers: number
  monthlyTrend: Array<{
    month: string
    documents: number
    compliance: number
  }>
}

interface AnalyticsContextType {
  data: AnalyticsData | null
  isLoading: boolean
  refreshData: () => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mockData: AnalyticsData = {
    documentsProcessed: 127,
    complianceScore: 98,
    upcomingDeadlines: 3,
    timeSaved: 45,
    successRate: 99.7,
    teamMembers: 4,
    monthlyTrend: [
      { month: "Jul", documents: 23, compliance: 95 },
      { month: "Aug", documents: 31, compliance: 97 },
      { month: "Sep", documents: 28, compliance: 96 },
      { month: "Oct", documents: 35, compliance: 98 },
      { month: "Nov", documents: 42, compliance: 99 },
      { month: "Dec", documents: 38, compliance: 98 },
    ],
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData(mockData)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const value = {
    data,
    isLoading,
    refreshData,
  }

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}

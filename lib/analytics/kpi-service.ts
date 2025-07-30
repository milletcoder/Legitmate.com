/**
 * Key Performance Indicators (KPI) Service
 * Provides real-time analytics and performance insights
 */

export interface KPIMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changePercent: number
  trend: "up" | "down" | "stable"
  target?: number
  unit: string
  category: string
  description: string
  lastUpdated: Date
}

export interface AnalyticsDashboard {
  id: string
  name: string
  description: string
  widgets: DashboardWidget[]
  layout: LayoutConfig
  permissions: string[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface DashboardWidget {
  id: string
  type: "metric" | "chart" | "table" | "gauge" | "map"
  title: string
  dataSource: string
  config: WidgetConfig
  position: { x: number; y: number; width: number; height: number }
  refreshInterval: number
}

export interface WidgetConfig {
  chartType?: "line" | "bar" | "pie" | "area" | "scatter"
  timeRange?: string
  filters?: Record<string, any>
  aggregation?: "sum" | "avg" | "count" | "min" | "max"
  groupBy?: string[]
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
}

export interface LayoutConfig {
  columns: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
}

export interface UserBehaviorMetrics {
  activeUsers: {
    daily: number
    weekly: number
    monthly: number
  }
  sessionMetrics: {
    averageDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  featureUsage: Record<
    string,
    {
      users: number
      sessions: number
      timeSpent: number
    }
  >
  userJourney: Array<{
    step: string
    users: number
    dropoffRate: number
  }>
}

export interface SystemPerformanceMetrics {
  responseTime: {
    average: number
    p95: number
    p99: number
  }
  throughput: {
    requestsPerSecond: number
    transactionsPerSecond: number
  }
  errorRates: {
    total: number
    byType: Record<string, number>
  }
  resourceUsage: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  uptime: number
}

export interface BusinessMetrics {
  revenue: {
    total: number
    recurring: number
    growth: number
  }
  customers: {
    total: number
    new: number
    churn: number
    ltv: number
  }
  conversion: {
    signupRate: number
    trialToPayment: number
    freeToPayment: number
  }
  satisfaction: {
    nps: number
    csat: number
    supportTickets: number
  }
}

export class KPIService {
  private static metrics: Map<string, KPIMetric> = new Map()
  private static dashboards: AnalyticsDashboard[] = []
  private static realTimeData: Map<string, any> = new Map()

  /**
   * Initialize default KPIs
   */
  static initializeKPIs(): void {
    const defaultKPIs: Omit<KPIMetric, "lastUpdated">[] = [
      {
        id: "documents_processed",
        name: "Documents Processed",
        value: 127,
        previousValue: 104,
        change: 23,
        changePercent: 22.1,
        trend: "up",
        target: 150,
        unit: "count",
        category: "Operations",
        description: "Total number of GST documents processed",
      },
      {
        id: "compliance_score",
        name: "Compliance Score",
        value: 98.5,
        previousValue: 96.2,
        change: 2.3,
        changePercent: 2.4,
        trend: "up",
        target: 99,
        unit: "percentage",
        category: "Compliance",
        description: "Overall compliance rating across all clients",
      },
      {
        id: "response_time",
        name: "Average Response Time",
        value: 1.2,
        previousValue: 1.8,
        change: -0.6,
        changePercent: -33.3,
        trend: "up",
        target: 1.0,
        unit: "seconds",
        category: "Performance",
        description: "Average AI response generation time",
      },
      {
        id: "user_satisfaction",
        name: "User Satisfaction",
        value: 4.7,
        previousValue: 4.5,
        change: 0.2,
        changePercent: 4.4,
        trend: "up",
        target: 4.8,
        unit: "rating",
        category: "Customer",
        description: "Average user satisfaction rating (1-5 scale)",
      },
      {
        id: "active_users",
        name: "Monthly Active Users",
        value: 1247,
        previousValue: 1156,
        change: 91,
        changePercent: 7.9,
        trend: "up",
        target: 1500,
        unit: "count",
        category: "Growth",
        description: "Number of unique users active in the last 30 days",
      },
      {
        id: "revenue_growth",
        name: "Revenue Growth",
        value: 15.3,
        previousValue: 12.1,
        change: 3.2,
        changePercent: 26.4,
        trend: "up",
        target: 20,
        unit: "percentage",
        category: "Business",
        description: "Month-over-month revenue growth rate",
      },
    ]

    defaultKPIs.forEach((kpi) => {
      this.metrics.set(kpi.id, {
        ...kpi,
        lastUpdated: new Date(),
      })
    })
  }

  /**
   * Get all KPIs
   */
  static getKPIs(category?: string): KPIMetric[] {
    const allKPIs = Array.from(this.metrics.values())

    if (category) {
      return allKPIs.filter((kpi) => kpi.category === category)
    }

    return allKPIs
  }

  /**
   * Get specific KPI
   */
  static getKPI(id: string): KPIMetric | undefined {
    return this.metrics.get(id)
  }

  /**
   * Update KPI value
   */
  static updateKPI(id: string, newValue: number): void {
    const kpi = this.metrics.get(id)
    if (!kpi) return

    const updatedKPI: KPIMetric = {
      ...kpi,
      previousValue: kpi.value,
      value: newValue,
      change: newValue - kpi.value,
      changePercent: kpi.value !== 0 ? ((newValue - kpi.value) / kpi.value) * 100 : 0,
      trend: newValue > kpi.value ? "up" : newValue < kpi.value ? "down" : "stable",
      lastUpdated: new Date(),
    }

    this.metrics.set(id, updatedKPI)

    // Emit real-time update
    this.emitRealTimeUpdate("kpi_update", { id, kpi: updatedKPI })
  }

  /**
   * Get user behavior metrics
   */
  static async getUserBehaviorMetrics(): Promise<UserBehaviorMetrics> {
    // Simulate data fetching
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      activeUsers: {
        daily: 342,
        weekly: 1247,
        monthly: 3891,
      },
      sessionMetrics: {
        averageDuration: 18.5, // minutes
        bounceRate: 23.4, // percentage
        pagesPerSession: 4.2,
      },
      featureUsage: {
        document_upload: { users: 1156, sessions: 2341, timeSpent: 145.2 },
        ai_response: { users: 987, sessions: 1876, timeSpent: 234.7 },
        compliance_calendar: { users: 743, sessions: 1234, timeSpent: 89.3 },
        analytics_dashboard: { users: 456, sessions: 789, timeSpent: 167.8 },
      },
      userJourney: [
        { step: "Landing Page", users: 1000, dropoffRate: 0 },
        { step: "Sign Up", users: 750, dropoffRate: 25 },
        { step: "Email Verification", users: 675, dropoffRate: 10 },
        { step: "Onboarding", users: 608, dropoffRate: 10 },
        { step: "First Document Upload", users: 486, dropoffRate: 20 },
        { step: "Active User", users: 437, dropoffRate: 10 },
      ],
    }
  }

  /**
   * Get system performance metrics
   */
  static async getSystemPerformanceMetrics(): Promise<SystemPerformanceMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      responseTime: {
        average: 245, // milliseconds
        p95: 567,
        p99: 1234,
      },
      throughput: {
        requestsPerSecond: 156.7,
        transactionsPerSecond: 89.3,
      },
      errorRates: {
        total: 0.23, // percentage
        byType: {
          "4xx": 0.15,
          "5xx": 0.08,
          timeout: 0.05,
          network: 0.02,
        },
      },
      resourceUsage: {
        cpu: 67.8, // percentage
        memory: 72.4,
        disk: 45.2,
        network: 23.7,
      },
      uptime: 99.97, // percentage
    }
  }

  /**
   * Get business metrics
   */
  static async getBusinessMetrics(): Promise<BusinessMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      revenue: {
        total: 234567, // in currency units
        recurring: 198432,
        growth: 15.3, // percentage
      },
      customers: {
        total: 1247,
        new: 91,
        churn: 2.3, // percentage
        ltv: 2340, // lifetime value
      },
      conversion: {
        signupRate: 12.4, // percentage
        trialToPayment: 23.7,
        freeToPayment: 8.9,
      },
      satisfaction: {
        nps: 67, // Net Promoter Score
        csat: 4.7, // Customer Satisfaction (1-5)
        supportTickets: 23,
      },
    }
  }

  /**
   * Create custom dashboard
   */
  static createDashboard(dashboard: Omit<AnalyticsDashboard, "id" | "createdAt" | "updatedAt">): AnalyticsDashboard {
    const newDashboard: AnalyticsDashboard = {
      ...dashboard,
      id: `dashboard_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.dashboards.push(newDashboard)
    return newDashboard
  }

  /**
   * Get dashboards
   */
  static getDashboards(userId?: string): AnalyticsDashboard[] {
    if (userId) {
      return this.dashboards.filter((d) => d.isPublic || d.createdBy === userId || d.permissions.includes(userId))
    }

    return this.dashboards.filter((d) => d.isPublic)
  }

  /**
   * Update dashboard
   */
  static updateDashboard(id: string, updates: Partial<AnalyticsDashboard>): AnalyticsDashboard | null {
    const index = this.dashboards.findIndex((d) => d.id === id)
    if (index === -1) return null

    this.dashboards[index] = {
      ...this.dashboards[index],
      ...updates,
      updatedAt: new Date(),
    }

    return this.dashboards[index]
  }

  /**
   * Generate report data
   */
  static async generateReport(config: {
    type: "summary" | "detailed" | "trend"
    metrics: string[]
    timeRange: { start: Date; end: Date }
    groupBy?: "day" | "week" | "month"
    filters?: Record<string, any>
  }): Promise<{
    data: any[]
    summary: Record<string, number>
    metadata: {
      generatedAt: Date
      timeRange: { start: Date; end: Date }
      totalRecords: number
    }
  }> {
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockData = this.generateMockReportData(config)

    return {
      data: mockData,
      summary: {
        totalDocuments: 1247,
        averageProcessingTime: 2.3,
        complianceRate: 98.5,
        userSatisfaction: 4.7,
      },
      metadata: {
        generatedAt: new Date(),
        timeRange: config.timeRange,
        totalRecords: mockData.length,
      },
    }
  }

  /**
   * Export report
   */
  static async exportReport(
    reportData: any,
    format: "csv" | "xlsx" | "pdf",
  ): Promise<{
    url: string
    filename: string
    size: number
  }> {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `legal_eagle_report_${timestamp}.${format}`

    return {
      url: `/exports/${filename}`,
      filename,
      size: Math.floor(Math.random() * 1000000), // Random file size
    }
  }

  /**
   * Set up real-time data streaming
   */
  static subscribeToRealTimeUpdates(callback: (event: string, data: any) => void): () => void {
    // In production, this would set up WebSocket or Server-Sent Events
    const interval = setInterval(() => {
      // Simulate real-time updates
      const randomKPI = Array.from(this.metrics.keys())[Math.floor(Math.random() * this.metrics.size)]

      if (randomKPI && Math.random() < 0.1) {
        // 10% chance of update
        const kpi = this.metrics.get(randomKPI)!
        const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
        const newValue = kpi.value * (1 + variation)

        this.updateKPI(randomKPI, newValue)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }

  /**
   * Get KPI trends
   */
  static getKPITrends(
    kpiId: string,
    timeRange: { start: Date; end: Date },
  ): Array<{
    timestamp: Date
    value: number
  }> {
    // Generate mock trend data
    const points: Array<{ timestamp: Date; value: number }> = []
    const kpi = this.metrics.get(kpiId)

    if (!kpi) return points

    const startTime = timeRange.start.getTime()
    const endTime = timeRange.end.getTime()
    const interval = (endTime - startTime) / 30 // 30 data points

    let currentValue = kpi.previousValue

    for (let i = 0; i <= 30; i++) {
      const timestamp = new Date(startTime + interval * i)
      const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
      currentValue = currentValue * (1 + variation)

      points.push({
        timestamp,
        value: Math.max(0, currentValue), // Ensure non-negative values
      })
    }

    return points
  }

  /**
   * Calculate KPI health score
   */
  static calculateHealthScore(): {
    overall: number
    byCategory: Record<string, number>
    recommendations: string[]
  } {
    const kpis = Array.from(this.metrics.values())
    const recommendations: string[] = []

    // Calculate overall health
    let totalScore = 0
    let totalWeight = 0

    const categoryScores: Record<string, { score: number; weight: number }> = {}

    kpis.forEach((kpi) => {
      let score = 50 // Base score

      // Score based on target achievement
      if (kpi.target) {
        const achievement = kpi.value / kpi.target
        score = Math.min(100, achievement * 100)
      }

      // Adjust based on trend
      if (kpi.trend === "up" && kpi.changePercent > 0) {
        score += 10
      } else if (kpi.trend === "down" && kpi.changePercent < 0) {
        score -= 10
      }

      score = Math.max(0, Math.min(100, score))

      // Weight by category importance
      const weight = this.getCategoryWeight(kpi.category)
      totalScore += score * weight
      totalWeight += weight

      // Track category scores
      if (!categoryScores[kpi.category]) {
        categoryScores[kpi.category] = { score: 0, weight: 0 }
      }
      categoryScores[kpi.category].score += score * weight
      categoryScores[kpi.category].weight += weight

      // Generate recommendations
      if (score < 70) {
        recommendations.push(
          `Improve ${kpi.name}: Currently at ${kpi.value}${kpi.unit}, target is ${kpi.target}${kpi.unit}`,
        )
      }
    })

    const overall = totalWeight > 0 ? totalScore / totalWeight : 0

    const byCategory: Record<string, number> = {}
    Object.entries(categoryScores).forEach(([category, data]) => {
      byCategory[category] = data.weight > 0 ? data.score / data.weight : 0
    })

    return {
      overall: Math.round(overall),
      byCategory: Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, Math.round(v)])),
      recommendations,
    }
  }

  // Private helper methods
  private static emitRealTimeUpdate(event: string, data: any): void {
    this.realTimeData.set(event, { ...data, timestamp: new Date() })
    // In production, emit to WebSocket clients
    console.log(`Real-time update: ${event}`, data)
  }

  private static generateMockReportData(config: any): any[] {
    const data: any[] = []
    const startTime = config.timeRange.start.getTime()
    const endTime = config.timeRange.end.getTime()
    const interval = (endTime - startTime) / 100 // 100 data points

    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(startTime + interval * i)
      data.push({
        timestamp,
        documentsProcessed: Math.floor(Math.random() * 50) + 10,
        complianceScore: Math.random() * 10 + 90,
        responseTime: Math.random() * 2 + 0.5,
        userSatisfaction: Math.random() * 1 + 4,
      })
    }

    return data
  }

  private static getCategoryWeight(category: string): number {
    const weights: Record<string, number> = {
      Operations: 1.0,
      Compliance: 1.2,
      Performance: 0.8,
      Customer: 1.1,
      Growth: 0.9,
      Business: 1.0,
    }

    return weights[category] || 1.0
  }
}

// Initialize KPIs on service load
KPIService.initializeKPIs()

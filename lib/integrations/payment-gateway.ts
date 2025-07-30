/**
 * Payment Gateway Integration Service
 * Supports multiple payment providers with unified interface
 */

export interface PaymentProvider {
  id: string
  name: string
  type: "card" | "wallet" | "bank" | "crypto"
  enabled: boolean
  config: Record<string, any>
  fees: {
    percentage: number
    fixed: number
    currency: string
  }
  supportedCurrencies: string[]
  supportedCountries: string[]
}

export interface PaymentMethod {
  id: string
  userId: string
  providerId: string
  type: "card" | "bank_account" | "wallet"
  details: {
    last4?: string
    brand?: string
    expiryMonth?: number
    expiryYear?: number
    holderName?: string
    bankName?: string
    accountType?: string
  }
  isDefault: boolean
  isVerified: boolean
  createdAt: Date
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed" | "canceled"
  paymentMethodId?: string
  customerId: string
  description: string
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  customerId: string
  planId: string
  status: "active" | "past_due" | "canceled" | "unpaid"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialStart?: Date
  trialEnd?: Date
  paymentMethodId: string
  metadata: Record<string, any>
}

export interface Invoice {
  id: string
  customerId: string
  subscriptionId?: string
  amount: number
  currency: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  dueDate: Date
  paidAt?: Date
  items: InvoiceItem[]
  tax: number
  discount: number
  total: number
  paymentAttempts: number
  nextPaymentAttempt?: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate: number
  metadata: Record<string, any>
}

export class PaymentGatewayService {
  private static providers: Map<string, PaymentProvider> = new Map()
  private static paymentMethods: Map<string, PaymentMethod[]> = new Map()
  private static paymentIntents: PaymentIntent[] = []
  private static subscriptions: Subscription[] = []
  private static invoices: Invoice[] = []

  /**
   * Initialize payment providers
   */
  static initializeProviders(): void {
    const providers: PaymentProvider[] = [
      {
        id: "stripe",
        name: "Stripe",
        type: "card",
        enabled: true,
        config: {
          publicKey: process.env.STRIPE_PUBLIC_KEY,
          secretKey: process.env.STRIPE_SECRET_KEY,
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        },
        fees: { percentage: 2.9, fixed: 30, currency: "INR" },
        supportedCurrencies: ["INR", "USD", "EUR", "GBP"],
        supportedCountries: ["IN", "US", "GB", "CA", "AU"],
      },
      {
        id: "razorpay",
        name: "Razorpay",
        type: "card",
        enabled: true,
        config: {
          keyId: process.env.RAZORPAY_KEY_ID,
          keySecret: process.env.RAZORPAY_KEY_SECRET,
          webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
        },
        fees: { percentage: 2.0, fixed: 0, currency: "INR" },
        supportedCurrencies: ["INR"],
        supportedCountries: ["IN"],
      },
      {
        id: "payu",
        name: "PayU",
        type: "card",
        enabled: true,
        config: {
          merchantId: process.env.PAYU_MERCHANT_ID,
          merchantKey: process.env.PAYU_MERCHANT_KEY,
          salt: process.env.PAYU_SALT,
        },
        fees: { percentage: 2.5, fixed: 0, currency: "INR" },
        supportedCurrencies: ["INR"],
        supportedCountries: ["IN"],
      },
      {
        id: "upi",
        name: "UPI",
        type: "wallet",
        enabled: true,
        config: {
          vpa: "legaleagle@upi",
          merchantCode: "LEGAL001",
        },
        fees: { percentage: 0.5, fixed: 0, currency: "INR" },
        supportedCurrencies: ["INR"],
        supportedCountries: ["IN"],
      },
    ]

    providers.forEach((provider) => {
      this.providers.set(provider.id, provider)
    })
  }

  /**
   * Get available payment providers
   */
  static getProviders(country?: string, currency?: string): PaymentProvider[] {
    const providers = Array.from(this.providers.values()).filter((p) => p.enabled)

    if (country) {
      return providers.filter((p) => p.supportedCountries.includes(country))
    }

    if (currency) {
      return providers.filter((p) => p.supportedCurrencies.includes(currency))
    }

    return providers
  }

  /**
   * Create payment intent
   */
  static async createPaymentIntent(data: {
    amount: number
    currency: string
    customerId: string
    paymentMethodId?: string
    description: string
    metadata?: Record<string, any>
  }): Promise<PaymentIntent> {
    const paymentIntent: PaymentIntent = {
      id: `pi_${Date.now()}`,
      amount: data.amount,
      currency: data.currency,
      status: "pending",
      paymentMethodId: data.paymentMethodId,
      customerId: data.customerId,
      description: data.description,
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.paymentIntents.push(paymentIntent)

    // Simulate payment processing
    setTimeout(() => {
      this.processPayment(paymentIntent.id)
    }, 2000)

    return paymentIntent
  }

  /**
   * Confirm payment intent
   */
  static async confirmPaymentIntent(paymentIntentId: string, paymentMethodId?: string): Promise<PaymentIntent> {
    const intent = this.paymentIntents.find((pi) => pi.id === paymentIntentId)
    if (!intent) {
      throw new Error("Payment intent not found")
    }

    if (paymentMethodId) {
      intent.paymentMethodId = paymentMethodId
    }

    intent.status = "processing"
    intent.updatedAt = new Date()

    // Simulate payment processing
    setTimeout(() => {
      this.processPayment(paymentIntentId)
    }, 3000)

    return intent
  }

  /**
   * Add payment method
   */
  static async addPaymentMethod(data: {
    userId: string
    providerId: string
    type: PaymentMethod["type"]
    details: PaymentMethod["details"]
  }): Promise<PaymentMethod> {
    const paymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      userId: data.userId,
      providerId: data.providerId,
      type: data.type,
      details: data.details,
      isDefault: false,
      isVerified: false,
      createdAt: new Date(),
    }

    const userMethods = this.paymentMethods.get(data.userId) || []

    // Set as default if it's the first payment method
    if (userMethods.length === 0) {
      paymentMethod.isDefault = true
    }

    userMethods.push(paymentMethod)
    this.paymentMethods.set(data.userId, userMethods)

    // Simulate verification process
    setTimeout(() => {
      paymentMethod.isVerified = true
    }, 5000)

    return paymentMethod
  }

  /**
   * Get user payment methods
   */
  static getUserPaymentMethods(userId: string): PaymentMethod[] {
    return this.paymentMethods.get(userId) || []
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    const userMethods = this.paymentMethods.get(userId) || []

    // Remove default from all methods
    userMethods.forEach((method) => {
      method.isDefault = false
    })

    // Set new default
    const targetMethod = userMethods.find((method) => method.id === paymentMethodId)
    if (targetMethod) {
      targetMethod.isDefault = true
      return true
    }

    return false
  }

  /**
   * Remove payment method
   */
  static async removePaymentMethod(userId: string, paymentMethodId: string): Promise<boolean> {
    const userMethods = this.paymentMethods.get(userId) || []
    const index = userMethods.findIndex((method) => method.id === paymentMethodId)

    if (index !== -1) {
      const removedMethod = userMethods[index]
      userMethods.splice(index, 1)

      // If removed method was default, set another as default
      if (removedMethod.isDefault && userMethods.length > 0) {
        userMethods[0].isDefault = true
      }

      return true
    }

    return false
  }

  /**
   * Create subscription
   */
  static async createSubscription(data: {
    customerId: string
    planId: string
    paymentMethodId: string
    trialDays?: number
    metadata?: Record<string, any>
  }): Promise<Subscription> {
    const now = new Date()
    const trialEnd = data.trialDays ? new Date(now.getTime() + data.trialDays * 24 * 60 * 60 * 1000) : undefined

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      customerId: data.customerId,
      planId: data.planId,
      status: "active",
      currentPeriodStart: trialEnd || now,
      currentPeriodEnd: new Date((trialEnd || now).getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      trialStart: data.trialDays ? now : undefined,
      trialEnd,
      paymentMethodId: data.paymentMethodId,
      metadata: data.metadata || {},
    }

    this.subscriptions.push(subscription)

    // Create first invoice
    await this.createInvoiceForSubscription(subscription)

    return subscription
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<Subscription> {
    const subscription = this.subscriptions.find((sub) => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error("Subscription not found")
    }

    if (cancelAtPeriodEnd) {
      subscription.cancelAtPeriodEnd = true
    } else {
      subscription.status = "canceled"
    }

    return subscription
  }

  /**
   * Get customer subscriptions
   */
  static getCustomerSubscriptions(customerId: string): Subscription[] {
    return this.subscriptions.filter((sub) => sub.customerId === customerId)
  }

  /**
   * Create invoice
   */
  static async createInvoice(data: {
    customerId: string
    subscriptionId?: string
    items: Omit<InvoiceItem, "id">[]
    dueDate: Date
    taxRate?: number
    discountAmount?: number
  }): Promise<Invoice> {
    const items: InvoiceItem[] = data.items.map((item) => ({
      ...item,
      id: `ii_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }))

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * (data.taxRate || 0.18) // 18% GST
    const discount = data.discountAmount || 0
    const total = subtotal + tax - discount

    const invoice: Invoice = {
      id: `in_${Date.now()}`,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      amount: subtotal,
      currency: "INR",
      status: "open",
      dueDate: data.dueDate,
      items,
      tax,
      discount,
      total,
      paymentAttempts: 0,
    }

    this.invoices.push(invoice)

    return invoice
  }

  /**
   * Pay invoice
   */
  static async payInvoice(invoiceId: string, paymentMethodId: string): Promise<Invoice> {
    const invoice = this.invoices.find((inv) => inv.id === invoiceId)
    if (!invoice) {
      throw new Error("Invoice not found")
    }

    // Create payment intent for invoice
    const paymentIntent = await this.createPaymentIntent({
      amount: invoice.total,
      currency: invoice.currency,
      customerId: invoice.customerId,
      paymentMethodId,
      description: `Payment for invoice ${invoice.id}`,
      metadata: { invoiceId: invoice.id },
    })

    // Simulate payment processing
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate
        invoice.status = "paid"
        invoice.paidAt = new Date()
      } else {
        invoice.paymentAttempts++
        invoice.nextPaymentAttempt = new Date(Date.now() + 24 * 60 * 60 * 1000) // Retry in 24 hours
      }
    }, 3000)

    return invoice
  }

  /**
   * Get customer invoices
   */
  static getCustomerInvoices(customerId: string): Invoice[] {
    return this.invoices
      .filter((inv) => inv.customerId === customerId)
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
  }

  /**
   * Process refund
   */
  static async processRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<{
    id: string
    amount: number
    status: "pending" | "succeeded" | "failed"
    reason: string
  }> {
    const paymentIntent = this.paymentIntents.find((pi) => pi.id === paymentIntentId)
    if (!paymentIntent) {
      throw new Error("Payment intent not found")
    }

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Cannot refund unsuccessful payment")
    }

    const refundAmount = amount || paymentIntent.amount

    const refund = {
      id: `re_${Date.now()}`,
      amount: refundAmount,
      status: "pending" as const,
      reason: "requested_by_customer",
    }

    // Simulate refund processing
    setTimeout(() => {
      refund.status = Math.random() > 0.05 ? "succeeded" : "failed" // 95% success rate
    }, 2000)

    return refund
  }

  /**
   * Handle webhook events
   */
  static async handleWebhook(providerId: string, event: any): Promise<void> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error("Unknown payment provider")
    }

    // Verify webhook signature (implementation depends on provider)
    const isValid = await this.verifyWebhookSignature(provider, event)
    if (!isValid) {
      throw new Error("Invalid webhook signature")
    }

    // Process event based on type
    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentSuccess(event.data.object)
        break
      case "payment_intent.payment_failed":
        await this.handlePaymentFailure(event.data.object)
        break
      case "invoice.payment_succeeded":
        await this.handleInvoicePaymentSuccess(event.data.object)
        break
      case "customer.subscription.deleted":
        await this.handleSubscriptionCancellation(event.data.object)
        break
      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }
  }

  /**
   * Get payment analytics
   */
  static getPaymentAnalytics(timeRange: { start: Date; end: Date }): {
    totalRevenue: number
    totalTransactions: number
    averageTransactionValue: number
    successRate: number
    topPaymentMethods: Array<{ method: string; count: number; revenue: number }>
    revenueByDay: Array<{ date: string; revenue: number; transactions: number }>
  } {
    const successfulPayments = this.paymentIntents.filter(
      (pi) => pi.status === "succeeded" && pi.createdAt >= timeRange.start && pi.createdAt <= timeRange.end,
    )

    const totalRevenue = successfulPayments.reduce((sum, pi) => sum + pi.amount, 0)
    const totalTransactions = successfulPayments.length
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    const allPayments = this.paymentIntents.filter(
      (pi) => pi.createdAt >= timeRange.start && pi.createdAt <= timeRange.end,
    )
    const successRate = allPayments.length > 0 ? (successfulPayments.length / allPayments.length) * 100 : 0

    // Mock data for demonstration
    const topPaymentMethods = [
      { method: "Credit Card", count: 156, revenue: 234567 },
      { method: "UPI", count: 89, revenue: 123456 },
      { method: "Net Banking", count: 45, revenue: 67890 },
      { method: "Wallet", count: 23, revenue: 34567 },
    ]

    const revenueByDay = this.generateDailyRevenueData(timeRange)

    return {
      totalRevenue,
      totalTransactions,
      averageTransactionValue,
      successRate,
      topPaymentMethods,
      revenueByDay,
    }
  }

  // Private helper methods
  private static async processPayment(paymentIntentId: string): Promise<void> {
    const intent = this.paymentIntents.find((pi) => pi.id === paymentIntentId)
    if (!intent) return

    // Simulate payment processing with 90% success rate
    const success = Math.random() > 0.1

    intent.status = success ? "succeeded" : "failed"
    intent.updatedAt = new Date()

    if (success) {
      await this.handlePaymentSuccess(intent)
    } else {
      await this.handlePaymentFailure(intent)
    }
  }

  private static async handlePaymentSuccess(paymentIntent: PaymentIntent): Promise<void> {
    console.log(`Payment succeeded: ${paymentIntent.id}`)

    // Update related invoice if exists
    const invoiceId = paymentIntent.metadata.invoiceId
    if (invoiceId) {
      const invoice = this.invoices.find((inv) => inv.id === invoiceId)
      if (invoice) {
        invoice.status = "paid"
        invoice.paidAt = new Date()
      }
    }

    // Send confirmation email, update user account, etc.
  }

  private static async handlePaymentFailure(paymentIntent: PaymentIntent): Promise<void> {
    console.log(`Payment failed: ${paymentIntent.id}`)

    // Handle failed payment - retry logic, notifications, etc.
  }

  private static async handleInvoicePaymentSuccess(invoice: any): Promise<void> {
    console.log(`Invoice payment succeeded: ${invoice.id}`)
  }

  private static async handleSubscriptionCancellation(subscription: any): Promise<void> {
    console.log(`Subscription cancelled: ${subscription.id}`)

    const localSub = this.subscriptions.find((sub) => sub.id === subscription.id)
    if (localSub) {
      localSub.status = "canceled"
    }
  }

  private static async verifyWebhookSignature(provider: PaymentProvider, event: any): Promise<boolean> {
    // Implementation depends on the payment provider
    // For Stripe: use stripe.webhooks.constructEvent
    // For Razorpay: use crypto.createHmac
    return true // Mock verification
  }

  private static async createInvoiceForSubscription(subscription: Subscription): Promise<Invoice> {
    // Mock subscription plan pricing
    const planPricing = {
      basic: { amount: 999, name: "Basic Plan" },
      pro: { amount: 2999, name: "Pro Plan" },
      enterprise: { amount: 9999, name: "Enterprise Plan" },
    }

    const plan = planPricing[subscription.planId as keyof typeof planPricing] || planPricing.basic

    return this.createInvoice({
      customerId: subscription.customerId,
      subscriptionId: subscription.id,
      items: [
        {
          description: plan.name,
          quantity: 1,
          unitPrice: plan.amount,
          amount: plan.amount,
          taxRate: 0.18,
          metadata: { planId: subscription.planId },
        },
      ],
      dueDate: subscription.currentPeriodEnd,
      taxRate: 0.18,
    })
  }

  private static generateDailyRevenueData(timeRange: { start: Date; end: Date }): Array<{
    date: string
    revenue: number
    transactions: number
  }> {
    const data: Array<{ date: string; revenue: number; transactions: number }> = []
    const currentDate = new Date(timeRange.start)

    while (currentDate <= timeRange.end) {
      data.push({
        date: currentDate.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 50000) + 10000,
        transactions: Math.floor(Math.random() * 50) + 10,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }
}

// Initialize providers on service load
PaymentGatewayService.initializeProviders()

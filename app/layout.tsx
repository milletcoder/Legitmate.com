import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { NotificationProvider } from "@/components/providers/notification-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Legal Eagle - GST Compliance Simplified",
  description: "Your ultimate solution for GST compliance, document management, and legal insights.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationProvider>
              <AnalyticsProvider>
                <Suspense fallback={null}>
                  {children}
                  <Toaster />
                </Suspense>
              </AnalyticsProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

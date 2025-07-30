import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12">
              <Image
                src="/images/eagle-logo.png"
                alt="Legal Eagle Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-primary font-inter">Legal Eagle</span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your Legal Eagle account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
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
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Join thousands of businesses using Legal Eagle for GST compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{" "}
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

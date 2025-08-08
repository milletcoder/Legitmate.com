"use client"

// Compatibility shim to support existing imports from "@/hooks/use-auth".
// Re-export the consolidated hook from the AuthProvider.
export { useAuth } from "@/components/providers/auth-provider"

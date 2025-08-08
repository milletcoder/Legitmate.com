/**
 * Compatibility shim for legacy imports.
 * Ensures a named export `useAuth` exists at "@/hooks/use-auth".
 * This re-exports from the consolidated Auth Provider.
 */
export { useAuth } from "@/components/providers/auth-provider"

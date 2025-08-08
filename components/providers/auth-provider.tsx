"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: "admin" | "user" | "guest"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("legal_eagle_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === "test@example.com" && password === "password") {
        const mockUser: User = {
          id: "user-123",
          email,
          firstName: "John",
          lastName: "Doe",
          role: "user",
        }
        localStorage.setItem("legal_eagle_user", JSON.stringify(mockUser))
        setUser(mockUser)
        toast({
          title: "Login Successful",
          description: "Welcome back to Legal Eagle!",
        })
        router.push("/dashboard")
        setIsLoading(false)
        return true
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
        setIsLoading(false)
        return false
      }
    },
    [router],
  )

  const register = useCallback(
    async (email, password, firstName, lastName) => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you'd check if email already exists
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        role: "user",
      }
      localStorage.setItem("legal_eagle_user", JSON.stringify(mockUser))
      setUser(mockUser)
      toast({
        title: "Registration Successful",
        description: "Your Legal Eagle account has been created!",
      })
      router.push("/dashboard")
      setIsLoading(false)
      return true
    },
    [router],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("legal_eagle_user")
    setUser(null)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

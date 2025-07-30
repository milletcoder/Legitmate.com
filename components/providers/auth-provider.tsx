"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  companySize?: string
  gstin?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("legal-eagle-user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        firstName: "John",
        lastName: "Doe",
        companyName: "Demo Company",
      }

      setUser(mockUser)
      localStorage.setItem("legal-eagle-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: Partial<User>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email,
        firstName: userData?.firstName || "New",
        lastName: userData?.lastName || "User",
        companyName: userData?.companyName,
        companySize: userData?.companySize,
        gstin: userData?.gstin,
      }

      setUser(mockUser)
      localStorage.setItem("legal-eagle-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: "1",
        email: "user@gmail.com",
        firstName: "Google",
        lastName: "User",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      }

      setUser(mockUser)
      localStorage.setItem("legal-eagle-user", JSON.stringify(mockUser))
    } catch (error) {
      throw new Error("Google sign-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("legal-eagle-user")
  }

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

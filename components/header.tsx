"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  currentSection: string
  onNavigate: (section: string) => void
}

export function Header({ currentSection, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "blog", label: "Blog" },
    { id: "security", label: "Security" },
  ]

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="Legal Eagle home"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/images/eagle-logo.png"
                alt="Legal Eagle Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-primary font-inter">Legal Eagle</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`font-medium transition-colors hover:text-primary ${
                      currentSection === item.id ? "text-primary" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleNavClick("dashboard")}
              className="bg-primary hover:bg-primary-hover text-white font-semibold"
            >
              Dashboard
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border">
            <ul className="flex flex-col gap-4 pt-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`font-medium transition-colors hover:text-primary ${
                      currentSection === item.id ? "text-primary" : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <Button
                  onClick={() => handleNavClick("dashboard")}
                  className="bg-primary hover:bg-primary-hover text-white font-semibold w-full"
                >
                  Dashboard
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

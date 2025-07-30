"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { LandingPage } from "@/components/pages/landing-page"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState("home")

  const showSection = (sectionId: string) => {
    setCurrentSection(sectionId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentSection={currentSection} onNavigate={showSection} />

      <main id="main">
        <LandingPage />
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  onNavigate: (section: string) => void
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="bg-primary text-white py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter leading-tight">
          AI-Drafted GST Notice Responses
          <span className="text-cta block mt-2">in 60 seconds</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto font-lora">
          Legal Eagle analyses your GST notice, cites the right circulars and generates an on-point reply—so you can
          sleep easy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => onNavigate("pricing")}
            size="lg"
            className="bg-cta hover:bg-orange-500 text-white font-semibold text-lg px-8 py-4"
          >
            Try Legal Eagle for ₹999
          </Button>
          <Button
            onClick={() => onNavigate("features")}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4"
          >
            See Features
          </Button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          <span className="text-blue-200 font-medium">Trusted by:</span>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
            FICCI
          </Badge>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
            NASSCOM
          </Badge>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
            ISO 27001 Roadmap
          </Badge>
        </div>
      </div>
    </section>
  )
}

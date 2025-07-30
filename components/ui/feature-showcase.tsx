"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Calendar, BarChart3 } from "lucide-react"

const features = [
  {
    id: "ai-drafts",
    title: "AI-Powered Drafts",
    icon: <Sparkles className="w-6 h-6" />,
    description: "Upload your GST notice and get a professionally drafted response in seconds",
    image: "/placeholder.svg?height=400&width=600&text=AI+Draft+Interface",
    highlights: ["99.7% accuracy", "Legal citations", "60-second generation"],
  },
  {
    id: "calendar",
    title: "Smart Calendar",
    icon: <Calendar className="w-6 h-6" />,
    description: "Never miss a deadline with intelligent reminders and calendar sync",
    image: "/placeholder.svg?height=400&width=600&text=Smart+Calendar",
    highlights: ["Google Calendar sync", "Multi-channel alerts", "Deadline tracking"],
  },
  {
    id: "analytics",
    title: "Advanced Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    description: "Comprehensive insights into your compliance performance",
    image: "/placeholder.svg?height=400&width=600&text=Analytics+Dashboard",
    highlights: ["Performance metrics", "Trend analysis", "Custom reports"],
  },
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState("ai-drafts")

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white border-0">Interactive Demo</Badge>
        <h3 className="text-2xl font-bold text-primary font-inter mb-2">Experience Legal Eagle</h3>
        <p className="text-muted-foreground font-lora">Explore our key features with interactive previews</p>
      </div>

      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {feature.icon}
              <span className="hidden sm:inline">{feature.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                  <h4 className="text-xl font-semibold font-inter">{feature.title}</h4>
                </div>

                <p className="text-muted-foreground font-lora leading-relaxed">{feature.description}</p>

                <div className="space-y-2">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Button className="bg-primary hover:bg-primary/90">Try This Feature</Button>
              </div>

              <div className="relative">
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt={`${feature.title} preview`}
                  className="rounded-lg shadow-lg w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

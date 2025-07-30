"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    name: "Rohit Sharma",
    company: "Knitwear Co.",
    quote:
      "We responded to a ₹5 lakh GST demand in under an hour. No CA fees! Legal Eagle saved us both time and money.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Anjali Patel",
    company: "Spice D2C",
    quote:
      "Legal Eagle's calendar pinged me before every GSTR-3B. My stress level went from 100 to 0. Absolutely game-changing!",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Mohan Kumar",
    company: "SaaS Edge",
    quote: "Investors loved our compliance deck powered by Legal Eagle's dashboard KPIs. Professional and reliable.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary font-inter">Loved by Indian MSMEs</h2>

        <div className="relative">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl mb-6 text-gray-700 font-lora italic">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={`${testimonials[currentIndex].name} portrait`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <cite className="font-semibold text-primary font-inter not-italic">
                    {testimonials[currentIndex].name}
                  </cite>
                  <p className="text-sm text-text-secondary font-lora">{testimonials[currentIndex].company}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-transparent"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-transparent"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

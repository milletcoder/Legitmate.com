"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react"

interface Testimonial {
  name: string
  company: string
  role: string
  quote: string
  rating: number
  avatar: string
  verified: boolean
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="bg-white shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <blockquote className="text-lg md:text-xl mb-8 text-gray-700 font-lora italic leading-relaxed">
            "{testimonials[currentIndex].quote}"
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <img
              src={testimonials[currentIndex].avatar || "/placeholder.svg"}
              alt={`${testimonials[currentIndex].name} portrait`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <cite className="font-semibold text-primary font-inter not-italic">
                  {testimonials[currentIndex].name}
                </cite>
                {testimonials[currentIndex].verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-sm text-muted-foreground font-lora">{testimonials[currentIndex].role}</p>
              <p className="text-sm text-muted-foreground font-lora">{testimonials[currentIndex].company}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 p-0 bg-white shadow-lg hover:shadow-xl"
        onClick={prevTestimonial}
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={20} />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 p-0 bg-white shadow-lg hover:shadow-xl"
        onClick={nextTestimonial}
        aria-label="Next testimonial"
      >
        <ChevronRight size={20} />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

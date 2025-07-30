import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const features = [
  "Unlimited GST notice drafts",
  "AI-powered response generation",
  "Smart compliance calendar",
  "Document vault with encryption",
  "Priority CA support",
  "Real-time notifications",
  "Compliance analytics dashboard",
  "One-click GSTN integration",
  "Multi-user access (up to 5 users)",
  "API access for integrations",
]

export function PricingSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-inter">Transparent Pricing</h2>
          <p className="text-xl text-text-secondary font-lora">
            One simple plan with everything you need for GST compliance
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2">
              <Badge className="bg-cta text-white font-semibold">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>

            <CardHeader className="text-center pt-12 pb-6">
              <CardTitle className="text-2xl font-bold mb-4 font-inter">Legal Eagle Pro</CardTitle>
              <div className="mb-4">
                <span className="text-5xl font-bold text-primary">₹17,999</span>
                <span className="text-text-secondary font-lora ml-2">/ year</span>
              </div>
              <p className="text-text-secondary font-lora">Complete GST compliance solution for growing businesses</p>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-accent mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-sm font-lora">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-cta hover:bg-orange-500 text-white font-bold text-lg py-6" size="lg" asChild>
                <a href="https://buy.stripe.com/test_9AQ5lE9XU5b9focdQQ" target="_blank" rel="noopener noreferrer">
                  Subscribe – ₹17,999/yr
                </a>
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-text-secondary font-lora">30-day money-back guarantee • Cancel anytime</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-text-secondary font-lora mb-4">Need a custom solution for your enterprise?</p>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}

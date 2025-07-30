import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Calendar, FileCheck, Shield, Clock, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <Sparkles className="text-cta" size={32} />,
    title: "AI-Powered Drafts",
    description:
      "Upload your GST notice PDF and let our fine-tuned model draft a crystal-clear, reference-rich reply with proper legal citations.",
  },
  {
    icon: <Calendar className="text-accent" size={32} />,
    title: "Smart Compliance Calendar",
    description:
      "Never miss a filing date again—deadlines sync to Google Calendar with intelligent email and SMS reminders.",
  },
  {
    icon: <FileCheck className="text-primary" size={32} />,
    title: "One-Click Filings",
    description:
      "Generate JSON returns directly from the dashboard and upload seamlessly to the GSTN portal with validation checks.",
  },
  {
    icon: <Shield className="text-green-600" size={32} />,
    title: "Secure Document Vault",
    description: "Store all your compliance documents in our encrypted vault with version control and audit trails.",
  },
  {
    icon: <Clock className="text-blue-600" size={32} />,
    title: "Real-Time Notifications",
    description:
      "Get instant alerts for new notices, deadline reminders, and regulatory updates via multiple channels.",
  },
  {
    icon: <TrendingUp className="text-purple-600" size={32} />,
    title: "Compliance Analytics",
    description:
      "Track your compliance score, identify trends, and get actionable insights to improve your tax management.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-inter">
            Features that save you weekends
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-lora">
            Comprehensive GST compliance tools designed specifically for Indian MSMEs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-xl font-inter">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary font-lora leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

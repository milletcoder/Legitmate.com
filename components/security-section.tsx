import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileCheck, Globe, Server, UserCheck } from "lucide-react"

const securityFeatures = [
  {
    icon: <Lock className="text-primary" size={32} />,
    title: "256-bit TLS Encryption",
    description:
      "All data in transit is encrypted using industry-standard TLS 1.3 protocol, ensuring your sensitive GST information remains secure.",
  },
  {
    icon: <Shield className="text-accent" size={32} />,
    title: "ISO 27001 Roadmap",
    description:
      "We're on track for ISO 27001 certification by Q4 2025, implementing comprehensive information security management systems.",
  },
  {
    icon: <FileCheck className="text-green-600" size={32} />,
    title: "GDPR & DPDP Ready",
    description:
      "Our data processing agreements and privacy policies meet India's DPDP Act 2023 and EU GDPR requirements.",
  },
  {
    icon: <Server className="text-blue-600" size={32} />,
    title: "Secure Cloud Infrastructure",
    description: "Hosted on AWS with multi-region backup, 99.9% uptime SLA, and automated security monitoring.",
  },
  {
    icon: <UserCheck className="text-purple-600" size={32} />,
    title: "Role-Based Access Control",
    description: "Granular permissions system ensures only authorized personnel can access sensitive compliance data.",
  },
  {
    icon: <Globe className="text-orange-600" size={32} />,
    title: "Audit Trail & Compliance",
    description: "Complete audit logs for all actions, helping you maintain compliance with regulatory requirements.",
  },
]

export function SecuritySection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-inter">Security & Compliance</h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-lora">
            Enterprise-grade security measures to protect your sensitive business data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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

        <div className="mt-12 text-center">
          <Card className="bg-primary text-white max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 font-inter">Your Data Security is Our Priority</h3>
              <p className="font-lora mb-6">
                We understand the sensitive nature of GST and compliance data. That's why we've implemented bank-level
                security measures and maintain the highest standards of data protection.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">SOC 2 Type II</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">PCI DSS</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">HIPAA Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

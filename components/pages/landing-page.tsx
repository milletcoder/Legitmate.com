"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Sparkles,
  Shield,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Lock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { GuestUploadModal } from "@/components/modals/guest-upload-modal"
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel"
import { StatsCounter } from "@/components/ui/stats-counter"
import { FeatureShowcase } from "@/components/ui/feature-showcase"

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-cta" />,
    title: "AI-Powered Draft Generation",
    description:
      "Upload your GST notice and get a professionally drafted response in under 60 seconds with proper legal citations and compliance references.",
    benefits: ["99.7% accuracy rate", "Legal citation engine", "Instant generation"],
  },
  {
    icon: <Clock className="h-8 w-8 text-accent" />,
    title: "Smart Compliance Calendar",
    description:
      "Never miss a deadline with intelligent reminders, automatic sync to Google Calendar, and proactive compliance notifications.",
    benefits: ["Multi-channel alerts", "Calendar integration", "Deadline tracking"],
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Enterprise Security",
    description:
      "Bank-grade security with 256-bit encryption, SOC 2 compliance, and comprehensive audit trails for complete peace of mind.",
    benefits: ["ISO 27001 ready", "GDPR compliant", "Audit trails"],
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-600" />,
    title: "Document Vault",
    description:
      "Secure, encrypted storage for all your compliance documents with version control and intelligent organization.",
    benefits: ["Unlimited storage", "Version control", "Smart search"],
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    title: "Analytics Dashboard",
    description:
      "Comprehensive insights into your compliance performance with predictive analytics and trend analysis.",
    benefits: ["Performance metrics", "Trend analysis", "Custom reports"],
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Team Collaboration",
    description:
      "Multi-user access with role-based permissions, collaborative workflows, and team performance tracking.",
    benefits: ["Role-based access", "Team workflows", "Performance tracking"],
  },
]

const testimonials = [
  {
    name: "Rohit Sharma",
    company: "Knitwear Co.",
    role: "Managing Director",
    quote:
      "Legal Eagle helped us respond to a ₹5 lakh GST demand in under an hour. The AI-generated response was spot-on with proper legal citations. No CA fees required!",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
  },
  {
    name: "Anjali Patel",
    company: "Spice D2C",
    role: "Compliance Head",
    quote:
      "The smart calendar feature is a game-changer. We never miss GSTR-3B deadlines anymore. My stress level went from 100 to 0. Absolutely revolutionary!",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
  },
  {
    name: "Mohan Kumar",
    company: "SaaS Edge",
    role: "CFO",
    quote:
      "Our investors were impressed with the compliance dashboard. The analytics and reporting features helped us secure Series A funding. Professional and reliable.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
  },
  {
    name: "Priya Reddy",
    company: "Tech Innovations",
    role: "Founder",
    quote:
      "The document vault and team collaboration features transformed our compliance workflow. We're now 10x more efficient with GST management.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
    verified: true,
  },
]

const faqs = [
  {
    question: "Is Legal Eagle a replacement for a Chartered Accountant?",
    answer:
      "No, Legal Eagle is not a replacement for a CA. It's an intelligent tool that helps you create professional first-draft responses to GST notices, which can then be reviewed by your Chartered Accountant or legal advisor. Think of it as your AI-powered compliance assistant that works alongside your existing team.",
  },
  {
    question: "How secure is my data with Legal Eagle?",
    answer:
      "Your data security is our top priority. We use bank-grade 256-bit encryption, store data on secure Google Cloud infrastructure, and maintain SOC 2 Type II compliance. We're also on track for ISO 27001 certification and fully comply with GDPR and India's DPDP Act 2023.",
  },
  {
    question: "What exactly do I get for my subscription?",
    answer:
      "Your Legal Eagle Pro subscription includes unlimited AI-generated GST notice responses, smart compliance calendar with reminders, secure document vault, team collaboration tools, comprehensive analytics dashboard, priority support, and access to our legal expert network.",
  },
  {
    question: "How accurate are the AI-generated responses?",
    answer:
      "Our AI has a 99.7% accuracy rate based on over 10,000 processed notices. It's trained on the latest GST regulations, circulars, and case law. Each response includes proper legal citations and is structured according to best practices followed by tax professionals.",
  },
  {
    question: "Can I customize the responses for my business?",
    answer:
      "Legal Eagle learns from your business context and previous responses. You can set up custom templates, add your company-specific information, and the AI will adapt its responses to match your communication style and business requirements.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Pro subscribers get priority email and chat support with response times under 2 hours during business hours. We also provide onboarding assistance, training sessions, and access to our network of tax experts for complex cases.",
  },
]

const stats = [
  { label: "Businesses Trust Us", value: 5000, suffix: "+" },
  { label: "Notices Processed", value: 50000, suffix: "+" },
  { label: "Average Response Time", value: 45, suffix: "s" },
  { label: "Customer Satisfaction", value: 99.8, suffix: "%" },
]

const trustBadges = [
  { name: "FICCI", logo: "/images/badges/ficci.png" },
  { name: "NASSCOM", logo: "/images/badges/nasscom.png" },
  { name: "ISO 27001", logo: "/images/badges/iso27001.png" },
  { name: "SOC 2", logo: "/images/badges/soc2.png" },
  { name: "GDPR", logo: "/images/badges/gdpr.png" },
]

export function LandingPage() {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Reviews
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setIsGuestModalOpen(true)} className="hidden sm:inline-flex">
                Try Free
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-cta hover:bg-cta/90">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-accent/20 text-white">
        <motion.div style={{ y }} className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />

        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-cta/20 text-cta border-cta/30 hover:bg-cta/30">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered GST Compliance
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-inter leading-tight">
                AI-Drafted GST Notice Responses
                <span className="block text-cta mt-2">in 60 seconds</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto font-lora leading-relaxed">
                Legal Eagle analyzes your GST notice, cites the right circulars, and generates an on-point reply—so you
                can sleep easy while staying compliant.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="bg-cta hover:bg-cta/90 text-white font-semibold text-lg px-8 py-4 h-auto"
                  onClick={() => setIsGuestModalOpen(true)}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try Legal Eagle Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 h-auto bg-transparent"
                  asChild
                >
                  <Link href="#features">
                    See Features
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center items-center gap-8 mb-12"
            >
              <span className="text-blue-200 font-medium">Trusted by:</span>
              {trustBadges.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 px-4 py-2 hover:bg-white/20 transition-colors"
                >
                  {badge.name}
                </Badge>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cta mb-2">
                    <StatsCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Award className="w-4 h-4 mr-2" />
              Enterprise Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">
              Features that save you weekends
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              Comprehensive GST compliance tools designed specifically for Indian MSMEs, powered by cutting-edge AI
              technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group hover:border-l-cta">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl font-inter group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base font-lora leading-relaxed mb-4">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <FeatureShowcase />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">How Legal Eagle Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              Get professional GST notice responses in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-cta"></div>

              {[
                {
                  step: "1",
                  title: "Upload Your GST Notice",
                  description:
                    "Securely upload your GST notice in PDF or image format. Our system supports all major file types and ensures complete data privacy.",
                  icon: <FileText className="w-8 h-8" />,
                },
                {
                  step: "2",
                  title: "AI-Powered Analysis",
                  description:
                    "Our advanced AI analyzes your notice, identifies key issues, and references relevant GST provisions and circulars for accurate responses.",
                  icon: <Sparkles className="w-8 h-8" />,
                },
                {
                  step: "3",
                  title: "Receive Professional Response",
                  description:
                    "Get your professionally drafted response with proper legal citations, ready for review and submission to tax authorities.",
                  icon: <CheckCircle className="w-8 h-8" />,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg relative z-10">
                      {step.step}
                    </div>
                    <div className="absolute inset-0 w-16 h-16 mx-auto bg-primary/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mb-4 flex justify-center text-primary">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 font-inter">{step.title}</h3>
                  <p className="text-muted-foreground font-lora leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample Response */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <FileText className="w-4 h-4 mr-2" />
              Sample Output
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">See Legal Eagle in Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              Here's an example of the professional GST notice response our AI generates
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-900 text-green-400 border-0 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-400">GST_Notice_Response_Draft.txt</span>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                  {`Subject: Preliminary Draft Response to GST Notice – [Notice Number]

To: [GST Officer's Name / Jurisdictional Office]
From: [Your Business Name], [GSTIN]
Date: [dd/mm/yyyy]
Notice Reference: [Reference Number or Notice Date]

Respected Sir/Madam,

This is with reference to the GST notice dated [dd/mm/yyyy] received under Section [XX] of the CGST Act, 2017, bearing reference number [XXX].

We acknowledge receipt of the notice and are grateful for the opportunity to respond. Please find below our point-wise reply, based on the issues raised:

Issue 1: Non-reconciliation of GSTR-3B and GSTR-2A
Observation: Mismatch between Input Tax Credit (ITC) claimed in GSTR-3B and credits reflected in GSTR-2A.

Draft Response: Upon preliminary review, the difference primarily pertains to invoices issued by suppliers who may have delayed filing their GSTR-1. We are in communication with these suppliers for rectification. Supporting documents including purchase invoices are available and can be furnished upon request.

Issue 2: Non-payment of Tax on Reverse Charge
Observation: Certain payments liable under Reverse Charge Mechanism (RCM) have not been discharged.

Draft Response: As per our records, the tax under RCM has been paid via cash ledger and duly disclosed in GSTR-3B under the specified table. Supporting challans and working papers are available for verification.

Conclusion: This communication is a preliminary, well-structured draft summarizing our factual position. The final response will be duly reviewed and submitted in coordination with our authorized tax advisor.

Thank you for your consideration.

Warm regards,
[Your Name]
[Designation]
[Contact Information]`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">Loved by Indian MSMEs</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              Join thousands of businesses who trust Legal Eagle for their GST compliance needs
            </p>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              One comprehensive plan with everything you need for GST compliance
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary shadow-2xl">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-center py-3">
                <Badge className="bg-cta text-white font-semibold border-0">
                  <Star className="w-4 h-4 mr-1" />
                  Most Popular
                </Badge>
              </div>

              <CardHeader className="text-center pt-16 pb-8">
                <CardTitle className="text-3xl font-bold mb-4 font-inter">Legal Eagle Pro</CardTitle>
                <div className="mb-6">
                  <span className="text-6xl font-bold text-primary">₹17,999</span>
                  <span className="text-xl text-muted-foreground font-lora ml-2">/ year</span>
                </div>
                <CardDescription className="text-lg font-lora">
                  Complete GST compliance solution for growing businesses
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {[
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
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-accent mt-0.5 flex-shrink-0 w-5 h-5" />
                      <span className="font-lora">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-cta hover:bg-cta/90 text-white font-bold text-lg py-6 h-auto mb-4"
                  size="lg"
                  asChild
                >
                  <Link href="/register">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-lora">
                    30-day money-back guarantee • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground font-lora mb-4">Need a custom solution for your enterprise?</p>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
              <Globe className="w-4 h-4 mr-2" />
              Support
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary font-inter">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-lora">
              Everything you need to know about Legal Eagle
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-6 bg-white shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold font-inter hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-lora leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-accent/20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-cta/20 text-cta border-cta/30">
              <Lock className="w-4 h-4 mr-2" />
              Secure & Trusted
            </Badge>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-inter">Ready to Transform Your GST Compliance?</h2>

            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto font-lora">
              Join thousands of businesses who have streamlined their GST compliance with Legal Eagle's AI-powered
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cta hover:bg-cta/90 text-white font-semibold text-lg px-8 py-4 h-auto"
                asChild
              >
                <Link href="/register">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-4 h-auto bg-transparent"
                onClick={() => setIsGuestModalOpen(true)}
              >
                Try Without Signup
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/eagle-logo.png"
                    alt="Legal Eagle Logo"
                    width={40}
                    height={40}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <span className="text-2xl font-bold font-inter">Legal Eagle</span>
              </div>
              <p className="text-gray-300 font-lora mb-6 max-w-md">
                AI-powered GST compliance platform designed specifically for Indian MSMEs. Simplify your tax compliance
                with intelligent automation.
              </p>
              <div className="flex gap-4">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  Trusted by 5000+ businesses
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-inter">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-inter">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 font-lora">© 2025 Legal Eagle. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Guest Upload Modal */}
      <GuestUploadModal isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)} />
    </div>
  )
}

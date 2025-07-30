"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CreditCard, Sparkles, CheckCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GuestUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "upload" | "payment" | "processing" | "result"

export function GuestUploadModal({ isOpen, onClose }: GuestUploadModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [progress, setProgress] = useState(0)
  const [aiResponse, setAiResponse] = useState("")
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleNext = () => {
    if (currentStep === "upload" && file && email) {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("processing")
      simulateProcessing()
    }
  }

  const simulateProcessing = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setCurrentStep("result")
          setAiResponse(`Subject: Preliminary Draft Response to GST Notice – [Notice Number]

To: [GST Officer's Name / Jurisdictional Office]
From: [Your Business Name], [GSTIN]
Date: [dd/mm/yyyy]

Respected Sir/Madam,

This is with reference to the GST notice dated [dd/mm/yyyy] received under Section [XX] of the CGST Act, 2017.

We acknowledge receipt and are grateful for the opportunity to respond. Please find below our point-wise reply:

Issue 1: Non-reconciliation of GSTR-3B and GSTR-2A
Upon preliminary review, the difference primarily pertains to invoices issued by suppliers who may have delayed filing their GSTR-1. We are in communication with these suppliers for rectification.

Issue 2: Non-payment of Tax on Reverse Charge
As per our records, the tax under RCM has been paid via cash ledger and duly disclosed in GSTR-3B under the specified table.

This is a preliminary draft for clarity purposes. Final response will be coordinated with our tax advisor.

Thank you for your consideration.`)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResponse)
    toast({
      title: "Copied to clipboard",
      description: "The AI-generated response has been copied to your clipboard.",
    })
  }

  const handleClose = () => {
    setCurrentStep("upload")
    setFile(null)
    setEmail("")
    setProgress(0)
    setAiResponse("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cta" />
            Try Legal Eagle Free
          </DialogTitle>
          <DialogDescription>
            Upload your GST notice and get an AI-generated response draft in minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { step: "upload", label: "Upload", icon: Upload },
              { step: "payment", label: "Payment", icon: CreditCard },
              { step: "processing", label: "Processing", icon: Sparkles },
              { step: "result", label: "Result", icon: CheckCircle },
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep === step
                      ? "bg-primary text-white border-primary"
                      : index < ["upload", "payment", "processing", "result"].indexOf(currentStep)
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-2 hidden sm:block" />}
              </div>
            ))}
          </div>

          {/* Upload Step */}
          {currentStep === "upload" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload GST Notice</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop your GST notice</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </label>
                </div>
                {file && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">{file.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">We'll send the AI response to this email</p>
              </div>

              <Button onClick={handleNext} disabled={!file || !email} className="w-full">
                Continue to Payment
              </Button>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">₹999</div>
                <p className="text-sm text-gray-600">One-time payment for AI-generated response</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4 text-center">Scan QR Code to Pay</h4>
                <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
                    <p className="text-xs text-gray-500">UPI QR Code</p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Or pay via UPI ID: <strong>legaleagle@upi</strong>
                </p>
              </div>

              <Button onClick={handleNext} className="w-full bg-green-600 hover:bg-green-700">
                I've Completed Payment
              </Button>
            </div>
          )}

          {/* Processing Step */}
          {currentStep === "processing" && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold">AI is analyzing your notice...</h3>
              <p className="text-gray-600">This usually takes 30-60 seconds</p>
              <Progress value={progress} className="w-full" />
              <div className="text-sm text-gray-500">
                {progress < 30 && "Reading and understanding your GST notice..."}
                {progress >= 30 && progress < 60 && "Identifying key issues and requirements..."}
                {progress >= 60 && progress < 90 && "Generating professional response with legal citations..."}
                {progress >= 90 && "Finalizing your draft response..."}
              </div>
            </div>
          )}

          {/* Result Step */}
          {currentStep === "result" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">Response Generated Successfully!</h3>
                <p className="text-gray-600">Your AI-drafted GST notice response is ready</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>AI-Generated Response</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">98% Confidence</Badge>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <Textarea value={aiResponse} readOnly className="min-h-[300px] font-mono text-sm" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Review the draft response carefully</li>
                  <li>• Customize with your specific details</li>
                  <li>• Have it reviewed by your CA or legal advisor</li>
                  <li>• Submit to the tax authorities within the deadline</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button className="flex-1 bg-cta hover:bg-cta/90">Create Account for More Features</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIResponse {
  summary: string
  checklist: string[]
  draftReply: string
  nextSteps: string[]
}

export function AINoticeResponder() {
  const [noticeText, setNoticeText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [response, setResponse] = useState<AIResponse | null>(null)
  const { toast } = useToast()

  const handleDraftReply = async () => {
    if (!noticeText.trim()) {
      toast({
        title: "Notice Required",
        description: "Please paste your GST notice text to generate a response.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call for demo - replace with actual Gemini API integration
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock response - replace with actual API response parsing
      const mockResponse: AIResponse = {
        summary:
          "This is a GSTR-3B non-filing notice for the period July 2024. The department has identified a discrepancy in your return filing and is requesting clarification along with supporting documents.",
        checklist: [
          "Gather GSTR-3B return for July 2024",
          "Collect supporting invoices and purchase documents",
          "Prepare bank statements showing tax payments",
          "Draft covering letter explaining the delay",
          "Ensure all documents are properly signed and dated",
        ],
        draftReply: `Subject: Response to GST Notice - GSTR-3B Filing Clarification

Dear Sir/Madam,

With reference to your notice dated [DATE] regarding GSTR-3B filing for July 2024, I hereby submit the following clarification:

1. The return for the said period was filed on [DATE] with acknowledgment number [ACK_NO].

2. The apparent discrepancy mentioned in your notice pertains to [SPECIFIC_ISSUE], which occurred due to [REASON].

3. I have enclosed the following supporting documents:
   - Copy of filed GSTR-3B return
   - Supporting invoices and bills
   - Bank statements showing tax payments
   - [OTHER_DOCUMENTS]

I request you to kindly consider the above explanation and supporting documents. I assure you of my continued compliance with GST regulations.

Thanking you,
[YOUR_NAME]
[GSTIN]
[DATE]`,
        nextSteps: [
          "Review and customize the draft reply with your specific details",
          "Attach all supporting documents mentioned in the checklist",
          "Submit the response within the stipulated time frame",
          "Keep copies of all submitted documents for your records",
          "Follow up with the department if no acknowledgment is received within 15 days",
        ],
      }

      setResponse(mockResponse)
      toast({
        title: "Response Generated Successfully",
        description: "Your AI-drafted GST notice response is ready for review.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-inter">
          <Sparkles className="text-cta" size={24} />
          AI Notice Responder
        </CardTitle>
        <p className="text-sm text-text-secondary font-lora">
          Paste your GST notice below and get an AI-drafted response in seconds
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="notice-text" className="block text-sm font-medium mb-2">
            GST Notice Text
          </label>
          <Textarea
            id="notice-text"
            placeholder="Paste your GST notice content here..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleDraftReply}
          disabled={isProcessing || !noticeText.trim()}
          className="w-full bg-primary hover:bg-primary-hover text-white font-semibold"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Notice...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Draft AI Response
            </>
          )}
        </Button>

        {response && (
          <div className="space-y-6 mt-8">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-primary mb-2 font-inter">📋 Notice Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-lora">{response.summary}</p>
                </CardContent>
              </Card>
            </div>

            {/* Checklist */}
            <div>
              <h3 className="font-semibold text-primary mb-2 font-inter">✅ Document Checklist</h3>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {response.checklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-accent mt-1">•</span>
                        <span className="font-lora">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Draft Reply */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-primary font-inter">📝 Draft Reply</h3>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(response.draftReply)}>
                  <Copy size={16} className="mr-1" />
                  Copy
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap text-sm font-lora bg-gray-50 p-4 rounded border">
                    {response.draftReply}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold text-primary mb-2 font-inter">🎯 Next Steps</h3>
              <Card>
                <CardContent className="p-4">
                  <ol className="space-y-2">
                    {response.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">
                          {index + 1}
                        </Badge>
                        <span className="font-lora">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

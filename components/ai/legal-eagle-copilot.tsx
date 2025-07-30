"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bot, Send, Paperclip, Mic, MicOff, FileText, Scale, Shield, Clock, Lightbulb, Sparkles } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion" | "analysis"
}

const quickSuggestions = [
  {
    icon: FileText,
    title: "Draft Contract",
    description: "Create a new contract template",
    prompt: "Help me draft a service agreement contract",
  },
  {
    icon: Scale,
    title: "Legal Research",
    description: "Research case law and precedents",
    prompt: "Research recent cases about intellectual property disputes",
  },
  {
    icon: Shield,
    title: "Compliance Check",
    description: "Review document compliance",
    prompt: "Check this document for GDPR compliance issues",
  },
  {
    icon: Clock,
    title: "Deadline Tracker",
    description: "Set up deadline reminders",
    prompt: "Help me track important legal deadlines",
  },
]

const aiCapabilities = [
  "Document Analysis & Review",
  "Legal Research & Citations",
  "Contract Drafting",
  "Compliance Monitoring",
  "Risk Assessment",
  "Case Law Research",
]

export function LegalEagleCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your Legal Eagle AI assistant. I can help you with document analysis, legal research, contract drafting, and compliance matters. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
        type: "analysis",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "I've analyzed your request. Based on current legal standards and best practices, here are my recommendations...",
      "Let me help you with that legal matter. I've reviewed relevant case law and regulations...",
      "I can assist you with this document review. Here's what I found regarding compliance and potential risks...",
      "Based on my analysis of similar cases and current legal precedents, I recommend the following approach...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickSuggestion = (suggestion: (typeof quickSuggestions)[0]) => {
    handleSendMessage(suggestion.prompt)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input implementation would go here
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 z-50">
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open Legal Eagle AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[480px] p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left">Legal Eagle AI</SheetTitle>
                <SheetDescription className="text-left">Your intelligent legal assistant</SheetDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {aiCapabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs">
                +{aiCapabilities.length - 3} more
              </Badge>
            </div>
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] space-x-2 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.sender === "ai" ? (
                        <AvatarFallback className="bg-gradient-primary text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback>U</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="border-t p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion.title}
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 flex flex-col items-start text-left bg-transparent"
                    onClick={() => handleQuickSuggestion(suggestion)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <suggestion.icon className="h-4 w-4" />
                      <span className="font-medium text-xs">{suggestion.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{suggestion.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex space-x-2"
            >
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about legal matters..."
                  disabled={isLoading}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={toggleVoiceInput}>
                    {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Paperclip className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are for informational purposes only and do not constitute legal advice.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

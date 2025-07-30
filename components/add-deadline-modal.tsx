"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface AddDeadlineModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (deadline: {
    title: string
    date: string
    category: "GST" | "TDS" | "ROC"
    priority: "high" | "medium" | "low"
  }) => void
}

export function AddDeadlineModal({ isOpen, onClose, onAdd }: AddDeadlineModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState<"GST" | "TDS" | "ROC">("GST")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    onAdd({
      title: title.trim(),
      date,
      category,
      priority,
    })

    // Reset form
    setTitle("")
    setDate("")
    setCategory("GST")
    setPriority("medium")

    toast({
      title: "Deadline Added",
      description: "Your compliance deadline has been added successfully.",
    })

    onClose()
  }

  const handleClose = () => {
    setTitle("")
    setDate("")
    setCategory("GST")
    setPriority("medium")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-inter">Add Compliance Deadline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., GSTR-3B Filing"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Deadline Date *</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: "GST" | "TDS" | "ROC") => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GST">GST</SelectItem>
                <SelectItem value="TDS">TDS</SelectItem>
                <SelectItem value="ROC">ROC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              Add Deadline
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

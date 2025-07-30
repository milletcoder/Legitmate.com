"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock } from "lucide-react"
import { AddDeadlineModal } from "@/components/add-deadline-modal"

interface Deadline {
  id: string
  title: string
  date: string
  category: "GST" | "TDS" | "ROC"
  priority: "high" | "medium" | "low"
}

const mockDeadlines: Deadline[] = [
  {
    id: "1",
    title: "GSTR-3B Filing",
    date: "2025-01-20",
    category: "GST",
    priority: "high",
  },
  {
    id: "2",
    title: "TDS Return Q3",
    date: "2025-01-31",
    category: "TDS",
    priority: "medium",
  },
  {
    id: "3",
    title: "Annual ROC Filing",
    date: "2025-02-15",
    category: "ROC",
    priority: "low",
  },
]

export function ComplianceCalendar() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(mockDeadlines)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addDeadline = (deadline: Omit<Deadline, "id">) => {
    const newDeadline = {
      ...deadline,
      id: Date.now().toString(),
    }
    setDeadlines([...deadlines, newDeadline])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "GST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "TDS":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "ROC":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary font-inter">
              <Calendar className="text-accent" size={24} />
              Compliance Calendar
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <p className="text-sm text-text-secondary font-lora">Never miss a compliance deadline again</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {deadlines.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-lora">No deadlines scheduled</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="mt-2">
                Add your first deadline
              </Button>
            </div>
          ) : (
            deadlines.map((deadline) => (
              <Card key={deadline.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm font-inter">{deadline.title}</h4>
                    <Badge className={getPriorityColor(deadline.priority)}>{deadline.priority}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary font-lora">{formatDate(deadline.date)}</p>
                    <Badge className={getCategoryColor(deadline.category)}>{deadline.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <AddDeadlineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addDeadline} />
    </>
  )
}

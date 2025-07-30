"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, AlertTriangle, CheckCircle, Plus, Filter } from "lucide-react"
import { format, isToday, isTomorrow, addDays } from "date-fns"

interface ComplianceEvent {
  id: string
  title: string
  description: string
  date: Date
  priority: "high" | "medium" | "low"
  status: "pending" | "completed" | "overdue"
  category: "audit" | "filing" | "review" | "training"
}

const mockEvents: ComplianceEvent[] = [
  {
    id: "1",
    title: "GDPR Audit Review",
    description: "Quarterly data protection compliance review",
    date: new Date(),
    priority: "high",
    status: "pending",
    category: "audit",
  },
  {
    id: "2",
    title: "Employment Law Filing",
    description: "Submit quarterly employment compliance report",
    date: addDays(new Date(), 1),
    priority: "high",
    status: "pending",
    category: "filing",
  },
  {
    id: "3",
    title: "Contract Review Deadline",
    description: "Review and update vendor contracts",
    date: addDays(new Date(), 3),
    priority: "medium",
    status: "pending",
    category: "review",
  },
  {
    id: "4",
    title: "Security Training",
    description: "Mandatory cybersecurity training for all staff",
    date: addDays(new Date(), 7),
    priority: "medium",
    status: "pending",
    category: "training",
  },
  {
    id: "5",
    title: "Tax Compliance Review",
    description: "Monthly tax compliance check completed",
    date: addDays(new Date(), -2),
    priority: "high",
    status: "completed",
    category: "review",
  },
]

const getPriorityColor = (priority: ComplianceEvent["priority"]) => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "secondary"
    default:
      return "secondary"
  }
}

const getStatusIcon = (status: ComplianceEvent["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-success" />
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-destructive" />
    case "pending":
    default:
      return <Clock className="h-4 w-4 text-warning" />
  }
}

const formatEventDate = (date: Date) => {
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  return format(date, "MMM d")
}

export function ComplianceCalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events] = useState<ComplianceEvent[]>(mockEvents)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  const upcomingEvents = events
    .filter((event) => event.date >= new Date() && event.status !== "completed")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  const todayEvents = events.filter((event) => isToday(event.date))

  const eventDates = events.map((event) => event.date)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <CardTitle>Compliance Calendar</CardTitle>
            {todayEvents.length > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {todayEvents.length} due today
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "calendar" ? (
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                eventDay: eventDates,
              }}
              modifiersStyles={{
                eventDay: {
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                },
              }}
            />
            {selectedDate && (
              <div className="space-y-2">
                <h4 className="font-medium">Events for {format(selectedDate, "MMMM d, yyyy")}</h4>
                {events
                  .filter((event) => format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                  .map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge variant={getPriorityColor(event.priority)} className="text-xs">
                        {event.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Upcoming Deadlines</h4>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
            <div className="space-y-2">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No upcoming deadlines</h3>
                  <p className="text-sm text-muted-foreground">You're all caught up with compliance tasks!</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {getStatusIcon(event.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <Badge variant={getPriorityColor(event.priority)} className="text-xs">
                          {event.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{event.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatEventDate(event.date)}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

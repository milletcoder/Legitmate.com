"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Download, Eye, Trash2, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface Document {
  id: string
  name: string
  type: "gst_notice" | "response_draft" | "compliance_doc"
  status: "processing" | "completed" | "error" | "pending"
  createdAt: Date
  size: string
  aiConfidence?: number
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "GST_Notice_GSTR3B_July2024.pdf",
    type: "gst_notice",
    status: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    size: "2.4 MB",
    aiConfidence: 98,
  },
  {
    id: "2",
    name: "Response_Draft_Input_Tax_Credit.pdf",
    type: "response_draft",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    size: "1.8 MB",
    aiConfidence: 95,
  },
  {
    id: "3",
    name: "Notice_Reconciliation_Mismatch.jpg",
    type: "gst_notice",
    status: "processing",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    size: "3.2 MB",
  },
  {
    id: "4",
    name: "Compliance_Report_Q3_2024.pdf",
    type: "compliance_doc",
    status: "error",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    size: "5.1 MB",
  },
  {
    id: "5",
    name: "GST_Assessment_Order_Response.pdf",
    type: "response_draft",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    size: "2.9 MB",
  },
]

function getStatusIcon(status: Document["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "processing":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-blue-600" />
  }
}

function getStatusBadge(status: Document["status"]) {
  const variants = {
    completed: "bg-green-100 text-green-800 border-green-200",
    processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
  }

  const labels = {
    completed: "Completed",
    processing: "Processing",
    error: "Error",
    pending: "Pending",
  }

  return <Badge className={variants[status]}>{labels[status]}</Badge>
}

function getTypeLabel(type: Document["type"]) {
  switch (type) {
    case "gst_notice":
      return "GST Notice"
    case "response_draft":
      return "Response Draft"
    case "compliance_doc":
      return "Compliance Doc"
  }
}

export function RecentDocuments() {
  const [documents] = useState<Document[]>(mockDocuments)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Documents
            </CardTitle>
            <CardDescription>Your latest processed documents and responses</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">{getStatusIcon(doc.status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    {doc.aiConfidence && (
                      <Badge variant="outline" className="text-xs">
                        {doc.aiConfidence}% AI
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{getTypeLabel(doc.type)}</span>
                    <span>{doc.size}</span>
                    <span>{formatDistanceToNow(doc.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

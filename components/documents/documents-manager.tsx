"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Upload,
  Search,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
  Share,
  Lock,
  Unlock,
  Star,
  User,
  Calendar,
  Tag,
  Folder,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  name: string
  type: string
  size: string
  category: string
  status: "draft" | "review" | "approved" | "archived"
  createdAt: Date
  updatedAt: Date
  createdBy: string
  tags: string[]
  isStarred: boolean
  isLocked: boolean
  version: string
}

const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Employment Agreement Template",
    type: "PDF",
    size: "2.4 MB",
    category: "HR",
    status: "approved",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    createdBy: "John Doe",
    tags: ["template", "employment", "hr"],
    isStarred: true,
    isLocked: false,
    version: "2.1",
  },
  {
    id: "2",
    name: "Client Confidentiality Agreement",
    type: "DOCX",
    size: "1.8 MB",
    category: "Contracts",
    status: "review",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-22"),
    createdBy: "Jane Smith",
    tags: ["confidentiality", "client", "nda"],
    isStarred: false,
    isLocked: true,
    version: "1.3",
  },
  {
    id: "3",
    name: "Compliance Audit Report Q4",
    type: "PDF",
    size: "5.2 MB",
    category: "Compliance",
    status: "draft",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    createdBy: "Mike Johnson",
    tags: ["audit", "compliance", "quarterly"],
    isStarred: false,
    isLocked: false,
    version: "1.0",
  },
]

const documentCategories = [
  { name: "All Documents", count: 156 },
  { name: "Contracts", count: 45 },
  { name: "HR", count: 32 },
  { name: "Compliance", count: 28 },
  { name: "Legal Briefs", count: 24 },
  { name: "Templates", count: 18 },
  { name: "Archived", count: 9 },
]

const getStatusColor = (status: Document["status"]) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "draft":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />
    case "docx":
    case "doc":
      return <FileText className="h-8 w-8 text-blue-500" />
    default:
      return <FileText className="h-8 w-8 text-gray-500" />
  }
}

export function DocumentsManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Documents")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All Documents" || doc.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleStar = (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc)))
  }

  const toggleLock = (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, isLocked: !doc.isLocked } : doc)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Manager</h1>
          <p className="text-muted-foreground">Organize, manage, and collaborate on legal documents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Folder className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {documentCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2 text-left hover:bg-muted/50 transition-colors",
                      selectedCategory === category.name && "bg-muted font-medium",
                    )}
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Documents</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Review</span>
                <span className="font-medium text-yellow-500">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Approved</span>
                <span className="font-medium text-green-500">98</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="font-medium">2.4 GB</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-1">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{getFileIcon(document.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold truncate">{document.name}</h3>
                        {document.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {document.isLocked && <Lock className="h-4 w-4 text-red-500" />}
                        <Badge className={cn("text-xs", getStatusColor(document.status))}>{document.status}</Badge>
                        <span className="text-xs text-muted-foreground">v{document.version}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{document.createdBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{document.updatedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{document.type}</span>
                          <span>•</span>
                          <span>{document.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(document.id)}
                        className={cn("h-8 w-8 p-0", document.isStarred && "text-yellow-500")}
                      >
                        <Star className={cn("h-4 w-4", document.isStarred && "fill-current")} />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleLock(document.id)}>
                            {document.isLocked ? (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Unlock
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Lock
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or upload a new document.
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

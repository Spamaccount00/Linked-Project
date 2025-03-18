"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Search,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { fetchLeads } from "@/lib/api-client"
import { type Lead, type LeadStatus, normalizeLeadStatus } from "@/lib/types"

export function DataTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Lead>("Name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load leads from the JSON file
    async function loadLeads() {
      setIsLoading(true)
      try {
        const data = await fetchLeads()
        if (Array.isArray(data) && data.length > 0) {
          setLeads(data)
        } else {
          // If no data is returned, set an empty array
          setLeads([])
        }
      } catch (error) {
        console.error("Error loading leads:", error)
        setLeads([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLeads()
  }, [])

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleGenerateMessage = async () => {
    setIsGeneratingMessage(true)

    try {
      // In a real implementation, this would call the backend to generate messages
      // For now, we'll just toggle the message display
      setShowMessages(true)

      toast({
        title: "Messages Displayed",
        description: "Personalized messages are now visible in the table.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const handleExportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(leads, null, 2))}`

    const link = document.createElement("a")
    link.href = jsonString
    link.download = "leads.json"
    link.click()
  }

  const getStatusBadge = (status: LeadStatus) => {
    const normalizedStatus = normalizeLeadStatus(status)

    switch (normalizedStatus) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>
      case "failure":
        return <Badge className="bg-red-500">Failure</Badge>
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading leads...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLeads([...leads])}>All</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLeads(leads.filter((lead) => normalizeLeadStatus(lead.Status) === "pending"))}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLeads(leads.filter((lead) => normalizeLeadStatus(lead.Status) === "success"))}
              >
                Success
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLeads(leads.filter((lead) => normalizeLeadStatus(lead.Status) === "failure"))}
              >
                Failure
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Search className="h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            <p className="text-gray-500 max-w-md">
              There are no leads available. Click the "Create Leads" button to generate leads.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="cursor-pointer text-gray-700" onClick={() => handleSort("Name")}>
                    Name
                    {sortField === "Name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline ml-1 h-4 w-4" />
                      ))}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("Company")}>
                    Company
                    {sortField === "Company" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline ml-1 h-4 w-4" />
                      ))}
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("Status")}>
                    Status
                    {sortField === "Status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline ml-1 h-4 w-4" />
                      ))}
                  </TableHead>
                  {showMessages && <TableHead>Message</TableHead>}
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeads.slice(0, 10).map((lead, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{lead.Name}</TableCell>
                    <TableCell>{lead.Company}</TableCell>
                    <TableCell>{lead.Position}</TableCell>
                    <TableCell>{lead.Email}</TableCell>
                    <TableCell>{lead.Industry}</TableCell>
                    <TableCell>{lead.Location}</TableCell>
                    <TableCell>{getStatusBadge(lead.Status)}</TableCell>
                    {showMessages && (
                      <TableCell className="max-w-[200px] truncate">{lead.Message || "No message generated"}</TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                          {lead["LinkedIn Profile"] && (
                            <DropdownMenuItem>
                              <a
                                href={lead["LinkedIn Profile"]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                LinkedIn Profile
                                <ExternalLink className="ml-2 h-3 w-3" />
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min(10, sortedLeads.length)} of {sortedLeads.length} leads
        </div>

        <Button
          onClick={handleGenerateMessage}
          disabled={isGeneratingMessage || leads.length === 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGeneratingMessage ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              {showMessages ? "Hide Messages" : "Generate Message"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Play, Pause, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Lead, normalizeLeadStatus } from "@/lib/types"
import { startAutomation, pauseAutomation } from "@/lib/api-client"

export function AgentStatus() {
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processedLeads, setProcessedLeads] = useState(0)
  const [totalLeads, setTotalLeads] = useState(200)
  const [statusCounts, setStatusCounts] = useState({
    pending: 200,
    success: 0,
    failure: 0,
  })
  const [recentNotifications, setRecentNotifications] = useState<string[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with data from the leads.json file if available
    async function fetchLeadData() {
      try {
        const response = await fetch("/data/leads.json")
        if (response.ok) {
          try {
            const data = await response.json()
            if (Array.isArray(data)) {
              const normalizedLeads = data.map((lead) => ({
                ...lead,
                Status: lead.Status || "Pending",
              }))

              setLeads(normalizedLeads)
              setTotalLeads(normalizedLeads.length)

              // Count statuses
              const counts = {
                pending: 0,
                success: 0,
                failure: 0,
              }

              normalizedLeads.forEach((lead) => {
                const status = normalizeLeadStatus(lead.Status)
                counts[status]++
              })

              setStatusCounts(counts)
            }
          } catch (parseError) {
            console.error("Error parsing lead data JSON:", parseError)
          }
        } else {
          console.log("Leads file not found or not accessible yet")
        }
      } catch (error) {
        console.error("Error fetching lead data:", error)
      }
    }

    fetchLeadData()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAgentRunning) {
      interval = setInterval(() => {
        // Simulate processing leads
        setProcessedLeads((prev) => {
          const newProcessed = Math.min(prev + 1, totalLeads)
          setProgress((newProcessed / totalLeads) * 100)

          if (newProcessed === totalLeads) {
            setIsAgentRunning(false)
            toast({
              title: "Processing Complete",
              description: "All leads have been processed.",
            })
          }

          return newProcessed
        })

        // Simulate updating lead statuses
        if (processedLeads < totalLeads) {
          const updatedLeads = [...leads]
          const leadToUpdate = updatedLeads[processedLeads]

          if (leadToUpdate) {
            // Randomly determine success or failure
            const newStatus = Math.random() > 0.3 ? "Success" : "Failure"
            leadToUpdate.Status = newStatus

            // Update status counts
            setStatusCounts((prev) => ({
              ...prev,
              pending: prev.pending - 1,
              [normalizeLeadStatus(newStatus)]: prev[normalizeLeadStatus(newStatus)] + 1,
            }))

            // Add notification
            const notification = `${leadToUpdate.Name} from ${leadToUpdate.Company} processed: ${newStatus}`
            setRecentNotifications((prev) => [notification, ...prev].slice(0, 5))

            setLeads(updatedLeads)
          }
        }
      }, 500) // Process one lead every 500ms
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAgentRunning, processedLeads, totalLeads, leads, toast])

  // Update the toggleAgent function to connect to the backend
  const toggleAgent = async () => {
    if (isAgentRunning) {
      // Pause the agent
      setIsAgentRunning(false)

      try {
        await pauseAutomation()

        toast({
          title: "Agent Paused",
          description: "The LinkedIn automation has been paused.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to pause the agent. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // Start or resume the agent

      // Reset if we've completed a previous run
      if (processedLeads === totalLeads) {
        setProcessedLeads(0)
        setProgress(0)
        setStatusCounts({
          pending: totalLeads,
          success: 0,
          failure: 0,
        })

        // Reset all leads to pending
        const resetLeads = leads.map((lead) => ({
          ...lead,
          Status: "Pending",
        })) as Lead[]

        setLeads(resetLeads)
        setRecentNotifications([])
      }

      try {
        await startAutomation(processedLeads)
        setIsAgentRunning(true)

        toast({
          title: "Agent Started",
          description: "The LinkedIn automation is now running.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start the agent. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-800">Pending</CardTitle>
            <CardDescription className="text-gray-600">Leads waiting to be processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{statusCounts.pending}</div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-800">Success</CardTitle>
            <CardDescription className="text-gray-600">Successfully processed leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{statusCounts.success}</div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-800">Failure</CardTitle>
            <CardDescription className="text-gray-600">Failed to process leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{statusCounts.failure}</div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Processing Progress</CardTitle>
          <CardDescription>
            {processedLeads} of {totalLeads} leads processed ({Math.round(progress)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
        <CardFooter>
          <Button
            onClick={toggleAgent}
            className={isAgentRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-purple-600 hover:bg-purple-700"}
            disabled={leads.length === 0}
          >
            {isAgentRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause Agent
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Agent
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Recent Status Updates</CardTitle>
          <CardDescription>Real-time notifications from the background agent</CardDescription>
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <div className="space-y-2">
              {recentNotifications.map((notification, index) => (
                <Alert
                  key={index}
                  className={
                    notification.includes("Success")
                      ? "border-green-500 bg-green-50"
                      : notification.includes("Failure")
                        ? "border-red-500 bg-red-50"
                        : "border-yellow-500 bg-yellow-50"
                  }
                >
                  <AlertTitle>Lead Update</AlertTitle>
                  <AlertDescription>{notification}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No notifications yet. Start the agent to see updates.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


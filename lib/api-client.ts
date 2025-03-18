// This file contains functions to interact with the backend API

/**
 * Save parameters to .env file
 */
export async function saveParameters(parameters: any) {
  const response = await fetch("/api/save-parameters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parameters),
  })

  if (!response.ok) {
    throw new Error("Failed to save parameters")
  }

  return response.json()
}

/**
 * Create leads based on saved parameters
 */
export async function createLeads() {
  const response = await fetch("/api/create-leads", {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to create leads")
  }

  return response.json()
}

/**
 * Fetch leads from the JSON file
 */
export async function fetchLeads() {
  try {
    const response = await fetch("/data/leads.json")

    // If the file doesn't exist yet, return an empty array
    if (!response.ok) {
      console.log(`Failed to fetch leads: ${response.status} ${response.statusText}`)
      return []
    }

    // Try to parse the response as JSON
    try {
      const data = await response.json()
      return data
    } catch (parseError) {
      console.error("Error parsing leads JSON:", parseError)
      return []
    }
  } catch (error) {
    console.error("Error fetching leads:", error)
    return []
  }
}

/**
 * Generate personalized messages for leads
 */
export async function generateMessages() {
  const response = await fetch("/api/generate-messages", {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to generate messages")
  }

  return response.json()
}

/**
 * Start or resume the automation agent
 */
export async function startAutomation(resumeFrom = 0) {
  const response = await fetch("/api/automation/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeFrom }),
  })

  if (!response.ok) {
    throw new Error("Failed to start automation")
  }

  return response.json()
}

/**
 * Pause the automation agent
 */
export async function pauseAutomation() {
  const response = await fetch("/api/automation/pause", {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to pause automation")
  }

  return response.json()
}


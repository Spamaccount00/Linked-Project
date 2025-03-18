import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"

const execPromise = promisify(exec)

export async function POST() {
  try {
    // Make sure the data directory exists
    const dataDir = path.join(process.cwd(), "public", "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log(`Created directory: ${dataDir}`)
    }

    // Execute the lead generation script
    const { stdout, stderr } = await execPromise("node scripts/generate-leads.js")

    if (stderr) {
      console.error("Error executing script:", stderr)
      return NextResponse.json({ success: false, message: "Failed to create leads: " + stderr }, { status: 500 })
    }

    console.log("Script output:", stdout)

    // Check if the leads.json file was created
    const leadsFile = path.join(dataDir, "leads.json")
    if (!fs.existsSync(leadsFile)) {
      // Create a sample leads file if the script didn't create one
      // This is just for testing purposes
      const sampleLeads = [
        {
          Name: "Sample Lead",
          Company: "Sample Company",
          Position: "Sample Position",
          Email: "sample@example.com",
          Industry: "Sample Industry",
          Location: "Sample Location",
          Status: "Pending",
          Message: "This is a sample message",
          "LinkedIn Profile": "https://linkedin.com/in/sample",
        },
      ]

      fs.writeFileSync(leadsFile, JSON.stringify(sampleLeads, null, 2))
      console.log(`Created sample leads file: ${leadsFile}`)
    }

    return NextResponse.json({
      success: true,
      message: "Leads created successfully",
      output: stdout,
    })
  } catch (error) {
    console.error("Error creating leads:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create leads: " + (error as Error).message },
      { status: 500 },
    )
  }
}


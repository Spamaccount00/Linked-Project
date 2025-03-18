// This is a sample script that generates leads
// You can use this as a reference for your own script

const fs = require("fs")
const path = require("path")

// Create the data directory if it doesn't exist
const dataDir = path.join(process.cwd(), "public", "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log(`Created directory: ${dataDir}`)
}

// Generate sample leads
const sampleLeads = [
  {
    Name: "Swati Raghunandan",
    Company: "Senior HR Manager - Microsoft",
    Position: "Human Resources",
    Email: "swati.raghunandan@gmail.com",
    Industry: "IT",
    Location: "Bangalore",
    Status: "Pending",
    Message:
      "Dear Swati, I came across your profile and was truly impressed by your experience. I would love to connect and learn from your insights. Looking forward to staying in touch!",
    "LinkedIn Profile": "https://in.linkedin.com/in/swatiraghunandan",
  },
  {
    Name: "Rahul Sharma",
    Company: "Product Manager - Amazon",
    Position: "Product Management",
    Email: "rahul.sharma@gmail.com",
    Industry: "E-commerce",
    Location: "Mumbai",
    Status: "Pending",
    Message:
      "Hi Rahul, I noticed your impressive work at Amazon. I'd love to connect and discuss product management strategies sometime.",
    "LinkedIn Profile": "https://in.linkedin.com/in/rahulsharma",
  },
  {
    Name: "Priya Patel",
    Company: "Marketing Director - Flipkart",
    Position: "Marketing",
    Email: "priya.patel@gmail.com",
    Industry: "E-commerce",
    Location: "Delhi",
    Status: "Pending",
    Message:
      "Hello Priya, I'm impressed by your marketing expertise at Flipkart. Would love to connect and learn from your experience.",
    "LinkedIn Profile": "https://in.linkedin.com/in/priyapatel",
  },
]

// Save the leads to a JSON file
const leadsFile = path.join(dataDir, "leads.json")
fs.writeFileSync(leadsFile, JSON.stringify(sampleLeads, null, 2))

console.log(`Generated ${sampleLeads.length} sample leads and saved to ${leadsFile}`)


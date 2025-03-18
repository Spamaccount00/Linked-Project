export type LeadStatus = "pending" | "success" | "failure"

// Update the Lead interface to include a message field
export interface Lead {
  id: string
  name: string
  company: string
  position: string
  email: string
  phone: string
  linkedinUrl: string
  website: string
  industry: string
  location: string
  status: LeadStatus
  message?: string
}

export function generateDummyLeads(count = 200): Lead[] {
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Marketing",
    "Consulting",
  ]

  const locations = [
    "New York, NY",
    "San Francisco, CA",
    "Austin, TX",
    "Chicago, IL",
    "Seattle, WA",
    "Boston, MA",
    "Los Angeles, CA",
    "Denver, CO",
  ]

  const statuses: LeadStatus[] = ["pending", "success", "failure"]

  return Array.from({ length: count }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Contact ${i + 1}`,
    company: `Company ${i + 1}`,
    position: `${["CEO", "CTO", "CFO", "COO", "VP", "Director", "Manager"][i % 7]} of ${["Sales", "Marketing", "Engineering", "Operations", "Finance"][i % 5]}`,
    email: `contact${i + 1}@company${i + 1}.com`,
    phone: `(${100 + Math.floor(i / 100)}) ${200 + (Math.floor(i / 10) % 100)}-${3000 + (i % 1000)}`,
    linkedinUrl: `https://linkedin.com/in/contact${i + 1}`,
    website: `https://company${i + 1}.com`,
    industry: industries[i % industries.length],
    location: locations[i % locations.length],
    status: statuses[i % statuses.length],
  }))
}


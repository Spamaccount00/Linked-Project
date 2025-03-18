export type LeadStatus = "Pending" | "Success" | "Failure" | "pending" | "success" | "failure";

export interface Lead {
  id?: string;
  Name: string;
  Company: string;
  Position: string;
  Email: string;
  Industry: string;
  Location: string;
  Status: LeadStatus;
  Message?: string;
  "LinkedIn Profile"?: string;
  [key: string]: any; // Allow for additional properties
}

export function normalizeLeadStatus(status: LeadStatus): "pending" | "success" | "failure" {
  const lowerStatus = status.toLowerCase() as "pending" | "success" | "failure";
  return lowerStatus;
}


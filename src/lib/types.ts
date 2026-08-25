export type ServiceCategory =
  | "Education"
  | "Healthcare"
  | "Employment"
  | "Housing"
  | "Agriculture"
  | "Social Welfare"
  | "Documents"
  | "Women & Child Welfare";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  eligibility: string;
  eligibilityCriteria: string[];
  documents: string[];
  processingTime: string;
  benefits: string;
  applicationMethod: string;
  steps: string[];
  faqs: { q: string; a: string }[];
}

export type ApplicationStatus =
  | "Submitted"
  | "Under Verification"
  | "Department Review"
  | "Approved"
  | "Rejected";

export interface Application {
  id: string;
  ref: string;
  citizen_id: string;
  citizen_name: string;
  service_id: string;
  service_name: string;
  category: string;
  district: string;
  state: string;
  status: ApplicationStatus;
  details: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export type GrievanceStatus =
  | "Submitted"
  | "Assigned to Department"
  | "Under Review"
  | "Resolved";

export interface Grievance {
  id: string;
  ref: string;
  citizen_id: string;
  citizen_name: string;
  service: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  priority: "Normal" | "High Priority";
  created_at: string;
  updated_at: string;
}

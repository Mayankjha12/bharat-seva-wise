import type { Service } from "./types";

/**
 * Static demo catalogue of government schemes & public services.
 * PROTOTYPE DATA — representative examples, not live government API data.
 */

export const CATEGORIES = [
  "Education",
  "Healthcare",
  "Employment",
  "Housing",
  "Agriculture",
  "Social Welfare",
  "Documents",
  "Women & Child Welfare",
] as const;

export const STATES = [
  "Andhra Pradesh",
  "Bihar",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
] as const;

export const DISTRICTS_UP = [
  "Lucknow",
  "Kanpur",
  "Varanasi",
  "Prayagraj",
  "Agra",
  "Jaunpur",
  "Sitapur",
  "Barabanki",
];

const PROCESS_STEPS = [
  "Submit application",
  "Document verification",
  "Department review",
  "Decision",
  "Service / benefit delivery",
];

export const SERVICES: Service[] = [
  {
    id: "edu-scholarship",
    name: "Education Scholarship Support",
    category: "Education",
    description:
      "Financial assistance for eligible students to support education expenses such as tuition fees, books and hostel costs.",
    eligibility: "Based on age, education level and household income.",
    eligibilityCriteria: [
      "Enrolled in a recognised school, college or university",
      "Household income within the prescribed limit",
      "Resident of the state offering the scheme",
    ],
    documents: ["Identity proof", "Income certificate", "Education documents"],
    processingTime: "15–30 working days",
    benefits: "Direct benefit transfer of scholarship amount to the student's bank account each academic year.",
    applicationMethod: "Online application with document upload",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "Can I apply if I study outside my home state?",
        a: "Yes, most scholarship schemes allow this if you hold a valid domicile certificate of your home state.",
      },
      {
        q: "How is the scholarship paid?",
        a: "Approved amounts are transferred directly to the bank account linked in your application.",
      },
    ],
  },
  {
    id: "health-coverage",
    name: "Health Coverage Assistance",
    category: "Healthcare",
    description:
      "Cashless hospitalisation and treatment support for eligible households at empaneled public and private hospitals.",
    eligibility: "Based on household income and family composition.",
    eligibilityCriteria: [
      "Household income below the prescribed ceiling",
      "Family listed in the eligible household registry",
      "Valid identity and address proof for all members",
    ],
    documents: ["Identity proof", "Address proof", "Income certificate"],
    processingTime: "7–15 working days",
    benefits: "Coverage for hospitalisation expenses up to the scheme limit per family per year.",
    applicationMethod: "Online or at the nearest citizen service centre",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "Which hospitals accept this coverage?",
        a: "All empaneled public and private hospitals. The list is available at district health offices.",
      },
    ],
  },
  {
    id: "senior-support",
    name: "Senior Citizen Support",
    category: "Social Welfare",
    description:
      "Monthly pension and priority access to public services for senior citizens with limited income support.",
    eligibility: "Citizens aged 60 and above meeting income criteria.",
    eligibilityCriteria: [
      "Aged 60 years or above",
      "Household income below the prescribed limit",
      "Not receiving another government pension",
    ],
    documents: ["Identity proof", "Age proof", "Income certificate", "Bank account details"],
    processingTime: "30–45 working days",
    benefits: "Monthly pension credited directly to the beneficiary's bank account.",
    applicationMethod: "Online application or assisted application at gram panchayat / ward office",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "Can a family member apply on behalf of a senior citizen?",
        a: "Yes, assisted applications are supported with the senior citizen's documents and consent.",
      },
    ],
  },
  {
    id: "employment-skill",
    name: "Employment & Skill Support",
    category: "Employment",
    description:
      "Free skill development training, apprenticeship placement and job-matching support for youth and job seekers.",
    eligibility: "Citizens aged 18–35 who are unemployed or seeking better employment.",
    eligibilityCriteria: [
      "Aged between 18 and 35 years",
      "Unemployed, self-employed or seeking up-skilling",
      "Minimum education requirements vary by trade",
    ],
    documents: ["Identity proof", "Education documents", "Address proof"],
    processingTime: "10–20 working days",
    benefits: "Free certified training courses, stipend during training in select trades, and placement assistance.",
    applicationMethod: "Online registration followed by counselling at a skill centre",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "Is the training really free?",
        a: "Yes, training under this scheme is fully funded. Some trades also provide a stipend.",
      },
    ],
  },
  {
    id: "housing-assistance",
    name: "Housing Assistance",
    category: "Housing",
    description:
      "Financial assistance for construction or improvement of pucca houses for eligible rural and urban households.",
    eligibility: "Households without a pucca house, based on income and housing survey lists.",
    eligibilityCriteria: [
      "Household does not own a pucca house",
      "Included in the eligible household survey list",
      "Owns or has rights to the land for construction",
    ],
    documents: ["Identity proof", "Address proof", "Land/housing documents", "Bank account details"],
    processingTime: "30–60 working days",
    benefits: "Instalment-based financial assistance credited directly for house construction.",
    applicationMethod: "Through gram panchayat / urban local body or online",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "How are instalments released?",
        a: "Instalments are released in stages linked to construction progress verified by local officials.",
      },
    ],
  },
  {
    id: "agri-support",
    name: "Farmer Income & Crop Support",
    category: "Agriculture",
    description:
      "Income support instalments, crop insurance enrolment and access to subsidised inputs for small and marginal farmers.",
    eligibility: "Small and marginal farmer households with cultivable land records.",
    eligibilityCriteria: [
      "Listed as a landholding farmer in revenue records",
      "Landholding within the prescribed limit",
      "Valid bank account for direct transfer",
    ],
    documents: ["Identity proof", "Land records", "Bank account details"],
    processingTime: "15–30 working days",
    benefits: "Periodic income support instalments and subsidised crop insurance premiums.",
    applicationMethod: "Online or through the local agriculture office",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "What if my land record is not updated?",
        a: "You can first update your record at the tehsil office, then apply. SevaSetu guides you through both steps.",
      },
    ],
  },
  {
    id: "women-child",
    name: "Women & Child Welfare Support",
    category: "Women & Child Welfare",
    description:
      "Nutrition support, maternity benefits and education incentives for women and children in eligible households.",
    eligibility: "Pregnant women, new mothers and girl children in eligible households.",
    eligibilityCriteria: [
      "Registered at an anganwadi or health centre",
      "Household income within the prescribed limit",
      "Valid identity proof of mother/guardian",
    ],
    documents: ["Identity proof", "Income certificate", "Health/registration record"],
    processingTime: "10–25 working days",
    benefits: "Direct benefit transfers for nutrition, maternity support and girl-child education incentives.",
    applicationMethod: "Online or assisted registration at anganwadi centres",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "When do maternity benefits start?",
        a: "After registration and verification, instalments are credited at defined stages of pregnancy and after delivery.",
      },
    ],
  },
  {
    id: "documents-service",
    name: "Certificate & Document Services",
    category: "Documents",
    description:
      "Apply for essential certificates — income, caste, domicile, birth and death certificates — with guided document checklists.",
    eligibility: "All residents of the issuing state/district.",
    eligibilityCriteria: [
      "Resident of the issuing district",
      "Supporting documents as per certificate type",
    ],
    documents: ["Identity proof", "Address proof", "Supporting document (varies)"],
    processingTime: "7–21 working days",
    benefits: "Digitally signed certificates delivered online, usable across government services.",
    applicationMethod: "Online application with fee payment where applicable",
    steps: PROCESS_STEPS,
    faqs: [
      {
        q: "Are digital certificates valid everywhere?",
        a: "Yes, digitally signed certificates are legally valid and verifiable online.",
      },
    ],
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

/** Demo citizen profile used across the prototype. No real personal data. */
export const DEMO_PROFILE = {
  id: "demo-priya",
  name: "Priya Sharma",
  firstName: "Priya",
  location: "Lucknow, Uttar Pradesh",
  state: "Uttar Pradesh",
  district: "Lucknow",
  ageGroup: "18–30",
  occupation: "Student",
  familyStatus: "Lives with family",
  accessibilityPreference: "Standard",
  completion: 80,
};

export function generateRef(prefix: "SV" | "GRV"): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `${prefix}-2026-${n}`;
}

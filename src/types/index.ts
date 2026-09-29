export interface Exhibitor {
  id: string;
  name: string;
  tagline: string;
  location: string;
  hub: 'Tirupur' | 'Jaipur' | 'Noida' | 'Bengaluru' | 'Surat' | 'Ludhiana' | 'Mumbai';
  hall: string;
  stall: string;
  categories: string[];
  fabrics: string[];
  moq: number;
  maxCapacityMonthly: number;
  certifications: string[];
  exportMarkets: string[];
  sustainabilityRating: 'A+' | 'A' | 'B+';
  matchScore?: number;
  matchReasons?: string[];
  description: string;
  leadTimeDays: number;
  verifiedExporter: boolean;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface BuyerProfile {
  name: string;
  company: string;
  country: string;
  flag: string;
  role: string;
  productCategories: string[];
  targetMoq: string;
  targetMarket: string;
  annualVolume: string;
  buyingIntent: 'HIGH' | 'MEDIUM' | 'EXPLORATORY';
  intentScore: number;
  certificationsNeeded: string[];
  sustainabilityPriority: string;
  visitDates: string[];
}

export interface Meeting {
  id: string;
  exhibitorId: string;
  exhibitorName: string;
  hall: string;
  stall: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: 'Confirmed' | 'Completed' | 'Pending';
  purpose: string;
  buyerName: string;
  buyerCompany: string;
  notes?: string;
  aiSummary?: {
    requirements: string[];
    commitments: string[];
    recommendedFollowUp: string;
    generatedMessage: {
      email: string;
      whatsapp: string;
    };
  };
}

export interface RFQ {
  id: string;
  title: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  productCategory: string;
  fabric: string;
  targetQuantity: number;
  targetPricePerUnit: string;
  targetMoq: number;
  timelineDays: number;
  targetMarket: string;
  status: 'Open' | 'Matched' | 'Under Review';
  createdAt: string;
  matchedExhibitorIds: string[];
}

export interface LeadItem {
  id: string;
  buyerName: string;
  buyerCompany: string;
  country: string;
  flag: string;
  intent: 'HIGH' | 'MEDIUM' | 'EXPLORATORY';
  intentScore: number;
  interests: string[];
  moqRequirement: string;
  status: 'New' | 'Meeting Done' | 'Follow-up Sent' | 'RFQ Received';
  lastInteraction: string;
  assignedStaff: string;
}

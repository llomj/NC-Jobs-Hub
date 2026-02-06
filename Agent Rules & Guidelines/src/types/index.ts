export enum Language {
  EN = 'en',
  FR = 'fr'
}

export enum JobStatus {
  NEW = 'new',
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  REJECTED = 'rejected'
}

export interface JobSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

/** User-configured scrapable target (website, Facebook Workplace, etc.). */
export interface CustomSource {
  type: string;
  url: string;
  name?: string;
}

export interface JobListing {
  id: string;
  sourceId: string;
  category: string; // New field for grouping
  title: string;
  company: string;
  location: string;
  address?: string; 
  contractType: string;
  postedDate: string;
  description: string;
  requirements: string[];
  contactEmail?: string;
  contactPhone?: string; // New field added
  url: string;
  status: JobStatus;
  relevanceScore?: number;
}

export interface UserIdentity {
  fullName: string;
  email: string;
  phone: string;
  language: Language;
  resumeText: string;
  skills: string[];
  certifications: string[];
  experienceSummary: string;
  preferredLocations: string[];
  preferredCommunes: string[]; // Added for region filtering
  preferredJobTypes: string[];
  meansOfTransport: string; // New field
  customSources: CustomSource[]; // Scrapable targets: website, facebook_workplace, etc.
  openClawApiKey?: string; // Optional: for Telegram bot / OpenClaw to authenticate or call scraping services
}

export interface ApplicationLog {
  id: string;
  jobId: string;
  status: JobStatus;
  timestamp: string;
  notes: string;
}

export interface OpenClawEvent {
  id: string;
  type: 'MATCH' | 'DIGEST' | 'STATUS_CHANGE';
  message: string;
  timestamp: string;
}
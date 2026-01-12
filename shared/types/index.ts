// ============================================
// IGBC Green Homes Certification - Shared Types
// ============================================

// Certification Levels
export type CertificationLevel = 'certified' | 'silver' | 'gold' | 'platinum';

export interface CertificationThreshold {
  level: CertificationLevel;
  minPoints: number;
  maxPoints: number;
  label: string;
  color: string;
}

export const CERTIFICATION_THRESHOLDS: CertificationThreshold[] = [
  { level: 'certified', minPoints: 40, maxPoints: 49, label: 'Certified', color: '#78716c' },
  { level: 'silver', minPoints: 50, maxPoints: 59, label: 'Silver', color: '#94a3b8' },
  { level: 'gold', minPoints: 60, maxPoints: 74, label: 'Gold', color: '#fbbf24' },
  { level: 'platinum', minPoints: 75, maxPoints: 100, label: 'Platinum', color: '#22c55e' },
];

// Category Codes
export type CategoryCode = 'SD' | 'WC' | 'EE' | 'MR' | 'RHW' | 'ID';

// Mandatory Requirement
export interface MandatoryRequirement {
  id: string;
  code: string;
  name: string;
  categoryCode: CategoryCode;
}

// Credit
export interface Credit {
  id: string;
  code: string;
  name: string;
  maxPoints: number;
  categoryCode: CategoryCode;
}

// Category
export interface Category {
  id: string;
  code: CategoryCode;
  name: string;
  possiblePoints: number;
  mandatoryRequirements: MandatoryRequirement[];
  credits: Credit[];
}

// ============================================
// User Input Types (for Scenarios)
// ============================================

export interface MandatoryComplianceInput {
  requirementId: string;
  isCompliant: boolean;
  notes: string;
}

export interface CreditDistributionInput {
  creditId: string;
  yesPoints: number;
  maybePoints: number;
  noPoints: number;
  notes: string;
}

export interface CategoryInput {
  categoryCode: CategoryCode;
  mandatoryCompliance: MandatoryComplianceInput[];
  creditDistributions: CreditDistributionInput[];
}

// ============================================
// Scenario Types
// ============================================

export interface Scenario {
  _id?: string;
  id?: string;
  name: string;
  projectName: string;
  projectType: string;
  targetCertificationLevel: CertificationLevel;
  categories: CategoryInput[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ============================================
// Computed/Derived Types
// ============================================

export interface CategorySummary {
  categoryCode: CategoryCode;
  categoryName: string;
  possiblePoints: number;
  yesPoints: number;
  maybePoints: number;
  noPoints: number;
  mandatoryCount: number;
  mandatoryCompliantCount: number;
}

export interface ScenarioSummary {
  totalPossiblePoints: number;
  totalYesPoints: number;
  totalMaybePoints: number;
  totalNoPoints: number;
  achievedCertificationLevel: CertificationLevel | null;
  targetCertificationLevel: CertificationLevel;
  pointsToNextLevel: number;
  nextLevel: CertificationLevel | null;
  categorySummaries: CategorySummary[];
  allMandatoryCompliant: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

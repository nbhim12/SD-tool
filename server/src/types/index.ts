// ============================================
// IGBC Green Homes Certification - Server Types
// ============================================

// Certification Levels
export type CertificationLevel = 'certified' | 'silver' | 'gold' | 'platinum';

// Category Codes
export type CategoryCode = 'SD' | 'WC' | 'EE' | 'MR' | 'RHW' | 'ID';

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

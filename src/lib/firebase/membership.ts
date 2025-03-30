import { Firestore } from 'firebase/firestore';
import { DirectorData } from '../../types/director';
import { MembershipPlan } from '../../types/membership';

export function calculateMemberStatus(latestWorkYear: number): 'ว่าที่สามัญ' | 'ว่าที่วิสามัญ' {
  const currentYear = new Date().getFullYear();
  const yearsSinceLastWork = currentYear - latestWorkYear;
  
  return yearsSinceLastWork <= 10 ? 'ว่าที่สามัญ' : 'ว่าที่วิสามัญ';
}

export function getLatestWorkYear(directorData: DirectorData): number {
  // Prefer C.E. year if available, otherwise convert B.E. to C.E.
  if (directorData['Latest Work C.E.']) {
    return directorData['Latest Work C.E.'];
  } else if (directorData['Latest Work B.E.']) {
    return directorData['Latest Work B.E.'] - 543;
  }
  return new Date().getFullYear(); // Fallback to current year
}

export function createMembershipData(plan: MembershipPlan) {
  const timestamp = new Date().toISOString();
  return {
    plan_selection: plan,
    created_at: timestamp,
    updated_at: timestamp
  };
}
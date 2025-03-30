import { QueryConstraint, where } from 'firebase/firestore';

export function buildYearFilter(year: string): QueryConstraint | null {
  if (!year || year === 'all') {
    return null;
  }
  
  const yearNumber = parseInt(year);
  if (isNaN(yearNumber)) {
    return null;
  }
  
  return where('year_ce', '==', yearNumber);
}
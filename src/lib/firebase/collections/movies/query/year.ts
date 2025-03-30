import { QueryConstraint, where } from 'firebase/firestore';
import { MOVIE_FIELDS } from '../constants';

export function buildYearConstraint(year: string): QueryConstraint | null {
  if (!year || year === 'all') {
    return null;
  }

  const yearNumber = parseInt(year);
  if (isNaN(yearNumber)) {
    return null;
  }

  return where(MOVIE_FIELDS.YEAR, '==', yearNumber);
}
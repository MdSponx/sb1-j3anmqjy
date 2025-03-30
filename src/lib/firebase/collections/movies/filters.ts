import { QueryConstraint, where, orderBy } from 'firebase/firestore';
import { MOVIE_FIELDS } from './constants';

export function buildSearchConstraints(query: string): QueryConstraint[] {
  if (!query) {
    return [orderBy(MOVIE_FIELDS.RELEASE_DATE, 'desc')];
  }
  return [
    where(MOVIE_FIELDS.TITLE, '>=', query),
    where(MOVIE_FIELDS.TITLE, '<=', query + '\uf8ff'),
    orderBy(MOVIE_FIELDS.TITLE)
  ];
}

export function buildYearConstraint(year: string | undefined): QueryConstraint | null {
  if (!year || year === 'all') {
    return null;
  }
  
  const yearNumber = parseInt(year);
  if (isNaN(yearNumber)) {
    return null;
  }
  
  return where('year_ce', '==', yearNumber);
}
import { QueryConstraint, where, orderBy } from 'firebase/firestore';
import { MOVIE_FIELDS } from './constants';

export function buildTitleSearchConstraints(query: string): QueryConstraint[] {
  return [
    where(MOVIE_FIELDS.TITLE, '>=', query),
    where(MOVIE_FIELDS.TITLE, '<=', query + '\uf8ff'),
    orderBy(MOVIE_FIELDS.TITLE)
  ];
}

export function buildYearConstraint(year: string): QueryConstraint {
  return where(MOVIE_FIELDS.YEAR, '==', parseInt(year));
}

export function buildSortingConstraint(): QueryConstraint {
  return orderBy(MOVIE_FIELDS.RELEASE_DATE, 'desc');
}
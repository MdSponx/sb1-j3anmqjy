import { QueryConstraint, where } from 'firebase/firestore';
import { MOVIE_FIELDS } from '../constants';

export function buildSearchConstraint(query: string): QueryConstraint[] {
  return [
    where(MOVIE_FIELDS.TITLE, '>=', query),
    where(MOVIE_FIELDS.TITLE, '<=', query + '\uf8ff')
  ];
}
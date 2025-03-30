import { QueryConstraint, orderBy } from 'firebase/firestore';
import { MOVIE_FIELDS } from '../constants';

export function buildSortingConstraint(): QueryConstraint {
  return orderBy(MOVIE_FIELDS.RELEASE_DATE, 'desc');
}
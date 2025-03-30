import { QueryConstraint, where, orderBy } from 'firebase/firestore';
import { MOVIE_FIELDS } from './constants';

export class MovieQueryBuilder {
  buildConstraints(searchQuery: string, selectedYear: string): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    // Add year filter first if present
    if (selectedYear && selectedYear !== 'all') {
      constraints.push(where('year_ce', '==', parseInt(selectedYear)));
    }

    // Add search or default sorting
    if (searchQuery) {
      constraints.push(
        where('Movie', '>=', searchQuery),
        where('Movie', '<=', searchQuery + '\uf8ff')
      );
    } else {
      // Only add release date ordering if no search query
      constraints.push(orderBy('release_date', 'desc'));
    }

    return constraints;
  }
}
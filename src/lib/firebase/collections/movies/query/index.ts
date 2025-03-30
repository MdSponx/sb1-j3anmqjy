import { QueryConstraint } from 'firebase/firestore';
import { buildSearchConstraint } from './search';
import { buildYearConstraint } from './year';
import { buildSortingConstraint } from './sorting';

export function buildMovieQuery(searchQuery: string, selectedYear: string): QueryConstraint[] {
  const constraints: QueryConstraint[] = [];
  
  // Add year filter first (if present)
  const yearConstraint = buildYearConstraint(selectedYear);
  if (yearConstraint) {
    constraints.push(yearConstraint);
  }

  // Add search constraint or default sorting
  if (searchQuery.trim()) {
    const searchConstraint = buildSearchConstraint(searchQuery);
    constraints.push(...searchConstraint);
  } else {
    // Only add sorting if no search query
    const sortingConstraint = buildSortingConstraint();
    constraints.push(sortingConstraint);
  }

  return constraints;
}

export * from './types';
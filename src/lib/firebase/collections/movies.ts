import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../services';
import { Movie, MovieFilters } from '../../../types/movie';
import { validateMovieData } from '../../utils/movies';

const MOVIES_PER_PAGE = 20;

export async function searchMovies({ 
  searchQuery, 
  year, 
  page 
}: { 
  searchQuery: string; 
  year: string; 
  page: number; 
}): Promise<{ movies: Movie[]; totalCount: number }> {
  try {
    const constraints: QueryConstraint[] = [];
    const moviesRef = collection(db, 'movies');

    // Add search constraints if query exists
    if (searchQuery) {
      constraints.push(
        where('Movie', '>=', searchQuery),
        where('Movie', '<=', searchQuery + '\uf8ff'),
        orderBy('Movie')
      );
    } else {
      // Default sorting by release date if no search query
      constraints.push(orderBy('release_date', 'desc'));
    }

    // Add year filter if not 'all'
    if (year !== 'all') {
      constraints.push(where('year_ce', '==', parseInt(year)));
    }

    // Add pagination
    constraints.push(limit(MOVIES_PER_PAGE));

    // Execute query
    const q = query(moviesRef, ...constraints);
    const snapshot = await getDocs(q);

    // Transform data
    const movies = snapshot.docs.map(doc => validateMovieData({
      id: doc.id,
      ...doc.data()
    }));

    return {
      movies,
      totalCount: snapshot.size
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

export async function fetchMovieYears(): Promise<string[]> {
  try {
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, orderBy('year_ce', 'desc'));
    const snapshot = await getDocs(q);

    const years = new Set<string>();
    snapshot.docs.forEach(doc => {
      const year = doc.data().year_ce?.toString();
      if (year) years.add(year);
    });

    return Array.from(years);
  } catch (error) {
    console.error('Error fetching movie years:', error);
    throw error;
  }
}
import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Movie } from '../../types/movie';
import { validateMovieData } from '../utils/movies';

const MOVIES_PER_PAGE = 20;

/**
 * Fetch movies with pagination and filters
 */
export async function fetchMovies(
  searchQuery: string,
  selectedYear: string,
  page: number
): Promise<{ movies: Movie[]; totalCount: number }> {
  try {
    const moviesRef = collection(db, 'movies');
    const constraints: QueryConstraint[] = [];

    // Add search filter
    if (searchQuery) {
      constraints.push(
        where('Movie', '>=', searchQuery),
        where('Movie', '<=', searchQuery + '\uf8ff')
      );
    }

    // Add year filter
    if (selectedYear !== 'all') {
      constraints.push(where('year_ce', '==', parseInt(selectedYear)));
    }

    // Add sorting and pagination
    constraints.push(orderBy('release_date', 'desc'));
    constraints.push(limit(MOVIES_PER_PAGE));

    // Execute query
    const q = query(moviesRef, ...constraints);
    const snapshot = await getDocs(q);

    // Transform data
    const movies = snapshot.docs.map(doc => validateMovieData({
      id: doc.id,
      ...doc.data()
    }));

    // Get total count
    const countQuery = query(moviesRef, ...constraints.slice(0, -1));
    const countSnapshot = await getDocs(countQuery);

    return {
      movies,
      totalCount: countSnapshot.size
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

/**
 * Fetch available years for filtering
 */
export async function fetchYears(): Promise<string[]> {
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
    console.error('Error fetching years:', error);
    throw error;
  }
}
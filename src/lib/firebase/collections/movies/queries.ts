import { collection, query, getDocs, orderBy, where, limit, QueryConstraint } from 'firebase/firestore';
import { db } from '../../services';
import { MovieDocument, MovieQueryOptions, MovieQueryResult } from './types';
import { validateMovieData } from '../../../utils/movies';

const MOVIES_PER_PAGE = 20;

export async function fetchMoviesPage({
  page,
  searchQuery,
  year
}: MovieQueryOptions): Promise<MovieQueryResult> {
  try {
    const constraints: QueryConstraint[] = [];
    const moviesRef = collection(db, 'movies');

    // Add base ordering
    constraints.push(orderBy('release_date', 'desc'));

    // Add search filter if provided
    if (searchQuery) {
      constraints.push(
        where('Movie', '>=', searchQuery),
        where('Movie', '<=', searchQuery + '\uf8ff')
      );
    }

    // Add year filter if provided
    if (year && year !== 'all') {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        constraints.push(where('year_ce', '==', yearNum));
      }
    }

    // Add pagination
    constraints.push(limit(MOVIES_PER_PAGE));

    // Execute query
    const q = query(moviesRef, ...constraints);
    const snapshot = await getDocs(q);

    // Get total count for pagination
    const countQuery = query(moviesRef, ...constraints.slice(0, -1)); // Remove limit
    const countSnapshot = await getDocs(countQuery);

    // Transform data
    const movies = snapshot.docs.map(doc => validateMovieData({
      id: doc.id,
      ...doc.data()
    }));

    return {
      movies,
      totalCount: countSnapshot.size,
      currentPage: page,
      totalPages: Math.ceil(countSnapshot.size / MOVIES_PER_PAGE)
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export async function fetchMovieYears(): Promise<string[]> {
  try {
    // Create a dedicated query for years
    const moviesRef = collection(db, 'movies');
    const yearsQuery = query(
      moviesRef,
      orderBy('year_ce', 'desc')
    );

    const snapshot = await getDocs(yearsQuery);
    const yearsSet = new Set<string>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.year_ce && typeof data.year_ce === 'number') {
        yearsSet.add(data.year_ce.toString());
      }
    });

    return Array.from(yearsSet);
  } catch (error) {
    console.error('Error fetching movie years:', error);
    throw new Error('Failed to fetch movie years');
  }
}
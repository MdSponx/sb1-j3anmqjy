import { collection, query, getDocs, QueryConstraint, orderBy } from 'firebase/firestore';
import { db } from '../../services';
import { MovieQueryOptions, MovieQueryResult } from './types';
import { buildSearchConstraints } from './filters';
import { buildYearFilter } from './year-filter';
import { validateMovieData } from '../../../utils/movies';

const MOVIES_PER_PAGE = 20;

export class MovieRepository {
  async fetchMovies(options: MovieQueryOptions): Promise<MovieQueryResult> {
    try {
      const constraints: QueryConstraint[] = [];
      const moviesRef = collection(db, 'movies');

      // Add search constraints
      if (options.searchQuery) {
        constraints.push(...buildSearchConstraints(options.searchQuery));
      } else {
        constraints.push(orderBy('release_date', 'desc'));
      }

      // Add year filter
      const yearFilter = buildYearFilter(options.year);
      if (yearFilter) {
        constraints.push(yearFilter);
      }

      // Execute query
      const q = query(moviesRef, ...constraints);
      const snapshot = await getDocs(q);

      // Transform and validate data
      const movies = snapshot.docs.map(doc => validateMovieData({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate pagination
      const totalCount = movies.length;
      const totalPages = Math.ceil(totalCount / MOVIES_PER_PAGE);
      const start = (options.page - 1) * MOVIES_PER_PAGE;
      const paginatedMovies = movies.slice(start, start + MOVIES_PER_PAGE);

      return {
        movies: paginatedMovies,
        totalCount,
        currentPage: options.page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  }
}
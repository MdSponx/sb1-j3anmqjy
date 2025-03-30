import { collection, query, where, orderBy, limit, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../../services';
import { validateMovieData } from '../../../utils/movies';
import { MovieSearchParams, MovieSearchResult } from './types';
import { MOVIES_PER_PAGE, MOVIE_FIELDS } from './constants';

export async function searchMovies(params: MovieSearchParams): Promise<MovieSearchResult> {
  try {
    const constraints: QueryConstraint[] = [];
    const moviesRef = collection(db, 'movies');

    // Add search constraints if query exists
    if (params.query) {
      constraints.push(
        where(MOVIE_FIELDS.TITLE, '>=', params.query),
        where(MOVIE_FIELDS.TITLE, '<=', params.query + '\uf8ff'),
        orderBy(MOVIE_FIELDS.TITLE)
      );
    } else {
      // Default sorting by release date if no search query
      constraints.push(orderBy(MOVIE_FIELDS.RELEASE_DATE, 'desc'));
    }

    // Add year filter if not 'all'
    if (params.year !== 'all') {
      constraints.push(where(MOVIE_FIELDS.YEAR, '==', parseInt(params.year)));
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
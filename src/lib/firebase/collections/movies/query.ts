import { collection, query, getDocs, QueryConstraint, where, orderBy } from 'firebase/firestore';
import { db } from '../../services';
import { validateMovieData } from '../../../utils/movies';
import type { Movie } from '../../../../types/movie';

interface FetchMoviesOptions {
  searchQuery: string;
  page: number;
  year: string; // เพิ่ม year parameter
}

export async function fetchMovies({ 
  searchQuery, 
  page,
  year 
}: FetchMoviesOptions): Promise<{
  movies: Movie[];
  totalPages: number;
}> {
  try {
    const moviesRef = collection(db, 'movies');
    let constraints: QueryConstraint[] = [];

    // เพิ่ม console.log เพื่อ debug
    console.log('Year filter:', year);

    // ตรวจสอบ year filter ก่อน search query
    if (year && year !== 'all') {
      const yearNumber = parseInt(year, 10);
      constraints.push(where('year_be', '==', yearNumber));
    }

    if (searchQuery.trim()) {
      // ถ้ามีการค้นหา
      constraints.push(
        where('Movie', '>=', searchQuery),
        where('Movie', '<=', searchQuery + '\uf8ff')
      );
      if (constraints.length === 0) {
        constraints.push(orderBy('Movie'));
      }
    } else {
      // ถ้าไม่มีการค้นหา
      if (constraints.length === 0) {
        constraints.push(orderBy('release_date', 'desc'));
      }
    }

    // เพิ่ม console.log เพื่อ debug
    console.log('Final constraints:', constraints);

    const q = query(moviesRef, ...constraints);
    const snapshot = await getDocs(q);

    // Transform data
    const allMovies = snapshot.docs.map(doc => 
      validateMovieData({
        id: doc.id,
        ...doc.data()
      })
    );

    // Handle pagination
    const MOVIES_PER_PAGE = 20;
    const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
    const start = (page - 1) * MOVIES_PER_PAGE;
    const paginatedMovies = allMovies.slice(start, start + MOVIES_PER_PAGE);

    return {
      movies: paginatedMovies,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}
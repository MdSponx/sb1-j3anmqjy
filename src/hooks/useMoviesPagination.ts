import { useState, useEffect } from 'react';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { fetchPaginatedMovies } from '../lib/firebase/collections/movies/pagination';
import { Movie } from '../types/movie';
import { useDebounce } from './useDebounce';

interface UseMoviesPaginationResult {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  totalPages: number;
  hasMore: boolean;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export function useMoviesPagination(
  searchQuery: string,
  selectedYear: string,
  currentPage: number
): UseMoviesPaginationResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    let mounted = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchPaginatedMovies({
          searchQuery: debouncedSearch,
          year: selectedYear,
          page: currentPage,
          lastDoc: currentPage > 1 ? lastDoc : undefined
        });

        if (mounted) {
          setMovies(result.movies);
          setLastDoc(result.lastDoc);
          if (currentPage === 1) {
            setTotalCount(result.totalCount);
          }
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedYear, currentPage, lastDoc]);

  return {
    movies,
    loading,
    error,
    totalPages: Math.ceil(totalCount / 20),
    hasMore: movies.length === 20,
    lastDoc
  };
}
import { useState, useEffect, useCallback } from 'react';
import { fetchMovies } from '../lib/firebase/collections/movies/query';
import type { Movie } from '../types/movie';

interface FetchMoviesParams {
  searchQuery: string;
  page: number;
  year: string;
}

export function useMovies(searchQuery: string, page: number, year: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchMovies({
        searchQuery,
        page,
        year,
      });

      setMovies(result.movies);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error loading movies:', err);
      setError(err as Error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, year]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const refreshData = useCallback(() => {
    loadMovies();
  }, [loadMovies]);

  return {
    movies,
    loading,
    error,
    totalPages,
    refreshData
  };
}
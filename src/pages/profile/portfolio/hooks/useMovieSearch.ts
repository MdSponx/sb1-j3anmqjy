import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import { useDebounce } from '../../../../hooks/useDebounce';
import type { Movie } from '../../../../types/movie';

export function useMovieSearch(searchQuery: string) {
  const { db } = useFirebase();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!debouncedSearch) {
        setMovies([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const moviesRef = collection(db, 'movies');
        const q = query(
          moviesRef,
          where('Movie', '>=', debouncedSearch),
          where('Movie', '<=', debouncedSearch + '\uf8ff'),
          orderBy('Movie'),
        );

        const snapshot = await getDocs(q);
        const moviesList = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().Movie || '',
          titleEng: doc.data().movieEng || '',
          release_date: doc.data().release_date || '',
          poster: doc.data().poster || null,
          year: doc.data().year_ce?.toString() || '',
          director: doc.data().Director || '',
          synopsis: doc.data().synopsis || ''
        }));

        setMovies(moviesList);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError(err instanceof Error ? err : new Error('Failed to search movies'));
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [db, debouncedSearch]);

  return { movies, loading, error };
}
import { useState, useEffect } from 'react';
import { collection, query, getCountFromServer } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';

export function useMoviesCount() {
  const { db } = useFirebase();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const moviesRef = collection(db, 'movies');
        const snapshot = await getCountFromServer(query(moviesRef));
        setCount(snapshot.data().count);
      } catch (err) {
        console.error('Error fetching movies count:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [db]);

  return { count, loading, error };
}
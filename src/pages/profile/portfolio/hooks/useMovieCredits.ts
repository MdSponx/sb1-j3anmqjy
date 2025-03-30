import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import type { MovieCredit } from '../../../../types/movieCredits';

export function useMovieCredits() {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [credits, setCredits] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupListener = () => {
      try {
        // Create query without composite index
        const creditsRef = collection(db, 'movie_credits');
        const q = query(
          creditsRef,
          where('userId', '==', user.uid)
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            // Sort credits client-side
            const creditsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as MovieCredit[];

            creditsList.sort((a, b) => (b.year || 0) - (a.year || 0));
            
            setCredits(creditsList);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching credits:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up credits listener:', err);
        setError('Failed to load movie credits');
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [db, user]);

  const deleteCredit = async (creditId: string) => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'movie_credits', creditId));
      return true;
    } catch (err) {
      console.error('Error deleting credit:', err);
      throw err;
    }
  };

  const refreshCredits = () => {
    // No need to manually refresh since we're using onSnapshot
    // The listener will automatically update when data changes
  };

  return { 
    credits, 
    loading, 
    error, 
    deleteCredit,
    refreshCredits
  };
}
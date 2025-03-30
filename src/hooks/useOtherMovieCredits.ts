import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import type { MovieCredit } from '../types/movieCredits';

export function useOtherMovieCredits(userId: string) {
  const { db } = useFirebase();
  const [credits, setCredits] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        setLoading(true);
        
        // Remove orderBy to avoid index issues
        const creditsRef = collection(db, 'movie_credits');
        const q = query(
          creditsRef, 
          where('userId', '==', userId)
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setCredits([]);
          return;
        }

        // Sort credits client-side instead
        const creditsList = snapshot.docs.map(doc => ({
          id: doc.id,
          movieId: doc.data().movieId,
          movieTitle: doc.data().movieTitle,
          movieTitleEng: doc.data().movieTitleEng,
          year: doc.data().year,
          role_th: doc.data().role_th,
          role_en: doc.data().role_en,
          responsibilities: doc.data().responsibilities,
          images: doc.data().images || [],
          status: doc.data().status || 'pending',
          created_at: doc.data().created_at,
          userId: doc.data().userId
        })) as MovieCredit[];

        // Sort by year descending
        creditsList.sort((a, b) => (b.year || 0) - (a.year || 0));
        
        setCredits(creditsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching credits:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [db, userId]);

  return { credits, loading, error };
}
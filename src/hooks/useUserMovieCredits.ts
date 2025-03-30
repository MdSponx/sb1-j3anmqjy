import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import type { MovieCredit } from '../types/movieCredits';

export function useUserMovieCredits(userId: string) {
  const { db } = useFirebase();
  // เปลี่ยนจาก [] เป็น null
  const [credits, setCredits] = useState<MovieCredit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!userId) {
        setLoading(false);
        setError('No user ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const creditsRef = collection(db, 'movie_credits');
        const q = query(
          creditsRef,
          where('userId', '==', userId),
          where('status', '==', 'approved')
        );
        
        const snapshot = await getDocs(q);
        
        const creditsPromises = snapshot.docs.map(async (doc) => {
          const data = doc.data();
          
          const creditData: MovieCredit = {
            id: doc.id,
            movieId: data.movieId,
            movieTitle: data.movieTitle || '',
            movieTitleEng: data.movieTitleEng || '',
            moviePoster: null,
            role_th: data.role_th || '',
            role_en: data.role_en || '',
            responsibilities: data.responsibilities || '',
            year: data.year || new Date().getFullYear(),
            status: data.status || 'pending',
            created_at: data.created_at || '',
            userId: data.userId
          };
          
          if (data.movieId) {
            try {
              const movieDoc = await getDoc(doc(db, 'movies', data.movieId));
              if (movieDoc.exists()) {
                creditData.moviePoster = movieDoc.data().poster || null;
              }
            } catch (movieErr) {
              console.warn(`Could not fetch poster for movie ${data.movieId}:`, movieErr);
            }
          }
          
          return creditData;
        });

        const creditsData = await Promise.all(creditsPromises);
        creditsData.sort((a, b) => (b.year || 0) - (a.year || 0));
        
        setCredits(creditsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching credits:', err);
        setError('Failed to load movie credits');
        setCredits(null);  // เปลี่ยนจาก [] เป็น null
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [db, userId]);

  return { credits, loading, error };
}
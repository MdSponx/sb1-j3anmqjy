import { useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { Director } from '../../../types/director';

export function useDirectorPortfolio() {
  const { db } = useFirebase();
  const [director, setDirector] = useState<Director | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const fetchDirectorData = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const directorsRef = collection(db, 'directors');
      const q = query(directorsRef, where('Director', '==', name));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        
        const moviesList = data.Movies
          ? data.Movies.split('•')
              .filter(Boolean)
              .map((m: string) => m.trim())
          : [];

        setDirector({
          id: doc.id,
          name: data.Director,
          movies: moviesList,
          totalWorks: data['Total Work'] || moviesList.length,
          latestWorkYear: data['Latest Work C.E.'] || new Date().getFullYear()
        });
        setShowPortfolio(true);
      }
    } catch (error) {
      console.error('Error fetching director data:', error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const closePortfolio = useCallback(() => {
    setShowPortfolio(false);
    setDirector(null);
  }, []);

  return {
    director,
    loading,
    showPortfolio,
    fetchDirectorData,
    closePortfolio
  };
}
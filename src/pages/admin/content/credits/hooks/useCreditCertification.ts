import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, getDoc, where } from 'firebase/firestore';
import { useFirebase } from '../../../../../contexts/firebase';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useUserData } from '../../../../../hooks/useUserData';
import type { CreditRequest } from '../types';

export function useCreditCertification() {
  const { db } = useFirebase();
  const { user } = useAuth();
  const { userData } = useUserData();
  const [credits, setCredits] = useState<CreditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const creditsRef = collection(db, 'movie_credits');
    // Query based on user role
    const q = userData?.web_role === 'admin' 
      ? query(creditsRef)
      : query(creditsRef, where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const creditsPromises = snapshot.docs.map(async (creditDoc) => {
            const data = creditDoc.data();
            
            // Cache for user and movie data to prevent duplicate fetches
            const userDataCache = new Map();
            const movieDataCache = new Map();
            
            try {
              // Fetch user data
              let userData;
              if (userDataCache.has(data.userId)) {
                userData = userDataCache.get(data.userId);
              } else {
                const userDoc = await getDoc(doc(db, 'users', data.userId));
                userData = userDoc.data();
                if (userData) {
                  userDataCache.set(data.userId, userData);
                }
              }

              if (!userData) {
                console.warn(`User data not found for userId: ${data.userId}`);
                return null;
              }

              // Fetch movie data including poster
              let movieData;
              if (movieDataCache.has(data.movieId)) {
                movieData = movieDataCache.get(data.movieId);
              } else {
                const movieDoc = await getDoc(doc(db, 'movies', data.movieId));
                movieData = movieDoc.data();
                if (movieData) {
                  movieDataCache.set(data.movieId, movieData);
                }
              }

              return {
                id: creditDoc.id,
                movieId: data.movieId,
                movieTitle: data.movieTitle,
                movieTitleEng: data.movieTitleEng || movieData?.movieEng,
                moviePoster: movieData?.poster || null, // Include movie poster
                userId: data.userId,
                userNameTh: userData.fullname_th || '',
                userNameEn: userData.fullname_en || '',
                userProfileImage: userData.profile_image_url,
                role_th: data.role_th,
                role_en: data.role_en,
                responsibilities: data.responsibilities,
                images: data.images || [],
                status: data.status || 'pending',
                year: data.year,
                created_at: data.created_at
              } as CreditRequest;
            } catch (userError) {
              console.error(`Error fetching data for credit ${creditDoc.id}:`, userError);
              return null;
            }
          });

          const creditsData = (await Promise.all(creditsPromises))
            .filter((credit): credit is CreditRequest => credit !== null)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          setCredits(creditsData);
          setError(null);
        } catch (err) {
          console.error('Error processing credits:', err);
          setError('Error loading credits data');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching credits:', err);
        setError('Error loading credits');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, user, userData?.web_role]);

  const updateCreditStatus = async (creditId: string, status: string) => {
    if (!creditId || !user) {
      throw new Error('Credit ID and user authentication are required');
    }

    try {
      const creditRef = doc(db, 'movie_credits', creditId);
      await updateDoc(creditRef, {
        status,
        updated_at: new Date().toISOString(),
        updated_by: user.uid
      });
      return true;
    } catch (err) {
      console.error('Error updating credit status:', err);
      throw new Error(
        err instanceof Error 
          ? err.message 
          : 'Failed to update credit status'
      );
    }
  };

  return {
    credits,
    loading,
    error,
    updateCreditStatus
  };
}
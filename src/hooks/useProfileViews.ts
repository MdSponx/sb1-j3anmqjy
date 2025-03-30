import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useProfileViews(userId: string) {
  const { db } = useFirebase();
  const { user } = useAuth();
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    const fetchViews = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const viewsRef = doc(db, 'profile_views', userId);
        const viewsDoc = await getDoc(viewsRef);

        if (viewsDoc.exists()) {
          const currentViews = viewsDoc.data().count || 0;
          setViews(currentViews);

          const isGeneralProfile =
            window.location.pathname.includes('/profile/public/');
          const sessionKey = `profile_view_${userId}`;
          const hasViewedInSession = sessionStorage.getItem(sessionKey);

          if (
            isGeneralProfile &&
            (!user || user.uid !== userId) &&
            !hasViewedInSession &&
            !hasIncrementedRef.current
          ) {
            hasIncrementedRef.current = true;
            sessionStorage.setItem(sessionKey, 'true');

            await setDoc(
              viewsRef,
              {
                count: increment(1),
                updated_at: new Date().toISOString(),
              },
              { merge: true }
            );

            setViews(currentViews + 1);
          }
        } else {
          const initialData = {
            count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await setDoc(viewsRef, initialData);
          setViews(0);
        }

        setError(null);
      } catch (err) {
        console.error('Error handling profile views:', err);
        setError(null);
        setViews(0);
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, [db, userId, user]);

  return { views, loading, error };
}

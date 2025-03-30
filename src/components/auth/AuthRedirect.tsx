import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CameraAnimation } from '../shared/CameraAnimation';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const { db } = useFirebase();
  const [isChecking, setIsChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        // Check if user has occupation data
        if (!userData?.occupation) {
          const redirectPath = sessionStorage.getItem('redirectPath');
          const selectedPlan = sessionStorage.getItem('selectedPlan');

          if (redirectPath && selectedPlan && window.location.pathname !== redirectPath) {
            setShouldRedirect(true);
          }
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (!loading) {
      checkUserData();
    }
  }, [user, loading, db]);

  useEffect(() => {
    if (shouldRedirect) {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    }
  }, [shouldRedirect]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  return <>{children}</>;
}
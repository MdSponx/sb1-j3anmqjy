import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function useEventRegistration(eventId: string) {
  const { db } = useFirebase();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRegistrationStatus = useCallback(async () => {
    if (!user) {
      throw new Error(
        language === 'th'
          ? 'กรุณาเข้าสู่ระบบเพื่อลงทะเบียน'
          : 'Please sign in to register'
      );
    }

    setLoading(true);
    setError(null);

    try {
      // Add artificial delay for smoother UI transition
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already registered
      const registrationsRef = collection(db, 'events_registration');
      const q = query(
        registrationsRef,
        where('eventId', '==', eventId),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const registration = snapshot.docs[0];
        return { 
          canRegister: false, 
          existingRegistration: {
            id: registration.id,
            status: registration.data().status
          }
        };
      }

      // Add more checks here (seats availability, eligibility, etc.)
      await new Promise(resolve => setTimeout(resolve, 500));

      return { canRegister: true };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { canRegister: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [db, eventId, user, language]);

  const registerForEvent = useCallback(async (formData: any) => {
    if (!user) {
      throw new Error(
        language === 'th'
          ? 'กรุณาเข้าสู่ระบบเพื่อลงทะเบียน'
          : 'Please sign in to register'
      );
    }

    setLoading(true);
    setError(null);

    try {
      const registrationData = {
        eventId,
        userId: user.uid,
        status: 'pending',
        ...formData,
        registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await addDoc(collection(db, 'events_registration'), registrationData);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [db, eventId, user, language]);

  const cancelRegistration = useCallback(async (registrationId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'events_registration', registrationId));
    } catch (err) {
      console.error('Error canceling registration:', err);
      throw err;
    }
  }, [db, user]);

  return {
    checkRegistrationStatus,
    registerForEvent,
    cancelRegistration,
    loading,
    error
  };
}
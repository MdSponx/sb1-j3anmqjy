import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';

export function useProjectRegistration(projectId: string) {
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

    try {
      setLoading(true);
      setError(null);

      // Check if user already registered
      const registrationsRef = collection(db, 'project_registrations');
      const q = query(
        registrationsRef,
        where('projectId', '==', projectId),
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

      return { canRegister: true };
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return { canRegister: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [db, projectId, user, language]);

  const registerForProject = useCallback(async (formData: any) => {
    if (!user) {
      throw new Error(
        language === 'th'
          ? 'กรุณาเข้าสู่ระบบเพื่อลงทะเบียน'
          : 'Please sign in to register'
      );
    }

    try {
      setLoading(true);
      setError(null);

      const registrationData = {
        projectId,
        userId: user.uid,
        status: 'pending',
        ...formData,
        registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await addDoc(collection(db, 'project_registrations'), registrationData);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [db, projectId, user, language]);

  const cancelRegistration = useCallback(async (registrationId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'project_registrations', registrationId));
    } catch (err) {
      console.error('Error canceling registration:', err);
      throw err;
    }
  }, [db, user]);

  return {
    checkRegistrationStatus,
    registerForProject,
    cancelRegistration,
    loading,
    error
  };
}
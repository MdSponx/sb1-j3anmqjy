import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../contexts/firebase';
import { useLanguage } from '../contexts/LanguageContext';
import type { ProfileFormData } from '../types/profile';

export function useProfileUpdate() {
  const { user } = useAuth();
  const { db } = useFirebase();
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateProfile = async (formData: Partial<ProfileFormData>) => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updated_at: new Date().toISOString()
      });

      setShowSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred while saving your profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    error,
    isSubmitting,
    showSuccess,
    setShowSuccess,
    updateProfile
  };
}
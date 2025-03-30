import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailNotification } from '../../lib/email';
import type { Director } from '../../types/director';

interface DirectorConfirmDialogProps {
  director: Director;
  onClose: () => void;
}

export function DirectorConfirmDialog({
  director,
  onClose
}: DirectorConfirmDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the latest 3 movies by reversing the array
  const latestMovies = [...director.movies].reverse().slice(0, 3);

  const handleConfirm = async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const userData = {
        director_id: director.id,
        occupation: 'director',
        plan_selection: 'Free',
        member_status: 'ว่าที่สามัญ',
        payment_status: 'not paid',
        verification_status: 'pending',
        latest_work_year: director.latestWorkYear || new Date().getFullYear(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update user document with director information
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // Send email notification to admins
      await sendEmailNotification('new_director_signup', user.uid);

      // Redirect to edit profile page
      window.location.href = '/edit-profile';
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred while saving your data. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
          <span className="sr-only">Close</span>
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'th'
              ? 'ยืนยันตัวตน'
              : 'Identity Confirmation'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'th'
              ? `พบข้อมูลของคุณในฐานข้อมูล "${director.name}" ยืนยันว่าเป็นคุณใช่หรือไม่?`
              : `We found your information in our database as "${director.name}". Is this you?`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">
              {language === 'th' ? 'ผลงานล่าสุด' : 'Latest Works'}
            </h4>
            <ul className="space-y-1">
              {latestMovies.map((movie, index) => (
                <li key={index} className="text-sm text-gray-300">{movie}</li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>
              {language === 'th' ? 'ไม่ใช่ฉัน' : 'Not Me'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting
                ? language === 'th' ? 'กำลังบันทึก...' : 'Saving...'
                : language === 'th' ? 'ใช่ นี่คือฉัน' : 'Yes, This is Me'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
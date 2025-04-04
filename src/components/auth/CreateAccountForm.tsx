import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
// Import Button with correct casing
import { Button } from '../ui/Button';
import { searchDirectorByName } from '../../lib/firebase/directors';
import { calculateMemberStatus } from '../../lib/firebase/membership';
import { DirectorConfirmDialog } from '../registration/DirectorConfirmDialog';
import type { Director, UserDirectorProfile } from '../../types/director';

const createAccountSchema = z.object({
  fullname_TH: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export function CreateAccountForm() {
  const { auth, db } = useFirebase();
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [foundDirector, setFoundDirector] = useState<Director | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: data.fullname_TH
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create initial user document with all necessary fields
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullname_TH: data.fullname_TH,
        email: data.email, // Add email field to match test-email.html
        login_email: data.email,
        occupation: 'general people', // Default occupation
        verification_status: 'pending', // Add verification status
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Search for director
      const { director, directorData } = await searchDirectorByName(db, data.fullname_TH);
      if (director && directorData) {
        setFoundDirector(director);
      } else {
        window.location.href = '/register';
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError(
          language === 'th'
            ? 'อีเมลนี้ถูกใช้งานแล้ว'
            : 'Email already in use'
        );
      } else {
        setError(
          language === 'th'
            ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
            : 'An error occurred. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectorConfirm = async (confirmed: boolean) => {
    if (!auth.currentUser || !foundDirector) return;

    if (confirmed) {
      const memberStatus = calculateMemberStatus(foundDirector.latestWorkYear);
      
      const directorProfile: UserDirectorProfile = {
        director_id: foundDirector.id,
        occupation: 'director',
        member_status: memberStatus,
        payment_status: 'not paid',
        verification_status: 'pending',
        latest_work_year: foundDirector.latestWorkYear
      };

      // Update user document with director information
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...directorProfile,
        updated_at: new Date().toISOString()
      }, { merge: true });
      
      window.location.href = '/register/verify';
    } else {
      window.location.href = '/register';
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname_TH">
            {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name (Thai)'}
          </Label>
          <Input
            id="fullname_TH"
            {...register('fullname_TH')}
            placeholder={language === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter your full name in Thai'}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.fullname_TH && (
            <p className="text-sm text-red-500">
              {language === 'th'
                ? 'กรุณากรอกชื่อ-นามสกุล'
                : errors.fullname_TH.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {language === 'th' ? 'อีเมล' : 'Email'}
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {language === 'th'
                ? 'กรุณากรอกอีเมลให้ถูกต้อง'
                : errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            {language === 'th' ? 'รหัสผ่าน' : 'Password'}
          </Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder={language === 'th' ? 'กรอกรหัสผ่าน' : 'Enter your password'}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-sm text-red-500">
              {language === 'th'
                ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
                : errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            placeholder={language === 'th' ? 'กรอกรหัสผ่านอีกครั้ง' : 'Confirm your password'}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {language === 'th'
                ? 'รหัสผ่านไม่ตรงกัน'
                : errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Use regular HTML button for form submission */}
        <button
          type="submit"
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          disabled={isLoading}
        >
          {isLoading
            ? language === 'th'
              ? 'กำลังสร้างบัญชี...'
              : 'Creating account...'
            : language === 'th'
            ? 'สร้างบัญชี'
            : 'Create Account'}
        </button>
      </form>

      {foundDirector && (
        <DirectorConfirmDialog
          director={foundDirector}
          onClose={() => setFoundDirector(null)}
        />
      )}
    </>
  );
}

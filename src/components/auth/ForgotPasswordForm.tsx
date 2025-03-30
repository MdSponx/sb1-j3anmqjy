import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useFirebase } from '../../contexts/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { language } = useLanguage();
  const { auth } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error sending password reset email:', err);
      if (err.code === 'auth/user-not-found') {
        setError(language === 'th'
          ? 'ไม่พบบัญชีผู้ใช้ที่ใช้อีเมลนี้'
          : 'No account found with this email');
      } else {
        setError(language === 'th'
          ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
          : 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-green-400 mb-2">
          {language === 'th' 
            ? 'ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว' 
            : 'Password Reset Email Sent'}
        </h3>
        <p className="text-gray-300 mb-4">
          {language === 'th'
            ? 'กรุณาตรวจสอบอีเมลของคุณเพื่อดำเนินการต่อ'
            : 'Please check your email to continue'}
        </p>
        <Button
          onClick={() => window.location.href = '/login'}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {language === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Sign In'}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          {language === 'th' ? 'อีเมล' : 'Email'}
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder={language === 'th' ? 'กรอกอีเมล' : 'Enter your email'}
          className="bg-gray-800 border-gray-700"
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {language === 'th'
              ? 'กรุณากรอกอีเมลให้ถูกต้อง'
              : errors.email.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full py-2 bg-red-500 hover:bg-red-600 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? language === 'th'
            ? 'กำลังส่ง...'
            : 'Sending...'
          : language === 'th'
          ? 'ส่งอีเมลรีเซ็ตรหัสผ่าน'
          : 'Send Reset Email'}
      </Button>
    </form>
  );
}
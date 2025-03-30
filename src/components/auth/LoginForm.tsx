import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { auth, db } = useFirebase();
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      // Determine redirect path based on profile existence
      const redirectPath = userDoc.exists() ? '/profile/public' : '/edit-profile';
      window.location.href = redirectPath;
      
    } catch (err) {
      setError(
        language === 'th'
          ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
          : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check user profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const redirectPath = userDoc.exists() ? '/profile/public' : '/edit-profile';
        window.location.href = redirectPath;
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

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
          className="bg-gray-800 border-gray-700 text-white"
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {language === 'th'
              ? 'กรุณากรอกอีเมลให้ถูกต้อง'
              : 'Please enter a valid email'}
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
              : 'Password must be at least 6 characters'}
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
        disabled={isLoading}
      >
        {isLoading
          ? language === 'th'
            ? 'กำลังเข้าสู่ระบบ...'
            : 'Signing in...'
          : language === 'th'
          ? 'เข้าสู่ระบบ'
          : 'Sign In'}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => window.location.href = '/forgot-password'}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {language === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot password?'}
        </Button>
      </div>
    </form>
  );
}
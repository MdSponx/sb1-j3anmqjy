import React from 'react';
import { Container } from '../../components/ui/Container';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { useLanguage } from '../../contexts/LanguageContext';

export function ForgotPasswordPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'th' ? 'ลืมรหัสผ่าน' : 'Forgot Password'}
            </h1>
            <p className="text-gray-400">
              {language === 'th' 
                ? 'กรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน' 
                : 'Enter your email to reset your password'}
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {language === 'th' ? 'จำรหัสผ่านได้แล้ว?' : 'Remember your password?'}{' '}
              <a href="/login" className="text-red-500 hover:text-red-400">
                {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPasswordPage;
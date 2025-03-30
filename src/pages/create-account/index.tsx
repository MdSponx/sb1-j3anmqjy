import React from 'react';
import { Container } from '../../components/ui/Container';
import { CreateAccountForm } from '../../components/auth/CreateAccountForm';
import { useLanguage } from '../../contexts/LanguageContext';

export function CreateAccountPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'th' ? 'สร้างบัญชี' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {language === 'th' 
                ? 'สร้างบัญชีเพื่อเริ่มต้นใช้งาน' 
                : 'Create an account to get started'}
            </p>
          </div>

          <CreateAccountForm />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {language === 'th' ? 'มีบัญชีอยู่แล้ว?' : 'Already have an account?'}{' '}
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

export default CreateAccountPage;
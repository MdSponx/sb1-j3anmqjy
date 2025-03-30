import React from 'react';
import { Container } from '../../components/ui/Container';
import { ProfessionSearch } from '../../components/registration/ProfessionSearch';
import { ActionButtons } from '../../components/registration/ActionButtons';
import { useLanguage } from '../../contexts/LanguageContext';

export function DepartmentPage() {
  const { language } = useLanguage();

  const handlePublicRegister = () => {
    window.location.href = '/register/public-member';
  };

  const handleContactAdmin = () => {
    window.location.href = 'mailto:contact@thaifilmdirectors.com?subject=Department%20Information%20Request';
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'th' 
                ? 'เลือกตำแหน่งของคุณ' 
                : 'Select Your Role'}
            </h1>
            <p className="text-gray-400 text-lg">
              {language === 'th'
                ? 'เลือกอาชีพหลักของคุณในวงการภาพยนตร์'
                : 'Choose your primary profession in the film industry'}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <ProfessionSearch />

            <div className="mt-8 pt-8 border-t border-gray-700">
              <ActionButtons
                onPublicRegister={handlePublicRegister}
                onContactAdmin={handleContactAdmin}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default DepartmentPage;
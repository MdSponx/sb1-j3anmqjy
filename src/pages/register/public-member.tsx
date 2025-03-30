import React from 'react';
import { Container } from '../../components/ui/Container';
import { PublicMemberForm } from '../../components/registration/PublicMemberForm';
import { ProgressIndicator } from '../../components/registration/ProgressIndicator';
import { useLanguage } from '../../contexts/LanguageContext';

export function PublicMemberPage() {
  const { language } = useLanguage();

  const steps = [
    {
      label: language === 'th' ? 'เลือกประเภท' : 'Select Type',
      completed: true,
      current: false,
    },
    {
      label: language === 'th' ? 'เลือกสถานะ' : 'Select Status',
      completed: false,
      current: true,
    },
    {
      label: language === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Info',
      completed: false,
      current: false,
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator steps={steps} currentStep={1} />
          
          <div className="bg-gray-800 rounded-lg p-6">
            <PublicMemberForm />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PublicMemberPage;
import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import { ProgressIndicator } from '../../components/registration/ProgressIndicator';
import { DirectorSearchForm } from '../../components/registration/DirectorSearchForm';
import { DirectorConfirmDialog } from '../../components/registration/DirectorConfirmDialog';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDirectorSearch } from '../../hooks/useDirectorSearch';
import type { Director } from '../../types/director';

export function DirectorSearchPage() {
  const { language } = useLanguage();
  const { searchState, searchDirectors, clearSearch } = useDirectorSearch();
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  const steps = [
    {
      label: language === 'th' ? 'เลือกประเภท' : 'Select Type',
      completed: true,
      current: false,
    },
    {
      label: language === 'th' ? 'ค้นหาข้อมูล' : 'Search Info',
      completed: false,
      current: true,
    },
    {
      label: language === 'th' ? 'ยืนยันตัวตน' : 'Verify Identity',
      completed: false,
      current: false,
    },
    {
      label: language === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Info',
      completed: false,
      current: false,
    },
  ];

  const handleDirectorSelect = (director: Director) => {
    setSelectedDirector(director);
  };

  const handleContactAdmin = () => {
    window.location.href = 'mailto:contact@thaifilmdirectors.com?subject=Director%20Information%20Request';
  };

  const handleRegisterAsCrew = () => {
    window.location.href = '/register/department';
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator steps={steps} currentStep={1} />
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === 'th' 
                ? 'ค้นหาข้อมูลผู้กำกับ' 
                : 'Search Director Information'}
            </h2>
            
            <DirectorSearchForm
              searchState={searchState}
              onSearch={searchDirectors}
              onClear={clearSearch}
              onSelect={handleDirectorSelect}
            />

            <div className="mt-8 pt-8 border-t border-gray-700 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => window.location.href = '/register'}
                  variant="outline"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleRegisterAsCrew}
                  variant="outline"
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-blue-500/50"
                >
                  {language === 'th' ? 'สมัครในฐานะทีมงาน' : 'Register as Crew'}
                </Button>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleContactAdmin}
                  variant="link"
                  className="text-gray-400 hover:text-white"
                >
                  {language === 'th' 
                    ? 'ไม่พบข้อมูล? ติดต่อผู้ดูแลระบบ' 
                    : 'Information not found? Contact Admin'}
                </Button>
              </div>
            </div>
          </div>

          {selectedDirector && (
            <DirectorConfirmDialog
              director={selectedDirector}
              onClose={() => setSelectedDirector(null)}
            />
          )}
        </div>
      </Container>
    </div>
  );
}

export default DirectorSearchPage;
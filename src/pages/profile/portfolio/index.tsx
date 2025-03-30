import React, { useRef } from 'react';
import { Container } from '../../../components/ui/Container';
import { ProfileSidebar } from '../../../components/profile/ProfileSidebar';
import { MovieSearch } from './components/MovieSearch';
import { CreditsTable, CreditsTableRef } from './components/CreditsTable';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useUserData } from '../../../hooks/useUserData';
import { CameraAnimation } from '../../../components/shared/CameraAnimation';

export function PortfolioPage() {
  const { language } = useLanguage();
  const { userData, loading } = useUserData();
  const creditsTableRef = useRef<CreditsTableRef>(null);

  const handleCreditAdded = () => {
    creditsTableRef.current?.refreshCredits();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2FDSC06976.jpg?alt=media&token=2d628cf3-9914-4df4-932d-74bba445f874)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="pt-32 pb-16">
        <Container>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 md:sticky md:top-32 md:self-start">
              <ProfileSidebar />
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {language === 'th' ? 'ผลงานภาพยนตร์' : 'Movie Portfolio'}
                </h1>
                <p className="text-gray-400">
                  {language === 'th' 
                    ? 'จัดการผลงานและเครดิตภาพยนตร์ของคุณ ด้วยการค้นหาและเลือกงานที่ต้องการ'
                    : 'Manage your movie credits and portfolio by simply search and add credit'}
                </p>
              </div>

              <div className="space-y-8">
                <MovieSearch onCreditAdded={handleCreditAdded} />
                <CreditsTable ref={creditsTableRef} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default PortfolioPage;
import React from 'react';
import { Container } from '../../../components/ui/Container';
import { ProfileSidebar } from '../../../components/profile/ProfileSidebar';
import { useLanguage } from '../../../contexts/LanguageContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { language } = useLanguage();
  const currentPath = window.location.pathname;

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
              <ProfileSidebar currentPath={currentPath} />
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {title}
                </h1>
                <p className="text-gray-400">{subtitle}</p>
              </div>

              {children}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
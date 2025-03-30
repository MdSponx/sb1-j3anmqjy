import React from 'react';
import { Container } from '../../components/ui/Container';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { CameraAnimation } from '../../components/shared/CameraAnimation';

export function AdminPage() {
  const { language } = useLanguage();
  const { userData, loading } = useUserData();
  const currentPath = window.location.pathname;

  // Redirect if not admin
  if (!loading && userData?.web_role !== 'admin') {
    window.location.href = '/';
    return null;
  }

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
              <AdminSidebar currentPath={currentPath} />
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {language === 'th' ? 'จัดการระบบ' : 'Admin Console'}
                </h1>
                <p className="text-gray-400">
                  {language === 'th' 
                    ? 'ระบบจัดการสำหรับผู้ดูแล'
                    : 'Administration management system'}
                </p>
              </div>

              <AdminDashboard />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default AdminPage;
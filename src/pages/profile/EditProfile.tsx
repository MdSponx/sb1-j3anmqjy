import React from 'react';
import { Container } from '../../components/ui/Container';
import { ProfileSidebar } from '../../components/profile/ProfileSidebar';
import { ProfileEditor } from '../../components/profile/ProfileEditor';
import { EmailVerificationBanner } from '../../components/auth/EmailVerificationBanner';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUserData } from '../../hooks/useUserData';
import { CameraAnimation } from '../../components/shared/CameraAnimation';

export function EditProfile() {
  const { language } = useLanguage();
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' 
            ? 'ไม่พบข้อมูลผู้ใช้' 
            : 'User profile not found'}
        </p>
      </div>
    );
  }

  const getProfileTitle = () => {
    if (!userData.occupation) return language === 'th' ? 'แก้ไขโปรไฟล์' : 'Edit Profile';

    switch (userData.occupation) {
      case 'director':
        return language === 'th' ? 'แก้ไขโปรไฟล์ผู้กำกับ' : 'Edit Director Profile';
      case 'crew':
        return language === 'th' ? 'แก้ไขโปรไฟล์ทีมงาน' : 'Edit Crew Profile';
      case 'school student':
        return language === 'th' ? 'แก้ไขโปรไฟล์นักเรียน' : 'Edit Student Profile';
      case 'college student':
        return language === 'th' ? 'แก้ไขโปรไฟล์นักศึกษา' : 'Edit College Student Profile';
      case 'general people':
        return language === 'th' ? 'แก้ไขโปรไฟล์สมาชิกทั่วไป' : 'Edit Public Profile';
      default:
        return language === 'th' ? 'แก้ไขโปรไฟล์สมาชิก' : 'Edit Member Profile';
    }
  };

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
                  {getProfileTitle()}
                </h1>
                <p className="text-gray-400">
                  {language === 'th' ? 'อีเมล' : 'Email'}: {userData.email}
                </p>
              </div>

              {/* Add Email Verification Banner */}
              <EmailVerificationBanner />

              <ProfileEditor 
                initialData={userData} 
                title={getProfileTitle()}
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default EditProfile;
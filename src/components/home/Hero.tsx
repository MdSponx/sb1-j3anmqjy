import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';

export function Hero() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { userData } = useUserData();

  const handleCTAClick = () => {
    // If user is logged in and has an occupation, go to edit profile
    if (user && userData?.occupation) {
      window.location.href = '/edit-profile';
    } else {
      // Otherwise go to registration
      window.location.href = '/register';
    }
  };

  return (
    <section className="relative h-[100vh] min-h-[500px] max-h-[800px]">
      <div className="absolute inset-0">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/tfda-member-list.firebasestorage.app/o/Web%20Asset%2FPhotos%2Fcover.jpg?alt=media&token=b95bcf3b-1342-486a-972d-4c372ac28fde"
          alt="Film director background"
          className="w-full h-full object-cover object-[75%_20%] sm:object-center brightness-50" 
        />
      </div>
      
      <div className="relative h-full flex items-center">
        <Container className="px-4 sm:px-6 md:px-8">
          <div className="max-w-xl mx-auto md:mx-0 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
              {language === 'th' 
                ? 'สมาคมผู้กำกับภาพยนตร์ไทย'
                : 'Thai Film Director Association'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 mb-6 md:mb-8">
              {language === 'th'
                ? 'ร่วมสร้างอนาคตของวงการภาพยนตร์ไทยไปด้วยกัน'
                : 'Shaping the future of Thai cinema together'}
            </p>
            <Button 
              className="
                w-full sm:w-auto 
                text-sm sm:text-base lg:text-lg
                px-4 sm:px-6 lg:px-8 
                py-2 sm:py-2.5 lg:py-3
                min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]
              "
              onClick={handleCTAClick}
            >
              {language === 'th' ? 'เข้าร่วมกับเรา' : 'Join Us'}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
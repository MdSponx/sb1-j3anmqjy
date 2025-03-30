import React from 'react';
import { Container } from '../components/ui/Container';
import { CameraAnimation } from '../components/shared/CameraAnimation';
import { useLanguage } from '../contexts/LanguageContext';

export function UnderProduction() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Container>
        <div className="text-center">
          <div className="mb-8">
            <CameraAnimation />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {language === 'th' 
              ? 'ขออภัย, หน้านี้กำลังอยู่ในขั้นตอนการสร้าง'
              : 'Sorry, this page is under production'}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-lg mx-auto">
            {language === 'th'
              ? 'เราจะกลับมาให้เร็วที่สุด ขอบคุณสำหรับการรอคอย'
              : "We'll be back as soon as possible. Thank you for your patience"}
          </p>
        </div>
      </Container>
    </div>
  );
}
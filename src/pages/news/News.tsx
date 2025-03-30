import React, { useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';

export function NewsPage() {
  const { language } = useLanguage();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.elfsight.com/platform/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'th' ? 'ข่าวสารสมาคมฯ' : 'News'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-12">
            {language === 'th'
              ? 'ติดตามความเคลื่อนไหวของพวกเราได้ที่นี่'
              : 'Stay updated with our latest activities'}
          </p>
          <div
            className="elfsight-app-81acee84-de71-481c-8120-0f30ad91a544"
            data-elfsight-app-lazy
          />
        </div>
      </Container>
    </div>
  );
}

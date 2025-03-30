import React, { useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export function News() {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const updateWidgetHeight = () => {
      if (sectionRef.current) {
        const widgetContainer = document.querySelector('.elfsight-app-81acee84-de71-481c-8120-0f30ad91a544');
        if (widgetContainer) {
          widgetContainer.setAttribute('style', `
            height: 600px !important;
            overflow-y: auto !important;
            background: transparent !important;
            border-radius: 0.5rem !important;
          `);
        }
      }
    };

    // Initial update
    updateWidgetHeight();
    
    // Update on resize
    window.addEventListener('resize', updateWidgetHeight);
    
    // Update periodically for the first few seconds to ensure widget is loaded
    const interval = setInterval(updateWidgetHeight, 500);
    setTimeout(() => clearInterval(interval), 5000);

    return () => {
      window.removeEventListener('resize', updateWidgetHeight);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-black">
      <Container>
        <div className="flex flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {language === 'th' 
                ? 'ข่าวสารและกิจกรรม'
                : 'News & Updates'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-light">
              {language === 'th'
                ? 'ติดตามความเคลื่อนไหวของสมาคมฯ'
                : 'Stay updated with our latest activities'}
            </p>
          </div>
          <a 
            href="/news" 
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5
            bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 
            text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </a>
        </div>
        <div 
          className="elfsight-app-81acee84-de71-481c-8120-0f30ad91a544" 
          data-elfsight-app-lazy
          style={{
            height: '600px',
            overflowY: 'auto',
            background: 'transparent',
            borderRadius: '0.5rem'
          }}
        />
      </Container>
    </section>
  );
}
import React from 'react';
import { CommitteeMember } from '../../types/committee';
import { User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommitteeHeroProps {
  president: CommitteeMember | undefined;
}

export function CommitteeHero({ president }: CommitteeHeroProps) {
  const { language } = useLanguage();
  
  if (!president) return null;

  return (
   <section className="relative h-[600px] sm:h-[600px] lg:h-[700px]">
      <div className="absolute inset-0">
        {president.photo ? (
          <img
            src={president.photo}
            alt={president.name}
            className="w-full h-full object-cover object-[15%_85%]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <User className="w-32 h-32 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      
      <div className="absolute inset-0">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
          <div className="max-w-3xl text-center mx-auto pt-28 sm:pt-32">
            <p className="text-base sm:text-xl lg:text-2xl text-white font-light mb-4 sm:mb-6">
              {language === 'th' 
                ? 'คณะกรรมการสมาคมผู้กำกับภาพยนตร์ไทย 2568 - 2570'
                : 'Thai Film Director Association Committee 2025 - 2027'}
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              {president.name}
            </h2>
            <p className="text-lg sm:text-2xl lg:text-3xl text-red-500 font-medium">
              {language === 'th' 
                ? 'นายกสมาคมผู้กำกับภาพยนตร์ไทย' 
                : 'President of Thai Film Director Association'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
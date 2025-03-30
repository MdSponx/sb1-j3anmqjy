import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export function ProjectHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        {t('projects.title')}
      </h2>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-light">
        {t('projects.subtitle')}
      </p>
    </div>
  );
}
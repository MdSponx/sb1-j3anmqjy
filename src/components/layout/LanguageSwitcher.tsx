import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`px-3 py-2 text-white/80 hover:text-white transition-colors duration-200 ${className}`}
      aria-label="Switch language"
    >
      {language.toUpperCase()}
    </button>
  );
}
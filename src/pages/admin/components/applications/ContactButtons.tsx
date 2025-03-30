import React, { memo } from 'react';
import { Mail, Phone, Film } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface ContactButtonProps {
  type: 'email' | 'phone' | 'portfolio';
  value?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ContactButton = memo(function ContactButton({
  type,
  value,
  onClick,
  disabled
}: ContactButtonProps) {
  const { language } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5" />;
      case 'portfolio':
        return <Film className="w-3.5 h-3.5" />;
    }
  };

  const getTitle = () => {
    if (language === 'th') {
      switch (type) {
        case 'email':
          return 'อีเมล';
        case 'phone':
          return 'โทรศัพท์';
        case 'portfolio':
          return 'ผลงาน';
      }
    }
    return type;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || (!value && type !== 'portfolio')}
      className={`p-1.5 rounded-lg ${
        disabled || (!value && type !== 'portfolio')
          ? 'opacity-50 cursor-not-allowed bg-black/30'
          : 'bg-black/50 hover:bg-black/70'
      } text-white transition-colors`}
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
    </button>
  );
});
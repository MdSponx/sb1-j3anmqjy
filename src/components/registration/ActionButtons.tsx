import React from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

interface ActionButtonsProps {
  onPublicRegister: () => void;
  onContactAdmin: () => void;
  className?: string;
}

export function ActionButtons({ onPublicRegister, onContactAdmin, className = '' }: ActionButtonsProps) {
  const { language } = useLanguage();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onPublicRegister}
          variant="outline"
          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border-blue-500/50"
        >
          {language === 'th' ? 'สมัครแบบประชาชนทั่วไป' : 'Register as Public User'}
        </Button>
        <Button
          onClick={onContactAdmin}
          variant="outline"
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
        >
          {language === 'th' ? 'ติดต่อผู้ดูแลระบบ' : 'Contact Admin'}
        </Button>
      </div>
    </div>
  );
}
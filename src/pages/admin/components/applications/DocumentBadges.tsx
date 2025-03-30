import React from 'react';
import { FileText, Receipt } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { DirectorApplication } from '../../types/application';

interface DocumentBadgesProps {
  application: DirectorApplication;
  onImageSelect?: (url: string) => void;
}

export function DocumentBadges({ application, onImageSelect }: DocumentBadgesProps) {
  const { language } = useLanguage();

  const handleImageClick = (url: string | undefined) => {
    if (url && onImageSelect) {
      onImageSelect(url);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleImageClick(application.id_card_image_url)}
        disabled={!application.id_card_image_url}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          transition-colors duration-200
          ${application.id_card_image_url
            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <FileText className="w-3.5 h-3.5" />
        <span>{language === 'th' ? 'บัตรประชาชน' : 'ID Card'}</span>
      </button>

      <button
        onClick={() => handleImageClick(application.payment_slip_url)}
        disabled={!application.payment_slip_url}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          transition-colors duration-200
          ${application.payment_slip_url
            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <Receipt className="w-3.5 h-3.5" />
        <span>{language === 'th' ? 'สลิปการโอน' : 'Payment Slip'}</span>
      </button>
    </div>
  );
}
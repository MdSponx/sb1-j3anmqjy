import React, { memo } from 'react';
import { FileText, Receipt } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface DocumentBadgeProps {
  type: 'id' | 'payment';
  onClick: () => void;
  disabled?: boolean;
}

export const DocumentBadge = memo(function DocumentBadge({
  type,
  onClick,
  disabled
}: DocumentBadgeProps) {
  const { language } = useLanguage();

  const getIcon = () => {
    return type === 'id' ? (
      <FileText className="w-3 h-3" />
    ) : (
      <Receipt className="w-3 h-3" />
    );
  };

  const getLabel = () => {
    if (language === 'th') {
      return type === 'id' ? 'บัตรประชาชน' : 'สลิปการโอน';
    }
    return type === 'id' ? 'ID Card' : 'Payment Slip';
  };

  const getBadgeColors = () => {
    if (disabled) {
      return 'bg-gray-700 text-gray-400 cursor-not-allowed';
    }
    return type === 'id'
      ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${getBadgeColors()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </button>
  );
});
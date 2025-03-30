import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface StatusBadgeProps {
  status: 'Open' | 'Ongoing' | 'Coming Soon' | 'Closed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { language } = useLanguage();

  const getStatusColors = () => {
    switch (status) {
      case 'Open':
        return 'bg-green-500/20 text-green-400';
      case 'Ongoing':
        return 'bg-blue-500/20 text-blue-400';
      case 'Coming Soon':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = () => {
    if (language === 'th') {
      switch (status) {
        case 'Open':
          return 'เปิดรับสมัคร';
        case 'Ongoing':
          return 'กำลังดำเนินการ';
        case 'Coming Soon':
          return 'เร็วๆ นี้';
        case 'Closed':
          return 'ปิดรับสมัคร';
        default:
          return status;
      }
    }
    return status;
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColors()}`}>
      {getStatusText()}
    </span>
  );
}
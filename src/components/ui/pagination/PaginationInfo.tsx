import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationInfo({ currentPage, totalPages }: PaginationInfoProps) {
  const { language } = useLanguage();

  return (
    <div className="text-gray-400 text-sm">
      {language === 'th'
        ? `หน้า ${currentPage} จาก ${totalPages}`
        : `Page ${currentPage} of ${totalPages}`}
    </div>
  );
}
import React from 'react';
import { Button } from './button';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPageRange, isValidPage } from '../../lib/utils/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: PaginationProps) {
  const { language } = useLanguage();
  const pageRange = getPageRange(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    if (isValidPage(page, totalPages) && !isLoading) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="outline"
          size="lg"
          className="min-w-[120px] h-12 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 disabled:opacity-50"
        >
          {language === 'th' ? 'ก่อนหน้า' : 'Previous'}
        </Button>

        <div className="flex items-center gap-2">
          {pageRange.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="lg"
              className={`w-12 h-12 ${
                currentPage === page
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
              }`}
              disabled={isLoading}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          variant="outline"
          size="lg"
          className="min-w-[120px] h-12 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 disabled:opacity-50"
        >
          {language === 'th' ? 'ถัดไป' : 'Next'}
        </Button>
      </div>

      <div className="text-gray-400 text-sm">
        {language === 'th'
          ? `หน้า ${currentPage} จาก ${totalPages}`
          : `Page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  );
}
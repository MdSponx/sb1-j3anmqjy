import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function PaginationNav({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: PaginationNavProps) {
  const { language } = useLanguage();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach(i => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <Button
                  onClick={() => onPageChange(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-10 w-10 ${
                    currentPage === page
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
                  }`}
                  disabled={isLoading}
                >
                  {page}
                </Button>
              ) : (
                <span className="text-gray-500 px-1">{page}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
        >
          <ChevronRight className="h-4 w-4" />
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
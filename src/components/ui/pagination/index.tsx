import React from 'react';
import { PaginationButton } from './PaginationButton';
import { PaginationControls } from './PaginationControls';
import { PaginationInfo } from './PaginationInfo';
import { getPageRange } from '../../../lib/utils/pagination';

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
  if (totalPages <= 1) return null;

  const pageRange = getPageRange(currentPage, totalPages);
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-4">
        <PaginationControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          disabled={isLoading}
          showPrevious={showPrevious}
          showNext={showNext}
        />

        <div className="flex items-center gap-2">
          {pageRange.map((page) => (
            <PaginationButton
              key={page}
              page={page}
              isActive={currentPage === page}
              onClick={onPageChange}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      <PaginationInfo
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export * from './PaginationButton';
export * from './PaginationControls';
export * from './PaginationInfo';
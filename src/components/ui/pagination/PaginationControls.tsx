import React from 'react';
import { Button } from '../button';
import { useLanguage } from '../../../contexts/LanguageContext';

interface PaginationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
  showPrevious?: boolean;
  showNext?: boolean;
}

export function PaginationControls({
  onPrevious,
  onNext,
  disabled,
  showPrevious = true,
  showNext = true
}: PaginationControlsProps) {
  const { language } = useLanguage();

  return (
    <>
      {showPrevious && (
        <Button
          onClick={onPrevious}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="min-w-[120px] h-12 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 disabled:opacity-50"
        >
          {language === 'th' ? 'ก่อนหน้า' : 'Previous'}
        </Button>
      )}

      {showNext && (
        <Button
          onClick={onNext}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="min-w-[120px] h-12 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 disabled:opacity-50"
        >
          {language === 'th' ? 'ถัดไป' : 'Next'}
        </Button>
      )}
    </>
  );
}
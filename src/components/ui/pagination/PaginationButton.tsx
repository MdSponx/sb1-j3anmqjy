import React from 'react';
import { Button } from '../button';
import { cn } from '../../../lib/utils';

interface PaginationButtonProps {
  page: number;
  isActive?: boolean;
  onClick: (page: number) => void;
  disabled?: boolean;
}

export function PaginationButton({ 
  page, 
  isActive, 
  onClick, 
  disabled 
}: PaginationButtonProps) {
  return (
    <Button
      onClick={() => onClick(page)}
      variant={isActive ? "default" : "outline"}
      size="lg"
      className={cn(
        "w-12 h-12",
        isActive
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
      )}
      disabled={disabled}
    >
      {page}
    </Button>
  );
}
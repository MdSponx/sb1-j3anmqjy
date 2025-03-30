import React from 'react';
import { CameraAnimation } from '../shared/CameraAnimation';
import { DirectorCard } from './DirectorCard';
import { SearchState } from '../../types/director';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchResultsProps {
  searchState: SearchState;
}

export function SearchResults({ searchState }: SearchResultsProps) {
  const { language } = useLanguage();
  const { results, isSearching, error, query } = searchState;

  // Don't show anything if there's no query
  if (!query) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="flex justify-center items-center py-12">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          {language === 'th' 
            ? 'เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง' 
            : 'An error occurred while searching. Please try again.'}
        </p>
      </div>
    );
  }

  // Only show "No director found" if there's a query but no results
  if (query && (!results || results.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th' 
            ? 'ไม่พบผู้กำกับที่ค้นหา' 
            : 'No director found'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {results?.map((director) => (
        <div 
          key={director.id} 
          className="cursor-pointer"
          onClick={() => director.onClick?.()}
        >
          <DirectorCard director={director} />
        </div>
      ))}
    </div>
  );
}
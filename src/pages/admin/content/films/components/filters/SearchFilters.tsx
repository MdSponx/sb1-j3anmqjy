import React from 'react';
import { YearFilter } from './YearFilter';
import { GenreFilter } from './GenreFilter';
import { SearchInput } from './SearchInput';
import { Button } from '../../../../../../components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  genres: string[];
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedGenres,
  onGenreChange,
  genres,
  onClearFilters,
  isLoading
}: SearchFiltersProps) {
  const { language } = useLanguage();
  const hasActiveFilters = searchQuery || selectedYear !== 'all' || selectedGenres.length > 0;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">
          {language === 'th' ? 'ค้นหาและกรอง' : 'Search & Filter'}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            {language === 'th' ? 'ล้างตัวกรอง' : 'Clear Filters'}
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input - 60% */}
        <div className="w-full md:w-3/5">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            disabled={isLoading}
          />
        </div>
        
        {/* Year Filter - 20% */}
        <div className="w-full md:w-1/5">
          <YearFilter
            value={selectedYear}
            onChange={onYearChange}
            disabled={isLoading}
          />
        </div>

        {/* Genre Filter - 20% */}
        <div className="w-full md:w-1/5">
          <GenreFilter
            value={selectedGenres}
            onChange={onGenreChange}
            options={genres}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
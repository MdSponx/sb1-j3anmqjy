import React from 'react';
import { SearchInput } from './SearchInput';
import { YearFilter } from './YearFilter';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  years: string[];
  isLoading?: boolean;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  onSearchClear,
  selectedYear,
  onYearChange,
  years,
  isLoading
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input - 60% */}
      <div className="w-full md:w-3/5">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onSearchClear}
          disabled={isLoading}
        />
      </div>
      
      {/* Year Filter - 20% */}
      <div className="w-full md:w-1/5">
        <YearFilter
          selectedYear={selectedYear}
          years={years}
          onYearChange={onYearChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
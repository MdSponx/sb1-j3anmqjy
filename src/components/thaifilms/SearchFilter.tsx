import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Select } from '../ui/select';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  years: string[];
  isLoading?: boolean;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  years,
  isLoading
}: SearchFilterProps) {
  const { language } = useLanguage();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onYearChange(value === 'all' ? 'all' : value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={language === 'th' ? 'ค้นหาชื่อภาพยนตร์...' : 'Search movies...'}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                   border border-gray-600 focus:border-red-500
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isLoading}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <Select
        value={selectedYear}
        onChange={handleYearChange}
        className="w-full sm:w-48 bg-gray-800 border-gray-600 text-white"
        disabled={isLoading}
      >
        <option value="all">
          {language === 'th' ? 'ทุกปี' : 'All Years'}
        </option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </div>
  );
}
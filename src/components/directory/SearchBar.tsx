import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SearchBar({ 
  query, 
  onSearch, 
  onClear, 
  disabled,
  placeholder 
}: SearchBarProps) {
  const { language } = useLanguage();

  const defaultPlaceholder = language === 'th' 
    ? 'ค้นหา...' 
    : 'Search...';

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                 border border-gray-600 focus:border-red-500
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        disabled={disabled}
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                   hover:text-white transition-colors"
          disabled={disabled}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, onClear, disabled }: SearchInputProps) {
  const { language } = useLanguage();

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={language === 'th' ? 'ค้นหาชื่อภาพยนตร์...' : 'Search movies...'}
        className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                 border border-gray-600 focus:border-red-500
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        disabled={disabled}
      />
      {value && (
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
import React from 'react';
import { SearchBar } from '../directory/SearchBar';
import { SearchResults } from '../directory/SearchResults';
import { useLanguage } from '../../contexts/LanguageContext';
import type { SearchState, Director } from '../../types/director';

interface DirectorSearchFormProps {
  searchState: SearchState;
  onSearch: (query: string) => void;
  onClear: () => void;
  onSelect: (director: Director) => void;
}

export function DirectorSearchForm({
  searchState,
  onSearch,
  onClear,
  onSelect
}: DirectorSearchFormProps) {
  const { language } = useLanguage();

  const handleDirectorClick = (director: Director) => {
    onSelect(director);
  };

  return (
    <div>
      <div className="mb-6">
        <SearchBar
          query={searchState.query}
          onSearch={onSearch}
          onClear={onClear}
          disabled={searchState.isSearching}
        />
      </div>

      <div className="relative">
        <SearchResults 
          searchState={{
            ...searchState,
            results: searchState.results?.map(director => ({
              ...director,
              onClick: () => handleDirectorClick(director)
            }))
          }}
        />

        {!searchState.query && !searchState.results && (
          <p className="text-center text-gray-400 py-8">
            {language === 'th'
              ? 'กรุณาพิมพ์ชื่อ-นามสกุลเพื่อค้นหา'
              : 'Please type your name to search'}
          </p>
        )}
      </div>
    </div>
  );
}
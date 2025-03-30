import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { MovieCard } from './MovieCard';
import { RoleSelectionDialog } from './RoleSelectionDialog';
import type { Movie } from '../../../../types/movie';

interface MovieSearchProps {
  onCreditAdded: () => void;
}

export function MovieSearch({ onCreditAdded }: MovieSearchProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { movies, loading, error } = useMovieSearch(searchQuery);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCreditSuccess = () => {
    setSearchQuery(''); // Clear search
    setSelectedMovie(null); // Clear selected movie
    onCreditAdded(); // Refresh credits table
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'th' ? 'ค้นหาภาพยนตร์ที่คุณเคยทำผลงานด้วย' : 'Search movies that you have credit'}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                   border border-gray-600 focus:border-red-500
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieSelect(movie)}
            />
          ))}
        </div>
      )}

      {/* Role Selection Dialog */}
      {selectedMovie && (
        <RoleSelectionDialog
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSuccess={handleCreditSuccess}
        />
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            {language === 'th' ? 'กำลังค้นหา...' : 'Searching...'}
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">
            {language === 'th'
              ? 'เกิดข้อผิดพลาดในการค้นหา'
              : 'Error searching movies'}
          </p>
        </div>
      )}
    </div>
  );
}
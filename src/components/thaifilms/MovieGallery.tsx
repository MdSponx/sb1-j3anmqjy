import React from 'react';
import { MovieCard } from './MovieCard';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Movie } from '../../types/movie';

interface MovieGalleryProps {
  movies: Movie[];
  onMovieClick?: (movieId: string) => void;
  isEditable?: boolean;
}

export function MovieGallery({ movies, onMovieClick, isEditable = false }: MovieGalleryProps) {
  const { language } = useLanguage();

  // Sort movies: first by release_date (newest first), then by Thai title for those without release_date
  const sortedMovies = [...movies].sort((a, b) => {
    // If both have release dates, sort by date (newest first)
    if (a.release_date && b.release_date) {
      return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
    }
    
    // If only one has release date, prioritize it
    if (a.release_date) return -1;
    if (b.release_date) return 1;
    
    // If neither has release date, sort by Thai title
    return a.title.localeCompare(b.title, 'th');
  });

  if (!sortedMovies.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่พบภาพยนตร์ที่ตรงกับการค้นหา'
            : 'No movies found matching your search'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sortedMovies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie}
          onMovieClick={onMovieClick}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { getDefaultPosterUrl } from '../../lib/utils/movies';
import { formatDate } from '../../lib/utils/date';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Movie } from '../../types/movie';

interface MovieCardProps {
  movie: Movie;
  onMovieClick?: (movieId: string) => void;
  isEditable?: boolean;
}

export function MovieCard({
  movie,
  onMovieClick,
  isEditable = false,
}: MovieCardProps) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Display date logic - show "Release date undefined" if no release_date
  const displayDate = movie.release_date 
    ? formatDate(movie.release_date, language)
    : language === 'th'
      ? 'ไม่ระบุวันที่เข้าฉาย'
      : 'Release date undefined';

  const handleClick = () => {
    if (isEditable && onMovieClick) {
      onMovieClick(movie.id);
    } else {
      window.location.href = `/thaifilms/${movie.id}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden 
        hover:scale-[1.02] transition-transform duration-200 
        ${isEditable ? 'cursor-pointer' : ''}
      `}
    >
      {movie.poster && !imageError ? (
        <img
          src={movie.poster}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Film className="w-12 h-12 text-gray-700" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400">{displayDate}</p>
      </div>
    </div>
  );
}
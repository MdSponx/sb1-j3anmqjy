import React from 'react';
import { Film } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Movie } from '../../../../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { language } = useLanguage();

  // Safely format year from release_date
  const getYear = () => {
    if (!movie.release_date) return '';
    try {
      const date = new Date(movie.release_date);
      if (isNaN(date.getTime())) return '';
      return date.getFullYear().toString();
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200"
    >
      <div className="aspect-[2/3] relative">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="text-white font-medium mb-1 line-clamp-2">
          {language === 'th' ? movie.title : movie.titleEng || movie.title}
        </h3>
        <p className="text-sm text-gray-400">
          {getYear()}
        </p>
      </div>
    </div>
  );
}
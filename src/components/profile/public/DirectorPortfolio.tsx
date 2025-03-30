import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFirebase } from '../../../contexts/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Film, ArrowRight } from 'lucide-react';
import { MovieCard } from '../../../components/thaifilms/MovieCard';
import type { Movie } from '../../../types/movie';

interface DirectorPortfolioProps {
  userId: string;
  fullname_th?: string;
  onProjectsCountChange?: (count: number) => void;
}

export function DirectorPortfolio({ userId, fullname_th, onProjectsCountChange }: DirectorPortfolioProps) {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!fullname_th) return;
      
      try {
        setLoading(true);
        const moviesRef = collection(db, 'movies');
        const snapshot = await getDocs(moviesRef);
        
        const moviesList = snapshot.docs
          .filter(doc => {
            const directors = doc.data().Director || '';
            return directors.split(',').some(d => d.trim() === fullname_th);
          })
          .map(doc => ({
            id: doc.id,
            title: doc.data().Movie || '',
            titleEng: doc.data().movieEng || '',
            release_date: doc.data().release_date || '',
            poster: doc.data().poster || null,
            year: doc.data().year_ce?.toString() || '',
            director: doc.data().Director || '',
            synopsis: doc.data().synopsis || '',
            year_be: doc.data().year_be || 0,
            year_ce: doc.data().year_ce || 0
          }));

        // Sort movies by release_date first, then by year if release_date is not available
        moviesList.sort((a, b) => {
          // If both have release dates, compare them
          if (a.release_date && b.release_date) {
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
          }
          
          // If only one has release_date, prioritize it
          if (a.release_date) return -1;
          if (b.release_date) return 1;
          
          // If neither has release_date, compare by year_ce
          return (b.year_ce || 0) - (a.year_ce || 0);
        });

        setMovies(moviesList);
        
        // Notify parent component about the project count
        if (onProjectsCountChange) {
          onProjectsCountChange(moviesList.length);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [db, fullname_th, onProjectsCountChange]);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading movies</div>;
  }

  if (!movies.length) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Directing Portfolio Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <a 
            href="#directing"
            className="text-2xl font-bold text-white hover:text-red-500 transition-colors"
          >
            {language === 'th' ? 'ผลงานการกำกับ' : 'Directing Portfolio'}
          </a>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
            <Film className="w-5 h-5 text-red-500" />
            <span className="text-lg font-bold text-red-500">
              {movies.length}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
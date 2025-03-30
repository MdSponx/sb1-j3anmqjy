import React from 'react';
import { Container } from '../../components/ui/Container';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMovieDetails } from './hooks/useMovieDetails';
import { CameraAnimation } from '../../components/shared/CameraAnimation';
import { Film, Youtube, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { CastContainer } from '../../components/thaifilms/CastContainer';
import { CrewCarousel } from '../../components/thaifilms/CrewCarousel';

// Helper function to format movie length
const formatLength = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export function MovieDetailsPage() {
  const { language } = useLanguage();
  const movieId = window.location.pathname.split('/').pop() || '';
  const { movie, directors, crew, loading, error } = useMovieDetails(movieId);

  // Simplified YouTube ID extraction
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = movie?.trailer_url ? getYouTubeId(movie.trailer_url) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' ? 'ไม่พบข้อมูลภาพยนตร์' : 'Movie not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Return Button */}
          <Button
            onClick={() => window.location.href = '/thaifilms'}
            variant="ghost"
            className="mb-8 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'th' ? 'กลับไปหน้ารวมภาพยนตร์' : 'Back to Movies'}
          </Button>

          {/* Movie Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              {language === 'th' ? movie.title : movie.titleEng || movie.title}
            </h1>
            {movie.titleEng && language === 'th' && (
              <p className="text-xl text-gray-400">{movie.titleEng}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Poster and Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Poster */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Movie Details */}
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                {/* Release Date */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    {language === 'th' ? 'วันที่เข้าฉาย' : 'Release Date'}
                  </h3>
                  <p className="text-white">
                    {new Date(movie.release_date).toLocaleDateString(
                      language === 'th' ? 'th-TH' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>

                {/* Genre */}
                {movie.genre && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      {language === 'th' ? 'ประเภท' : 'Genre'}
                    </h3>
                    <p className="text-white">{movie.genre}</p>
                  </div>
                )}

                {/* Length */}
                {movie.length && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      {language === 'th' ? 'ความยาว' : 'Length'}
                    </h3>
                    <p className="text-white flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatLength(movie.length)}
                    </p>
                  </div>
                )}

                {/* Rating */}
                {movie.rating && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      {language === 'th' ? 'เรท' : 'Rating'}
                    </h3>
                    <p className="text-white">{movie.rating}</p>
                  </div>
                )}
              </div>

              {/* Cast */}
              {movie.cast && <CastContainer cast={movie.cast} />}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trailer */}
              {youtubeId && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block w-full h-full"
                  >
                    {/* YouTube Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                      onError={(e) => {
                        // Fallback to medium quality if maxres doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
                      }}
                      alt={`${movie.title} Trailer`}
                      className="w-full h-full object-cover"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all">
                      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-600 group-hover:bg-red-700 transition-colors">
                        <svg
                          className="w-10 h-10 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Directors Section */}
              {directors.length > 0 && (
                <div className="bg-gray-800/20 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    {language === 'th' ? 'กำกับโดย' : 'Directed by'}
                  </h2>
                  <div className="flex flex-wrap gap-8">
                    {directors.map((director, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-red-500 shadow-lg">
                          {director.photo ? (
                            <img
                              src={director.photo}
                              alt={director.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-12 h-12 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {director.name}
                          </h3>
                          {director.name_en && (
                            <p className="text-lg text-gray-400">
                              {director.name_en}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              {movie.synopsis && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {language === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
                  </h3>
                  <p className="text-white leading-relaxed whitespace-pre-line">
                    {movie.synopsis}
                  </p>
                </div>
              )}

              {/* Crew Section */}
              {crew.length > 0 && (
                <CrewCarousel crew={crew} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MovieDetailsPage;
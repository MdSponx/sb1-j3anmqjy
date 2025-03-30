import React, { useState, useCallback } from 'react';
import { MovieGallery } from '../../../../../components/thaifilms/MovieGallery';
import { SearchFilters } from './filters/SearchFilters';
import { Pagination } from '../../../../../components/ui/pagination';
import { Button } from '../../../../../components/ui/button';
import { Plus } from 'lucide-react';
import { useMovies } from '../../../../../hooks/useMovies';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { CameraAnimation } from '../../../../../components/shared/CameraAnimation';
import { MovieEditorPanel } from '../../../../../components/thaifilms/editor/MovieEditorPanel';

export function ThaiFilmDataEditor() {
  const { language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | undefined>();

  // Debounce search query
  const debouncedSearch = useDebounce(searchInput, 500);

  const { 
    movies, 
    loading, 
    error, 
    totalPages,
    refreshData 
  } = useMovies(debouncedSearch, currentPage, selectedYear);

  // Mock genres - replace with actual genres from your database
  const genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance'];

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleGenreChange = (genres: string[]) => {
    setSelectedGenres(genres);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedYear('all');
    setSelectedGenres([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMovie = () => {
    setSelectedMovieId(undefined);
    setIsEditorOpen(true);
  };

  const handleEditMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedMovieId(undefined);
  };

  const handleSaveSuccess = useCallback(() => {
    refreshData();
  }, [refreshData]);

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500 p-4">
        <p className="text-red-500">
          {language === 'th' 
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง'
            : 'Error loading data. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleAddMovie}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'th' ? 'เพิ่มภาพยนตร์' : 'Add Movie'}
        </Button>
      </div>

      <SearchFilters
        searchQuery={searchInput}
        onSearchChange={handleSearchChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        selectedGenres={selectedGenres}
        onGenreChange={handleGenreChange}
        genres={genres}
        onClearFilters={handleClearFilters}
        isLoading={loading}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CameraAnimation />
        </div>
      ) : (
        <>
          <MovieGallery 
            movies={movies} 
            onMovieClick={handleEditMovie}
            isEditable={true}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      )}

      <MovieEditorPanel
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        movieId={selectedMovieId}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
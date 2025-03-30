import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { MovieGallery } from '../../components/thaifilms/MovieGallery';
import { FilterBar } from './components/FilterBar';
import { Pagination } from '../../components/ui/pagination';
import { useMovies } from '../../hooks/useMovies';
import { useLanguage } from '../../contexts/LanguageContext';
import { useDebounce } from '../../hooks/useDebounce';
import { CameraAnimation } from '../../components/shared/CameraAnimation';

export function ThaiFilmsPage() {
  const { language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search query with 500ms delay
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const { 
    movies, 
    loading, 
    error, 
    totalPages 
  } = useMovies(debouncedSearch, currentPage, selectedYear);

  // Reset to first page when search or year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedYear]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchClear = () => {
    setSearchInput('');
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate years array from 2530 BE to 2568 BE (1987 CE to 2025 CE)
  const years = Array.from({ length: 39 }, (_, i) => {
    const beYear = 2568 - i; // Start from 2568 BE and go backwards
    const ceYear = beYear - 543; // Convert to CE
    return language === 'th' ? beYear.toString() : ceYear.toString();
  });

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th' 
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง'
            : 'Error loading data. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'th' ? 'ทำเนียบหนังไทย' : 'Thai Films Gallery'}
            </h1>
            <p className="text-lg text-gray-400">
              {language === 'th'
                ? 'รวบรวมผลงานภาพยนตร์ไทยตั้งแต่อดีตจนถึงปัจจุบัน'
                : 'A comprehensive collection of Thai films from past to present'}
            </p>
          </div>

          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8">
            <FilterBar
              searchQuery={searchInput}
              onSearchChange={handleSearchChange}
              onSearchClear={handleSearchClear}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              years={years}
              isLoading={loading}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <CameraAnimation />
            </div>
          ) : (
            <>
              <MovieGallery movies={movies} />
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
        </div>
      </Container>
    </div>
  );
}
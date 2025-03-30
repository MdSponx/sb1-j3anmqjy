export interface Movie {
  id: string;
  title: string;
  titleEng?: string;
  release_date: string;
  poster: string | null;
  year?: string;
  director?: string;
  synopsis?: string;
  year_be: number;  // เพิ่ม year_be
  year_ce: number;
}

export interface MovieFilters {
  searchQuery: string;
  year?: string;
  page: number;
}


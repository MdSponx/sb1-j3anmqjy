// Define strict types for movie data
export interface MovieDocument {
  id: string;
  Movie: string;
  year_ce: number;
  release_date: string;
  // Add other fields as needed
}

export interface MovieQueryOptions {
  page: number;
  searchQuery?: string;
  year?: string | number;
}

export interface MovieQueryResult {
  movies: MovieDocument[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface YearFilter {
  value: string;
  yearCE: number;
}
export interface DirectorData {
  Director: string;
  'Latest Work B.E.'?: number;
  'Latest Work C.E.'?: number;
  Movies: string;
  No?: number;
  Since?: number;
  'Total Work': number;
}

export interface Director {
  id: string;
  name: string;
  movies: string[];
  totalWorks: number;
  latestWorkYear: number;
  onClick?: () => void;
}

export interface SearchState {
  query: string;
  results: Director[] | null;
  isSearching: boolean;
  error: Error | null;
}

export interface UserDirectorProfile {
  director_id: string;
  occupation: 'director';
  member_status: 'ว่าที่สามัญ' | 'ว่าที่วิสามัญ';
  payment_status: 'not paid' | 'pending' | 'paid';
  verification_status: 'pending' | 'verified' | 'rejected';
  latest_work_year: number;
}
// types/movieCredits.ts
export interface MovieCredit {
  id: string;
  movieId: string;
  movieTitle: string;
  movieTitleEng?: string;
  moviePoster: string | null;
  role_th: string;
  role_en: string;
  responsibilities: string;
  year: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  userId: string;
  images?: string[]; // แก้เป็น array ของ string แทน เพราะเก็บ URL โดยตรง
}

export interface UseMovieCreditsReturn {
  credits: MovieCredit[];
  loading: boolean;
  error: string | null;
  deleteCredit: (creditId: string) => Promise<boolean>;
  refreshCredits: () => void;
}
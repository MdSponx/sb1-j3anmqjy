export interface CreditRequest {
  id: string;
  movieId: string;
  movieTitle: string;
  movieTitleEng?: string;
  moviePoster?: string; // Added movie poster field
  userId: string;
  userNameTh: string;
  userNameEn?: string;
  userProfileImage?: string;
  role_th: string;
  role_en: string;
  responsibilities?: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  year: number;
  created_at: string;
}
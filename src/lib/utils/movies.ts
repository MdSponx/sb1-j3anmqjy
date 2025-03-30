import { Movie } from '../../types/movie';

export function validateMovieData(data: any): Movie {
  return {
    id: data.id || '',
    title: data.Movie || '',
    titleEng: data.movieEng || '',
    release_date: data.release_date || '',
    poster: data.poster || null,
    year: data.year_ce?.toString() || '',
    director: data.Director || '',
    synopsis: data.synopsis || ''
  };
}

export function formatReleaseDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

export function getDefaultPosterUrl(): string {
  return 'https://firebasestorage.googleapis.com/v0/b/tfda-member-list.appspot.com/o/Web%20Asset%2FPhotos%2Fdefault-movie-poster.jpg?alt=media';
}
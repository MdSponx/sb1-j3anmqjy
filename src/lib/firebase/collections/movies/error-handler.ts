import { FirebaseError } from 'firebase/app';
import { QUERY_ERRORS } from './constants';

export class MovieQueryError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'MovieQueryError';
  }
}

export function handleQueryError(error: unknown): never {
  console.error('Movie query error:', error);

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case QUERY_ERRORS.FAILED_PRECONDITION:
        throw new MovieQueryError(
          'Unable to perform this search combination. Please try a different filter.',
          error
        );
      case QUERY_ERRORS.INVALID_ARGUMENT:
        throw new MovieQueryError(
          'Invalid search parameters. Please check your inputs.',
          error
        );
      default:
        throw new MovieQueryError(
          'An error occurred while fetching movies. Please try again.',
          error
        );
    }
  }

  throw new MovieQueryError(
    'An unexpected error occurred. Please try again.',
    error instanceof Error ? error : undefined
  );
}
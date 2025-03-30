export const MOVIES_PER_PAGE = 20;

export const MOVIE_FIELDS = {
  TITLE: 'Movie',
  YEAR: 'year_ce',
  RELEASE_DATE: 'release_date'
} as const;

export const QUERY_ERRORS = {
  FAILED_PRECONDITION: 'failed-precondition',
  INVALID_ARGUMENT: 'invalid-argument'
} as const;
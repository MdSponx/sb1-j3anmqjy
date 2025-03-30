const MOVIES_PER_PAGE = 20;

export class MoviePagination {
  calculatePagination(totalCount: number, currentPage: number) {
    return {
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / MOVIES_PER_PAGE),
      pageSize: MOVIES_PER_PAGE
    };
  }

  paginateResults<T>(items: T[], page: number): T[] {
    const start = (page - 1) * MOVIES_PER_PAGE;
    return items.slice(start, start + MOVIES_PER_PAGE);
  }
}
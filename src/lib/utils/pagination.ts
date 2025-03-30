export function getPageRange(currentPage: number, totalPages: number): number[] {
  // Show all pages if total pages is 5 or less
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Show first 5 pages if current page is near the start
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  // Show last 5 pages if current page is near the end
  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];
  }

  // Show current page and 2 pages before and after
  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2
  ];
}

export function isValidPage(page: number, totalPages: number): boolean {
  return page >= 1 && page <= totalPages;
}
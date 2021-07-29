interface PaginationHookOptions {
    total: number;
    perPage: number;
    nextPage: number;
    pageCount: number;
    previousPage: number;
}

export function usePagination({
  total,
  perPage,
  nextPage,
  pageCount,
  previousPage,
}: PaginationHookOptions) {
  let pageNumbers = [];

  if (total > perPage) {
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(i);
    }
  }

  return { perPage, nextPage, previousPage, pageNumbers };
}
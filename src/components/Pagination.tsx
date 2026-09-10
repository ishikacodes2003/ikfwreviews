import { ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, pageSize, totalCount, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  // Dynamic pages generator
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3];
    }
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getPageNumbers();
  const showLeadingEllipsis = totalPages > 4 && pages[0] > 1;
  const showTrailingEllipsis = totalPages > 4 && pages[pages.length - 1] < totalPages;

  return (
    <footer className="mx-[7vw] flex h-[70px] items-center justify-between bg-white text-[13px] font-medium max-sm:mx-5 max-sm:h-[54px] max-sm:text-[11px]">
      <p>
        Showing {start} to {end} of {totalCount} reviews
      </p>
      <nav aria-label="Reviews pagination" className="flex items-center gap-6 text-[14px] max-sm:gap-5 max-sm:text-[12px]">
        {showLeadingEllipsis && (
          <>
            <button onClick={() => onPageChange(1)}>1</button>
            <span>...</span>
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            className={
              page === currentPage
                ? "flex h-8 w-8 items-center justify-center rounded-[3px] border border-zinc-500 font-bold"
                : ""
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {showTrailingEllipsis && (
          <>
            <span>...</span>
            <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}
        <button
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </footer>
  );
}

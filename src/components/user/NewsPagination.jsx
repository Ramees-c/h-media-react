import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function NewsPagination({ currentPage, totalPages }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const pathname = location.pathname;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPaginationItems = () => {
    let pages = [];

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    if (currentPage - 1 > 1) pages.push(currentPage - 1);

    if (currentPage !== 1 && currentPage !== totalPages)
      pages.push(currentPage);

    if (currentPage + 1 < totalPages) pages.push(currentPage + 1);

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  const PageLink = ({
    page,
    children,
    className,
    disabled,
    ariaLabel,
  }) => {
    if (disabled) {
      return (
        <span className={className} aria-disabled="true">
          {children}
        </span>
      );
    }

    return (
      <Link
        to={createPageURL(page)}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="flex justify-center items-center gap-2 pt-4">
      {/* Previous */}
      <PageLink
        page={currentPage - 1}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 bg-white border border-gray-300 rounded-md text-gray-600 opacity-80 hover:bg-gray-100 transition-colors cursor-pointer"
        ariaLabel="Previous Page"
      >
        <ChevronLeft size={20} />
      </PageLink>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        {getPaginationItems().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`${item}-${index}`}
                className="flex items-center justify-center w-9 h-9 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <PageLink
              key={item}
              page={item}
              className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                currentPage === item
                  ? "bg-brand-red text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item}
            </PageLink>
          );
        })}
      </div>

      {/* Next */}
      <PageLink
        page={currentPage + 1}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 bg-white border border-gray-300 rounded-md text-gray-600 opacity-80 hover:bg-gray-100 transition-colors cursor-pointer"
        ariaLabel="Next Page"
      >
        <ChevronRight size={20} />
      </PageLink>
    </div>
  );
}

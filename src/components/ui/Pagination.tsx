import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showTotalItems?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  itemsPerPageOptions?: number[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showTotalItems = true,
  showPageNumbers = true,
  maxVisiblePages = 7,
  itemsPerPageOptions = [10, 25, 50, 100],
  size = 'md',
  className = '',
  'data-testid': testId,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Add first page if not in range
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page if not in range
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(parseInt(value, 10));
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const visiblePages = getVisiblePages();

  if (totalPages <= 1 && !showTotalItems && !showItemsPerPage) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between ${className}`}
      data-testid={testId}
    >
      {/* Items info and per-page selector */}
      <div className="flex items-center space-x-4">
        {showTotalItems && (
          <div className="text-sm text-gray-700">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        )}
        
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show:</span>
            <Select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              options={itemsPerPageOptions.map(option => ({
                label: option.toString(),
                value: option,
              }))}
              size={size}
              className="w-20"
            />
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size={buttonSize}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={ChevronLeft}
            className="px-2"
            data-testid={`${testId}-prev`}
          >
            <span className="sr-only">Previous</span>
          </Button>

          {/* Page numbers */}
          {showPageNumbers && (
            <div className="flex items-center space-x-1">
              {visiblePages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-2 text-gray-500"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  );
                }

                const pageNumber = page as number;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <Button
                    key={pageNumber}
                    variant={isCurrentPage ? 'primary' : 'outline'}
                    size={buttonSize}
                    onClick={() => handlePageChange(pageNumber)}
                    className="min-w-[40px]"
                    data-testid={`${testId}-page-${pageNumber}`}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
          )}

          {/* Next button */}
          <Button
            variant="outline"
            size={buttonSize}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={ChevronRight}
            iconPosition="right"
            className="px-2"
            data-testid={`${testId}-next`}
          >
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  );
};

// Simple pagination component for basic use cases
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showLabels?: boolean;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showLabels = true,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={ChevronLeft}
      >
        {showLabels && 'Previous'}
      </Button>
      
      <span className="px-4 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={ChevronRight}
        iconPosition="right"
      >
        {showLabels && 'Next'}
      </Button>
    </div>
  );
};

// Infinite scroll pagination component
interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 100,
  children,
  className = '',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || loading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <div ref={containerRef} className={`overflow-auto ${className}`}>
      {children}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!hasMore && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more items to load
        </div>
      )}
    </div>
  );
};

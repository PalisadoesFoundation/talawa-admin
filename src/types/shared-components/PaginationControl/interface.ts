/**
 * Props for the PaginationControl component
 *
 * Provides standardized pagination interface across Talawa Admin.
 * Replaces inconsistent pagination patterns (paginationModel, onPaginationModelChange, MUI Pagination).
 */
export interface InterfacePaginationControlProps {
  /**
   * Current page number (1-indexed)
   * First page = 1, Second page = 2, etc.
   */
  currentPage: number;

  /**
   * Total number of pages
   * Calculated as: Math.ceil(totalItems / pageSize)
   */
  totalPages: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of items across all pages
   */
  totalItems: number;

  /**
   * Available options for page size selection
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Callback when page changes
   * @param n - New page number (1-indexed)
   */
  onPageChange: (n: number) => void;

  /**
   * Callback when page size changes
   * @param n - New page size
   */
  onPageSizeChange: (n: number) => void;

  /**
   * Disables all pagination controls
   * Useful during loading states
   * @default false
   */
  disabled?: boolean;
}

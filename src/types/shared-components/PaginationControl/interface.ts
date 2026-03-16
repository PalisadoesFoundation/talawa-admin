/**
 * Type definitions for the PaginationControl shared component.
 *
 * @remarks
 * All page values are 1-indexed (page 1 is the first page).
 */

/**
 * Props accepted by the PaginationControl component.
 *
 * @param currentPage - Current active page (1-indexed).
 * @param totalPages - Total number of pages.
 * @param pageSize - Number of items displayed per page.
 * @param totalItems - Total number of items across all pages.
 * @param pageSizeOptions - Array of selectable page-size values. Defaults to [10, 25, 50, 100].
 * @param onPageChange - Callback invoked with the new 1-indexed page number when the page changes.
 * @param onPageSizeChange - Callback invoked with the new page size when the rows-per-page selector changes.
 * @param disabled - When true, all navigation controls and the page-size selector are disabled (e.g. during loading).
 */
export interface IPaginationControlProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  disabled?: boolean;
  /**
   * When true, renders the optional "Jump to page" input control.
   */
  enableJumpToPage?: boolean;
  /**
   * Optional override invoked when the jump-to-page input submits.
   * Defaults to calling `onPageChange`.
   */
  onJumpToPage?: (page: number) => void;
}
